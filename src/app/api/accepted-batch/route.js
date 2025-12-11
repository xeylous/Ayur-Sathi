import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import AcceptedBatch from "@/models/AcceptedBatch";
import CropUpload from "@/models/CropUpload";
import { pusherServer } from "@/lib/pusher";

const uploadToCloudinary = (fileBuffer, fileName, folder = "labUpload") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        format: "pdf",
        unique_filename: true,
        use_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
      }
    );

    stream.end(fileBuffer);
  });
};

export async function GET(req) {
  await connectDB();

  const cookie = req.cookies.get("auth_token");
  if (!cookie) {
    return NextResponse.json(
      { success: false, message: "No auth token provided" },
      { status: 401 }
    );
  }

  const token = cookie.value;

  // Verify JWT token
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    console.log(status, decoded.labId);

    // Filter by both status and labId (from decoded token)
    const batches = await AcceptedBatch.find({
      status,
      acceptedBy: decoded.labId,
    }).lean();

    // console.log("Fetched batches:", batches);

    const Data = batches.map((batch) => ({
      batchId: batch.batchId,

      cropData: batch.cropData,
      speciesId: batch.cropData.speciesId,
      speciesName: batch.cropData.speciesId,
      acceptedAt: batch.acceptedAt
        ? new Date(batch.acceptedAt).toLocaleDateString()
        : null,
      harvestDate: batch.cropData?.timestamp
        ? new Date(batch.cropData.timestamp).toLocaleDateString()
        : null,
    }));

    return NextResponse.json({ success: true, data: Data });
  } catch (error) {
    console.error("GET /accepted-batch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    // 🧩 Verify JWT from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = cookie.value;
    // console.log("token :",token );

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    // 🧩 Extract form data
    const formData = await req.formData();
    const batchId = formData.get("batchId");
    const status = formData.get("status");
    const note = formData.get("note") || null;
    const testsRaw = formData.get("tests");
    const certificate = formData.get("certificate");
    // console.log("formdata :",formData);

    if (!batchId || !status) {
      return NextResponse.json(
        { success: false, message: "Batch ID and status are required" },
        { status: 400 }
      );
    }

    let tests = {};
    if (testsRaw) {
      try {
        tests = JSON.parse(testsRaw);
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid JSON in tests field" },
          { status: 400 }
        );
      }
    }

    // 🧩 Upload certificate if present
    let uploadedFile = null;
    if (certificate && certificate.size > 0) {
      try {
        const buffer = Buffer.from(await certificate.arrayBuffer());
        uploadedFile = await uploadToCloudinary(buffer, certificate.name);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return NextResponse.json(
          { success: false, message: "Failed to upload certificate" },
          { status: 500 }
        );
      }
    }
    // console.log("Incoming batchId:", batchId, "Type:", typeof batchId);
    const acceptedBatch = await AcceptedBatch.findOne({ batchId });
    // console.log("DB found:", acceptedBatch);

    if (!acceptedBatch) {
      return NextResponse.json(
        { success: false, message: "Accepted batch not found" },
        { status: 404 }
      );
    }

    acceptedBatch.status = status;
    // console.log("Updated status to:", status);
    acceptedBatch.acceptedBy = decoded.labId || decoded.uniqueId;
    acceptedBatch.acceptedAt = new Date();

    await acceptedBatch.save();

    // 🧩 Find and update CropUpload
    const crop = await CropUpload.findOne({ batchId });
    if (!crop) {
      return NextResponse.json(
        { success: false, message: "CropUpload entry not found" },
        { status: 404 }
      );
    }

    crop.status = status;
    crop.rejectionReason = note || null;
    crop.acceptedBy = decoded.labId || decoded.uniqueId;
    crop.tests = tests;

    if (uploadedFile) {
      crop.certificate = {
        url: uploadedFile.url,
        uploadedAt: new Date(),
      };
    }

    await crop.save();
// console.log(crop.uniqueId)
    const farmerChannel = `farmer-${String(crop.uniqueId)}`;

// console.log("PUSHER: triggering channel:", farmerChannel, "payload:", {
//   type: status === "Approved" ? "LAB_ACCEPTED" : "LAB_REJECTED",
//   batchId,
//   status,
//   reason: crop.rejectionReason || null,
// });

try {
  const triggerResult = await pusherServer.trigger(farmerChannel, "crop-status", {
    type: status === "Approved" ? "LAB_ACCEPTED" : "LAB_REJECTED",
    batchId,
    status,
    reason: crop.rejectionReason || null,
    message:
      status === "Approved"
        ? `Your crop (Batch ID: ${batchId}) has been approved by the lab.`
        : `Your crop (Batch ID: ${batchId}) was rejected by the lab.`,
    timestamp: Date.now(),
  });
  // console.log("PUSHER triggerResult:", triggerResult);
} catch (err) {
  console.error("PUSHER trigger error:", err);
}


    return NextResponse.json({
      success: true,
      message: "Batch and CropUpload updated successfully",
      data: {
        batchId,
        status,
        certificate: uploadedFile ? uploadedFile.url : crop.certificate.url,
      },
    });
  } catch (error) {
    console.error("POST /accepted-batch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import AcceptedBatch from "@/models/AcceptedBatch";

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

    console.log("Fetched batches:", batches);

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

    // Verify JWT from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = cookie.value;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 403 }
      );
    }

    // Extract form data (because it includes a file)
    const formData = await req.formData();
    const batchId = formData.get("batchId");
    const status = formData.get("status");
    const note = formData.get("note") || null;
    const tests = JSON.parse(formData.get("tests") || "{}");
    const certificate = formData.get("certificate"); // file

    if (!batchId) {
      return NextResponse.json(
        { success: false, message: "Batch ID is required" },
        { status: 400 }
      );
    }

    //  Find crop
    const crop = await CropUpload.findOne({ batchId });
    if (!crop) {
      return NextResponse.json(
        { success: false, message: "Crop not found for this batch ID" },
        { status: 404 }
      );
    }

    // Upload certificate (if provided)
    let uploadedFile = null;
    if (certificate && certificate.size > 0) {
      const buffer = Buffer.from(await certificate.arrayBuffer());
      uploadedFile = await uploadToCloudinary(buffer, certificate.name);
    }

    // Update crop details
    crop.status = status || crop.status;
    crop.rejectionReason = note || null;
    crop.acceptedBy = decoded.labId || decoded.uniqueId;
    crop.tests = tests || {};

    if (uploadedFile) {
      crop.certificate = {
        url: uploadedFile.url,
        uploadedAt: new Date(),
      };
    }

    await crop.save();

    return NextResponse.json({
      success: true,
      message: "Batch updated successfully",
    });
  } catch (error) {
    console.error("POST /lab/update-batch error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

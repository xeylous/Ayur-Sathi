import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import AcceptedBatch from "@/models/AcceptedBatch";
import { unique } from "next/dist/build/utils";
import { u } from "react-router/dist/development/index-react-server-client-BYr9g50r";
import { use } from "react";

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
        else resolve({
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
    // console.log("Fetching batches with status:", status);
    // console.log("decoded labId:", decoded.labId);

    // ✅ Filter by both status and labId (from decoded token)
    const batches = await AcceptedBatch.find({
      status,
      acceptedBy: decoded.labId,
    }).lean();

    console.log("Fetched batches:", batches);

    const Data = batches.map((batch) => ({
      batchId: batch.batchId,
      barcodeUrl: batch.cropData?.batchBarCode?.url || null,
      speciesId: batch.cropData?.speciesId || null,
    }));
    // console.log("Formatted Data:", Data);
    

    return NextResponse.json({ success: true, data: Data });
  } catch (error) {
    console.error("GET /accepted-batch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



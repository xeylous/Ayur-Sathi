import CropUpload from "@/models/CropUpload";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import bwipjs from "bwip-js"; // 📦 npm install bwip-js

function generateBatchName(speciesId) {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${speciesId}-${year}-${randomNum}`;
}

const uploadToCloudinary = (fileBuffer, fileName, folder = "batchBarCode") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        format: "png",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      gpsCoordinates,
      timestamp,
      uniqueId,
      speciesId,
      initialQualityMetrics,
    } = body;

    if (!gpsCoordinates || !speciesId || !uniqueId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const batchId = generateBatchName(speciesId);

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128", // barcode type
      text: batchId,   // text to encode
      scale: 3,        // 3x scaling factor
      height: 10,      // bar height in mm
      includetext: true, // show human-readable text
      textxalign: "center",
    });

    const barcodeUrl = await uploadToCloudinary(
      barcodeBuffer,
      `${batchId}.png`,
      "batchBarCodes"
    );

    const newCrop = new CropUpload({
      batchId,
      uniqueId,
      speciesId,
      gpsCoordinates,
      timestamp: timestamp || new Date(),
      initialQualityMetrics,
      batchBarCodeUrl: barcodeUrl,
    });

    await newCrop.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Crop data uploaded successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading crop data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      }),
      { status: 500 }
    );
  }
}

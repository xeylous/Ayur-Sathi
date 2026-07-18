'use server';
import CropUpload from "@/models/CropUpload";
import { connectDB } from "@/lib/db";
import cloudinary, { uploadImageToCloudinary } from "@/lib/cloudinary";
import bwipjs from "bwip-js"; 
import jwt from "jsonwebtoken";

function generateBatchName(speciesId) {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${speciesId}-${year}-${randomNum}`;
}

// ✅ Upload barcode image to Cloudinary (returns both public_id and URL)
const uploadToCloudinary = (fileBuffer, fileName, folder = "batchBarCodes") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "png",
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

export async function POST(req) {
  try {
    await connectDB();

    
    // Verify JWT from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return new Response(
        JSON.stringify({ success: false, message: "No auth token provided" }),
        { status: 401 }
      );
    }

    const token = cookie.value;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        { status: 403 }
      );
    }

    // ✅ Extract user details from token
    const { uniqueId } = decoded;

    // ✅ Parse FormData (supports both image file and text fields)
    const formData = await req.formData();
    const speciesId = formData.get("speciesId");
    const quantity = formData.get("quantity");
    const latitudeStr = formData.get("latitude");
    const longitudeStr = formData.get("longitude");
    const timestamp = formData.get("timestamp");
    const cropImageFile = formData.get("cropImage"); // File or null

    const gpsCoordinates = {
      latitude: parseFloat(latitudeStr),
      longitude: parseFloat(longitudeStr),
    };

    // ✅ Validate required fields
    if (!gpsCoordinates || !speciesId ) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const batchId = generateBatchName(speciesId);

    // ✅ Generate barcode buffer
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128", // barcode type
      text: batchId,   // text to encode
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    // ✅ Upload barcode to Cloudinary (get both public_id & URL)
    const { publicId, url } = await uploadToCloudinary(
      barcodeBuffer,
      `${batchId}.png`,
      "batchBarCodes"
    );

    // ✅ Upload crop image to Cloudinary if provided
    let cropImage = { url: null, publicId: null };
    if (cropImageFile && typeof cropImageFile !== "string" && cropImageFile.size > 0) {
      try {
        const imageBuffer = Buffer.from(await cropImageFile.arrayBuffer());
        cropImage = await uploadImageToCloudinary(imageBuffer, "cropImages");
      } catch (imgErr) {
        console.error("Crop image upload failed:", imgErr);
        // Non-blocking — crop will still be saved without image
      }
    }

    // ✅ Save crop data to MongoDB
    const newCrop = new CropUpload({
      batchId,
      uniqueId,
      speciesId,
      gpsCoordinates,
      timestamp: timestamp || new Date(),
      quantity: quantity ? parseFloat(quantity) : undefined,
      batchBarCode: { publicId, url },
      cropImage,
    });
    await newCrop.save();

    // ✅ Return the full saved document (for frontend)
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

import CropUpload from "@/models/CropUpload";
import { connectDB } from "@/lib/db";


function generateBatchName(speciesId) {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
  return `${speciesId}-${year}-${randomNum}`;
}

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

    //  Generate new batch ID (unique by design)
    const batchId = generateBatchName(speciesId);

    const newCrop = new CropUpload({
      batchId,
      uniqueId,
      speciesId,
      gpsCoordinates,
      timestamp: timestamp || new Date(),
      initialQualityMetrics,
    });

    await newCrop.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Crop data uploaded successfully",
        data: newCrop,
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

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");

    if (!batchId) {
      return NextResponse.json(
        { success: false, message: "Batch ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    const batch = await CropUpload.findOne({ batchId });

    if (!batch) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }

    // 🧩 Extract only required details
    const filteredData = {
      batchId: batch.batchId,
      speciesId: batch.speciesId,
      gpsCoordinates: batch.gpsCoordinates,
      acceptedBy: batch.acceptedBy,
      certificateUrl: batch.certificate?.url || null,
      updatedAt: batch.updatedAt,
      tests: batch.tests || null,
      acceptedByManu: batch.acceptedByManu,
      manufacturedAt: batch.manufacturedAt,
      manufacturingProcesses: batch.manufacturingProcesses || [],
    };

    // 🔐 Encode to base64 so user cannot modify/inspect easily
    const encoded = Buffer.from(JSON.stringify(filteredData)).toString("base64");

    return NextResponse.json({
      success: true,
      encoded,
    });

  } catch (error) {
    console.error("Error fetching batch details:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

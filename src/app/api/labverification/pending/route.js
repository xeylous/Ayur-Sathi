import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// GET /api/labverification/pending
// Returns all CropUpload documents with status "Pending" (farmer uploads awaiting lab review)
export async function GET(req) {
  await connectDB();

  // Verify token from cookies
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

  try {
    // Fetch all CropUpload records with status "Pending" — these are fresh farmer uploads
    const pendingCrops = await CropUpload.find({ status: "Pending" })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    const data = pendingCrops.map((crop) => ({
      batchId: crop.batchId,
      speciesId: crop.speciesId,
      uniqueId: crop.uniqueId, // farmer ID
      quantity: crop.quantity || 0,
      timestamp: crop.timestamp
        ? new Date(crop.timestamp).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : null,
      cropImage: crop.cropImage?.url || null,
      gpsCoordinates: crop.gpsCoordinates || null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/labverification/pending error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

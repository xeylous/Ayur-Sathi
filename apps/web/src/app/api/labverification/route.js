import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import AcceptedBatch from "@/models/AcceptedBatch";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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
const labId = decoded.labId || decoded.id;
// console.log("Decoded labId:", labId);

  // Extract batchId from query
  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");

  if (!batchId) {
    return NextResponse.json(
      { success: false, message: "batchId is required" },
      { status: 400 }
    );
  }

  // Find batch
  const batch = await CropUpload.findOne({ batchId });
  if (!batch) {
    return NextResponse.json(
      { success: false, message: "Batch not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: batch });
}

export async function POST(req) {
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

  const labId = decoded.labId || decoded.id;

  // Parse body
  const body = await req.json();
  const { batchId, action, remarks } = body; // "accept" or "reject"

  if (!batchId || !action) {
    return NextResponse.json(
      { success: false, message: "batchId and action are required" },
      { status: 400 }
    );
  }

  // Find and verify batch
  const batch = await CropUpload.findOne({ batchId });
  if (!batch) {
    return NextResponse.json(
      { success: false, message: "Batch not found" },
      { status: 404 }
    );
  }

  // Handle based on action
  if (action === "accept") {
    // Save to accepted batch schema
    const acceptedBatch = new AcceptedBatch({
      batchId,
      cropData: batch.toObject(),
      acceptedBy: labId || "LabUser",
    });

    await acceptedBatch.save();

    // Update CropUpload status
    batch.status = "Verified";
    await batch.save();

    return NextResponse.json({
      success: true,
      message: "Batch accepted and saved successfully",
      data: acceptedBatch,
    });
  } else if (action === "reject") {
    // Only update the batch status to "Rejected"
    batch.status = "Rejected";

    // Optionally store remarks
    if (remarks) {
      batch.rejectionReason = remarks;
    }

    await batch.save();

    return NextResponse.json({
      success: true,
      message: "Batch rejected successfully and status updated",
      data: batch,
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Invalid action. Use 'accept' or 'reject'" },
      { status: 400 }
    );
  }
}

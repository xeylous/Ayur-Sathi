import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import AcceptedBatchByManu from "@/models/AcceptedBatchByManu";

export async function GET(req) {
  try {
    // ⛔ Check auth cookie
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(cookie.value, process.env.JWT_SECRET);
    //   console.log(decoded);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect DB
    await connectDB();

    // Get batchId from query
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");

    if (!batchId) {
      return NextResponse.json(
        { success: false, message: "batchId is required" },
        { status: 400 }
      );
    }

    // Fetch batch
    const batch = await CropUpload.findOne({ batchId });

    if (!batch) {
      return NextResponse.json(
        { success: false, message: "Batch not found" },
        { status: 404 }
      );
    }

    // Business checks
    if (batch.status !== "Approved") {
      return NextResponse.json(
        { success: false, message: "Batch is not yet approved" },
        { status: 400 }
      );
    }

    if (!batch.acceptedBy) {
      return NextResponse.json(
        { success: false, message: "Batch not yet assigned" },
        { status: 400 }
      );
    }

    // 🔥 Allowed data to send to frontend
    return NextResponse.json({
      success: true,
      message: "Batch found",
      data: {
        batchId: batch.batchId,
        speciesId: batch.speciesId,
        quantity: batch.quantity,
        status: batch.status,
        certificate: batch.certificate,
      },
    });
  } catch (err) {
    console.error("Batch Search Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {

    // ⛔ Check token
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
        { status: 401 }
      );
    }

    // Connect DB
    await connectDB();

    // Extract request data
    const { batchId, action, manuOperatorName } = await req.json();

    if (!batchId || !action) {
      return NextResponse.json(
        { success: false, message: "batchId and action are required" },
        { status: 400 }
      );
    }

    const existingBatch = await CropUpload.findOne({ batchId });

    if (!existingBatch) {
      return NextResponse.json(
        { success: false, message: "Batch not found" },
        { status: 404 }
      );
    }

    // 🟥 Handle Decline
    if (action === "Decline") {
      existingBatch.status = "Rejected";
      await existingBatch.save();

      return NextResponse.json({
        success: true,
        message: "Batch declined successfully",
      });
    }

    // 🟩 Handle Accept
    if (action === "Accept") {
      existingBatch.acceptedByManu = decoded.manuId;
      existingBatch.acceptedDate = new Date();
      existingBatch.manuOperatorName = manuOperatorName || null;
    

      await existingBatch.save();

      // Store full crop history in new model
      await AcceptedBatchByManu.create({
        batchId,
        cropDetails: existingBatch,
        acceptedByManu: decoded.manuId,
        manuOperatorName,
      });

      return NextResponse.json({
        success: true,
        message: "Batch accepted successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action type" },
      { status: 400 }
    );

  } catch (err) {
    console.log("Manufacture Route Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import QRCode from "qrcode";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    // 1️⃣ Read auth token from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // 3️⃣ Ensure manufacturer access
    if (decoded.type !== "manu") {
      return NextResponse.json(
        { success: false, message: "Only manufacturers can log processing." },
        { status: 403 }
      );
    }

    await connectDB();

    // 4️⃣ Read request body
    const body = await req.json();
    const { batchId, processes, operator, notes } = body;

    if (!batchId || !Array.isArray(processes) || processes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "batchId and at least one process step are required.",
        },
        { status: 400 }
      );
    }

    // 5️⃣ Ensure the batch belongs to logged-in manufacturer
    const batch = await CropUpload.findOne({
      batchId,
      acceptedByManu: decoded.manuId,
    });

    if (!batch) {
      return NextResponse.json(
        {
          success: false,
          message: "Batch not found or not assigned to this manufacturer.",
        },
        { status: 404 }
      );
    }

    // 6️⃣ Save operator name ONLY when provided
    if (operator && operator.trim() !== "") {
      batch.manuOperatorName = operator;
    } else if (!batch.manuOperatorName) {
      batch.manuOperatorName = "Default Operator";
    }

    // 7️⃣ Add processing steps with operator included
    const mappedProcesses = processes.map((p) => ({
      processName: p.processName,
      operator: operator || batch.manuOperatorName,
      date: p.date ? new Date(p.date) : new Date(),
      notes: p.notes || notes || null,
    }));

    batch.manufacturingProcesses.push(...mappedProcesses);

    // First time manufacturing timestamp
    if (!batch.manufacturedAt) {
      batch.manufacturedAt = new Date();
    }

    // 8️⃣ Generate QR code (NO JSON.stringify)
    const qrPayload = `https://ayur-sathi.vercel.app/batchid=${batch.batchId}`;
    const qrBase64 = await QRCode.toDataURL(qrPayload);

    // Convert base64 → buffer
    const buffer = Buffer.from(
      qrBase64.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    // 9️⃣ Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "batchBarCodes", format: "png" },
          (err, result) => (err ? reject(err) : resolve(result))
        )
        .end(buffer);
    });

    batch.qrCode = {
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    };

    await batch.save();

    return NextResponse.json({
      success: true,
      qrUrl: batch.qrCode.url,
      message: "Manufacturing steps logged and QR generated.",
      operator: batch.manuOperatorName,
      processes: batch.manufacturingProcesses,
    });

  } catch (err) {
    console.error("Manufacturing error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

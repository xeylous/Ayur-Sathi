import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";

export async function GET(req) {
  try {
    // 1️⃣ Read auth token
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // 2️⃣ Validate token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    // restrict only manufacturers
    if (decoded.type !== "manu") {
      return NextResponse.json(
        { success: false, message: "Access denied. Only manufacturers allowed." },
        { status: 403 }
      );
    }

    await connectDB();

    // 3️⃣ Pagination
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 4️⃣ Only completed batches with QR
    const query = {
      manufacturedAt: { $exists: true },
      qrCode: { $exists: true }
    };

    // show only manufacturer-owned batches
    query.acceptedByManu = decoded.manuId;

    // 5️⃣ Fetch sorted latest first
    const records = await CropUpload.find(query)
      .sort({ manufacturedAt: -1 })  // 🔥 ensures newest first
      .skip(skip)
      .limit(limit);

    const total = await CropUpload.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Manufactured batches retrieved successfully.",
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        itemsReturned: records.length,
      },
      data: records,
    });

  } catch (err) {
    console.error("Error fetching manufactured data:", err);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

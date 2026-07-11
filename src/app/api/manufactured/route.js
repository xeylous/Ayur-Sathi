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

    const isAdmin = decoded.role === "admin" || decoded.type === "admin" || 
                    decoded.role === "store_admin" || decoded.type === "store_admin";

    // restrict only manufacturers and admins
    if (decoded.type !== "manu" && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    await connectDB();

    // 3️⃣ Pagination & Date Filters
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 4️⃣ Only completed batches with QR
    const query = {
      manufacturedAt: { $exists: true },
      qrCode: { $exists: true }
    };

    if (startDate || endDate) {
      query.manufacturedAt = { $exists: true };
      if (startDate) {
        query.manufacturedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.manufacturedAt.$lte = end;
      }
    }

    // show only manufacturer-owned batches if not admin
    if (!isAdmin) {
      query.acceptedByManu = decoded.manuId;
    }

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

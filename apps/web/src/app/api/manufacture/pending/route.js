import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";

export async function GET(req) {
  try {
    // 🛑 Check Token
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
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 🛑 Allow Manufacturer Only
    if (decoded.type !== "manu") {
      return NextResponse.json(
        { success: false, message: "Access denied. Not a manufacturer." },
        { status: 403 }
      );
    }

    await connectDB();

    // 🔍 Pagination Setup
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10; // max chunk size
    const skip = (page - 1) * limit;

    // 🔍 Query conditions
    const query = {
      acceptedByManu: decoded.id,
      manufacturingProcesses: { $size: 0 },
    };

    // 🧾 Fetch Paginated Results
    const pendingBatches = await CropUpload.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await CropUpload.countDocuments(query);

    return NextResponse.json({
      success: true,
      message: "Pending batches fetched successfully.",
      data: pendingBatches,
      pagination: {
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        perPage: limit,
      },
    });

  } catch (err) {
    console.error("Error fetching pending batches:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

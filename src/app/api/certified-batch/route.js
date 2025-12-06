import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";

export async function GET(req) {
  try {
    // ✅ Extract auth token from cookies
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // ✅ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Pagination logic
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // ✅ Fetch paginated crops
    const verifiedCrops = await CropUpload.find({
      status: { $in: ["Approved", "Rejected"] },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ Count total for frontend pagination control
    const totalCount = await CropUpload.countDocuments({
      status: { $in: ["Approved", "Rejected"] },
    });

    // ✅ Respond with paginated data
    return NextResponse.json({
      success: true,
      user: decoded,
      data: verifiedCrops,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    console.error("Error fetching verified crops:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

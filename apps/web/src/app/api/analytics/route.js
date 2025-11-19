import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
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
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await connectDB();

    // Fetch all crops (you can filter by user if needed)
    const crops = await CropUpload.find({});

    // --- Total stats ---
    const totalBatches = crops.length;
    const approved = crops.filter(c => c.status === "Approved").length;
    const rejected = crops.filter(c => c.status === "Rejected").length;
    const pending = crops.filter(c => c.status === "Pending").length;

    // --- Monthly breakdown ---
    const monthlyData = {};
    crops.forEach(crop => {
      const month = new Date(crop.createdAt).toLocaleString("default", { month: "short" });
      if (!monthlyData[month]) monthlyData[month] = { month, approved: 0, rejected: 0 };
      if (crop.status === "Approved") monthlyData[month].approved++;
      if (crop.status === "Rejected") monthlyData[month].rejected++;
    });

    // Sort months by order (Jan → Dec)
    const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyCertifications = Object.values(monthlyData).sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    // --- Distribution (Pie chart) ---
    const distribution = [
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected },
      { name: "Pending", value: pending },
    ];

    return NextResponse.json({
      success: true,
      user: decoded,
      data: {
        monthlyCertifications,
        totalStats: { totalBatches, approved, rejected, pending },
        distribution,
      },
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

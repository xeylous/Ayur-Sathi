import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import CropUpload from "@/models/CropUpload"; // Adjust path to your model

export async function GET(req) {
  try {
    // Extract token from Authorization header
    
    const cookie = req.cookies.get("auth_token");
  if (!cookie) {
    return NextResponse.json(
      { success: false, message: "No auth token provided" },
      { status: 401 }
    );
  }

     const token = cookie.value;
    // Decode and verify token
    let decoded;
    console.log("Token:", token);
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get verified crop uploads
    const verifiedCrops = await CropUpload.find({
      status: "Verified",
    }).sort({ createdAt: -1 });
    console.log("Verified Crops:", verifiedCrops);

    return NextResponse.json({
      success: true,
      user: decoded, // Decoded token information
      data: verifiedCrops,
    
    });
  } catch (err) {
    console.error("Error fetching verified crops:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
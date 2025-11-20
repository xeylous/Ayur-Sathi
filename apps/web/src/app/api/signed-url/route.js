// api/signed-url/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let publicId = searchParams.get("id");
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Missing publicId" },
        { status: 400 }
      );
    }

    // ✅ Remove .pdf extension if present
    publicId = publicId.replace(/\.[^/.]+$/, "");

    console.log("Generating signed URL for:", publicId);

    // ✅ Generate signed URL for 'upload' type resources (not authenticated)
    const url = cloudinary.url(publicId + ".pdf", {
      resource_type: "raw",
      type: "upload", // Changed from "authenticated" to "upload"
      sign_url: true,
      secure: true,
    });

    console.log("Generated URL:", url);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Signed URL API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
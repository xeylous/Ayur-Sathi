// app/api/partnership/route.js
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import LabApplication from "@/models/LabApplication";

/**
 * Helper to upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @param {string} folder
 * @returns {Promise<string>} secure_url
 */
const uploadToCloudinary = (fileBuffer, fileName, folder = "lab_applications") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Text fields
    const labName = formData.get("labName");
    const address = formData.get("address");
    const ownerName = formData.get("ownerName");
    const ownerEmail = formData.get("ownerEmail");
    const panCard = formData.get("panCard");

    // File fields
    const ownerIdProof = formData.get("ownerIdProof");
    const panCardDoc = formData.get("panCardDoc");
    const ownershipDocs = formData.get("ownershipDocs");
    const signedAgreement = formData.get("signedAgreement");

    if (!labName || !address || !ownerName || !ownerEmail || !panCard) {
      return NextResponse.json({ success: false, error: "Missing required text fields" }, { status: 400 });
    }

    if (!ownerIdProof || !panCardDoc || !ownershipDocs || !signedAgreement) {
      return NextResponse.json({ success: false, error: "All files are required" }, { status: 400 });
    }

    // Upload files
    const files = { ownerIdProof, panCardDoc, ownershipDocs, signedAgreement };
    const uploadedUrls = {};

    for (const [key, file] of Object.entries(files)) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedUrls[key] = await uploadToCloudinary(buffer, file.name);
    }

    // Save to DB
    const labApp = await LabApplication.create({
      labName,
      address,
      ownerName,
      ownerEmail,
      panCard,
      documents: uploadedUrls,
      status: "Pending Approval",
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true, data: labApp }, { status: 201 });
  } catch (error) {
    console.error("Partnership API POST Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// GET all (admin)
export async function GET() {
  try {
    await connectDB();
    const labs = await LabApplication.find().sort({ submittedAt: -1 });
    return NextResponse.json({ success: true, data: labs }, { status: 200 });
  } catch (error) {
    console.error("Partnership API GET Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// PATCH to update status (approve/reject)
export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { id, action, adminNote } = body;
    if (!id || !action) {
      return NextResponse.json({ success: false, error: "Missing id or action" }, { status: 400 });
    }

    const allowed = ["approve", "reject"];
    if (!allowed.includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const update = {
      status: action === "approve" ? "Approved" : "Rejected",
      adminNote: adminNote || "",
      decisionAt: new Date(),
    };

    const updated = await LabApplication.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("Partnership API PATCH Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

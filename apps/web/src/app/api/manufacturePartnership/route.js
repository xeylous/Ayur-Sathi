import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import crypto from "crypto";
import ManufacturerApplication from "@/models/ManufacturerApplication"; // ✅ Correct import

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @param {string} folder
 * @returns {Promise<string>} Cloudinary file URL
 */
const uploadToCloudinary = (fileBuffer, fileName, folder = "manufacture_applications") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder,
        use_filename: false,
        unique_filename: true,
        type: "upload",
        format: "pdf",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// ============================================================
// 📤 POST — Create a new manufacturer partnership application
// ============================================================
export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    // 🧾 Text fields
    const manufacturerName = formData.get("manufacturerName");
    const factoryAddress = formData.get("factoryAddress");
    const ownerName = formData.get("ownerName");
    const ownerEmail = formData.get("ownerEmail");
    const gstNumber = formData.get("gstNumber");

    // 📎 File fields
    const gstRegistration = formData.get("gstRegistration");
    const panCardCopy = formData.get("panCardCopy");
    const factoryLicense = formData.get("factoryLicense");
    const ownerIdProof = formData.get("ownerIdProof");
    const signedAgreement = formData.get("signedAgreement");

    // ✅ Validate text fields
    if (!manufacturerName || !factoryAddress || !ownerName || !ownerEmail || !gstNumber) {
      return NextResponse.json(
        { success: false, error: "Missing required text fields" },
        { status: 400 }
      );
    }

    // ✅ Validate files
    if (!gstRegistration || !panCardCopy || !factoryLicense || !ownerIdProof || !signedAgreement) {
      return NextResponse.json(
        { success: false, error: "All required documents must be uploaded" },
        { status: 400 }
      );
    }

    // ✅ Upload all documents
    const files = { gstRegistration, panCardCopy, factoryLicense, ownerIdProof, signedAgreement };
    const uploadedUrls = {};

    for (const [key, file] of Object.entries(files)) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      uploadedUrls[key] = await uploadToCloudinary(buffer, file.name);
    }

    // ✅ Generate a unique manufacturer ID
    const manufacturerId = `AyurManuf${crypto.randomBytes(4).toString("hex")}`;
    console.log("Generated Manufacturer ID:", manufacturerId);

    // ✅ Save to MongoDB
    const newApp = await ManufacturerApplication.create({
      manufacturerId,
      manufacturerName,
      factoryAddress,
      ownerName,
      ownerEmail,
      gstNumber,
      documents: uploadedUrls,
      status: "Pending Approval",
      submittedAt: new Date(),
    });

    console.log("✅ Manufacturer application created successfully:", newApp);

    return NextResponse.json({ success: true, data: newApp }, { status: 201 });
  } catch (error) {
    console.error("❌ Partnership API POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// 📄 GET — Fetch all manufacturer applications (Admin view)
// ============================================================
export async function GET() {
  try {
    await connectDB();
    const applications = await ManufacturerApplication.find().sort({ submittedAt: -1 });
    return NextResponse.json({ success: true, data: applications }, { status: 200 });
  } catch (error) {
    console.error("❌ Partnership API GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// 🛠 PATCH — Approve or Reject an application (Admin action)
// ============================================================
export async function PATCH(req) {
  try {
    await connectDB();
    const { id, action, adminNote } = await req.json();

    // ✅ Validate input
    if (!id || !action) {
      return NextResponse.json(
        { success: false, error: "Missing id or action" },
        { status: 400 }
      );
    }

    const validActions = ["approve", "reject"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // ✅ Prepare update object
    const update = {
      status: action === "approve" ? "Approved" : "Rejected",
      adminNote: adminNote || "",
      decisionAt: new Date(),
    };

    // ✅ Update record by manufacturerId (not _id)
    const updatedApp = await ManufacturerApplication.findOneAndUpdate(
      { manufacturerId: id },
      update,
      { new: true }
    );

    if (!updatedApp) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedApp }, { status: 200 });
  } catch (error) {
    console.error("❌ Partnership API PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

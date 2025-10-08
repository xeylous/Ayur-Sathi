import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LabApplication from "@/models/LabApplication";
import LabCredential from "@/models/LabCredential";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendLabApprovalEmail } from "@/lib/labMailer"; // ✅ IMPORT HERE

export async function POST(req) {
  try {
    await connectDB();

     const body = await req.json();
    const { labId } = body;

    if (!labId) {
      return NextResponse.json({ error: "Lab ID required" }, { status: 400 });
    }

    //  Find the lab application
    const lab = await LabApplication.findOne({ labId: labId });
    console.log("Found Lab:", lab);
    if (!lab) {
      // Also try searching by _id in case that's what's being sent
      const labById = await LabApplication.findById(labId).catch(() => null);
      if (labById) {
        console.log("Found by _id instead:", labById);
        return NextResponse.json({ 
          error: "Please use labId field, not _id",
          hint: `The labId for this lab is: ${labById.labId}`
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: "Lab not found",
        searchedFor: labId 
      }, { status: 404 });
    }

    if (lab.status === "Approved") {
      return NextResponse.json({ error: "Lab already approved" }, { status: 400 });
    }

    // 2️⃣ Generate login credentials
    const email = lab.ownerEmail.toLowerCase();
    const plainPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3️⃣ Check if credentials already exist (edge case)
     const existingCred = await LabCredential.findOne({ labId });
    if (existingCred) {
      return NextResponse.json({ 
        error: "Credentials already exist for this lab" 
      }, { status: 400 });
    }

    // 3️⃣ Save credentials in LabCredential model
    await LabCredential.create({
      labId: lab.labId,
      email,
      hashedPassword,
    });


    // 4️⃣ Update lab status
    lab.status = "Approved";
    await lab.save();

    try {
      await sendLabApprovalEmail({
        name: lab.ownerName,
        email,
        password: plainPassword,
        labId: lab.labId,
        loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        supportUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.jpg`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Lab is approved but email failed - log this
      // You might want to add a flag or notification system here
    }

    return NextResponse.json({
      success: true,
      message: "Lab approved, credentials created, and email sent",
      data: {
        lab: {
          labId: lab.labId,
          name: lab.labName,
          owner: lab.ownerName,
          email,
        },
      },
    });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

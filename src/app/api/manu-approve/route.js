import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ManufacturerApplication from "@/models/ManufacturerApplication";
import ManufacturerCredential from "@/models/ManufacturerCredential";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendManufacturerApprovalEmail } from "@/lib/manufacturerMailer";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { manufacturerId } = body;

    if (!manufacturerId) {
      return NextResponse.json(
        { error: "Manufacturer ID required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find the manufacturer entry
    let manufacturer = await ManufacturerApplication.findOne({
      manufacturerId,
    });

    if (!manufacturer) {
      manufacturer = await ManufacturerApplication.findById(
        manufacturerId
      ).catch(() => null);
    }

    if (!manufacturer) {
      return NextResponse.json(
        { error: "Manufacturer not found" },
        { status: 404 }
      );
    }
    if (!manufacturer) {
      // fallback check if client mistakenly passed `_id`
      const manufacturerByRawId = await ManufacturerApplication.findById(
        manufacturerId
      ).catch(() => null);

      if (manufacturerByRawId) {
        return NextResponse.json(
          {
            error: "Use manufacturerId field instead of _id",
            hint: `The manufacturerId is: ${manufacturerByRawId.manufacturerId}`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Manufacturer not found" },
        { status: 404 }
      );
    }

    if (manufacturer.status === "Approved") {
      return NextResponse.json({ error: "Already approved" }, { status: 400 });
    }

    // 2️⃣ Create Login Credentials
    const email = manufacturer.ownerEmail.toLowerCase();
    const plainPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Prevent duplicate credential assignment
    const existingCred = await ManufacturerCredential.findOne({
      manufacturerId,
    });

    if (existingCred) {
      return NextResponse.json(
        { error: "Credentials already exist for this manufacturer." },
        { status: 400 }
      );
    }

    await ManufacturerCredential.create({
      ManuId: manufacturer.manufacturerId,
      email,
      role: "manu",
      hashedPassword,
    });

    // 3️⃣ Update status
    manufacturer.status = "Approved";
    await manufacturer.save();

    // 4️⃣ Send email (optional but expected)
    try {
      await sendManufacturerApprovalEmail({
        name: manufacturer.ownerName,
        email,
        password: plainPassword,
        ManuId: manufacturer.manufacturerId,
        loginUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        supportUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/support`,
        logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.jpg`,
      });
    } catch (err) {
      console.error("Email sending failed:", err);
    }

    return NextResponse.json({
      success: true,
      message: "Manufacturer approved, credentials created, and email sent",
      data: {
        manufacturer: {
          manufacturerId: manufacturer.manufacturerId,
          name: manufacturer.manufacturerName,
          owner: manufacturer.ownerName,
          email,
        },
      },
    });
  } catch (err) {
    console.error("Approval route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import LabCredential from "@/models/LabCredential";
import ManufacturerCredential from "@/models/ManufacturerCredential";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No Google session found" }, { status: 401 });
    }

    await connectDB();
    const { email, name, image } = session.user;
    const normalizedEmail = email.toLowerCase();
    
    let user = null;
    let userType = "user";
    
    // 1. Search across all collections
    const farmer = await Farmer.findOne({ email: normalizedEmail });
    if (farmer) {
      user = farmer;
      userType = "farmer";
    }
    
    // Check Lab if not found
    if (!user) {
        const lab = await LabCredential.findOne({ email: normalizedEmail });
        if (lab) {
            user = lab;
            userType = "lab";
        }
    }

    // Check Manufacturer if not found
    if (!user) {
        const manu = await ManufacturerCredential.findOne({ email: normalizedEmail });
        if (manu) {
            user = manu;
            userType = "manu";
        }
    }
    
    // Check User if not found
    if (!user) {
        const normalUser = await User.findOne({ email: normalizedEmail });
        if (normalUser) {
            user = normalUser;
            userType = "user";
        }
    }

    // 2. If NO account found, create a new "User"
    if (!user) {
      // Generate random password
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Generate uniqueId
      const uniqueId = crypto.randomBytes(3).toString("hex");

      user = await User.create({
        name: name,
        email: normalizedEmail,
        password: hashedPassword,
        type: "user",
        uniqueId: uniqueId,
        verified: true, 
        // image: image,
      });
      userType = "user";
    }

    // 3. Create Custom Token Payload
    const tokenPayload = {
      id: user._id,
      email: user.email,
      type: userType,
    };

    // Add type-specific fields
    if (userType === "lab") {
        tokenPayload.labId = user.labId;
    } else if (userType === "manu") {
        tokenPayload.manuId = user.ManuId; // Note: Schema uses ManuId
    } else {
        tokenPayload.uniqueId = user.uniqueId;
    }

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "9h" }
    );

    // 4. Determine Redirect URL
    let redirectUrl;
    if (userType === "lab") {
        redirectUrl = `/labId/${user.labId}`;
    } else if (userType === "manu") {
        redirectUrl = `/manuId/${user.ManuId}`;
    } else {
        redirectUrl = `/id/${user.uniqueId || user._id}`;
    }

    // 5. Create Response
    const response = NextResponse.json({
      success: true,
      redirectUrl,
    });

    // 6. Set Auth Cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 9, // 9 hrs
    });

    return response;

  } catch (error) {
    console.error("Google Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

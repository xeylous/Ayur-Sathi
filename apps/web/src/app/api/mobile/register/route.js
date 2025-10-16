"use server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Farmer from "@/models/Farmer";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import redis from "@/lib/redis";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password, type } = await req.json();

    if (!name || !email || !password || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const uniqueId = crypto.randomBytes(3).toString("hex");

    let model;
    if (type === "user") {
      model = User;
    } else if (type === "farmer") {
      model = Farmer;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const existing = await model.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: `An account already exists with this email as ${type}` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      type,
      uniqueId,
    };

    // Store pending user in Redis for 10 min
    await redis.set(
      `pending_user:${uniqueId}`,
      JSON.stringify(userData),
      "EX",
      600
    );

    return NextResponse.json({
      message: `OTP sent to ${email}. Please verify to complete registration.`,
      userData: { uniqueId },
    });
  } catch (err) {
    console.error("Error in mobile register:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

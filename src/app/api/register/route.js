"use server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import redis from "@/lib/redis";

export async function POST(req) {
  await connectDB();
  const { name, email, password, type } = await req.json();
  console.log(name, email, password, type);

  try {
    // 🔽 Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

    // ✅ Generate unique 6-character ID (hex-based)
    const uniqueId = crypto.randomBytes(3).toString("hex"); // 3 bytes -> 6 hex chars
    console.log("Generated uniqueId:", uniqueId);

    const hashedPassword = await bcrypt.hash(password, 10);

    let model;
    if (type === "user") {
      model = User;
    } else if (type === "farmer") {
      model = Farmer;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Check if already exists
    const existing = await model.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: `A account already exists with this email as ${type}` },
        { status: 400 }
      );
    }
    const userData = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      type,
      uniqueId,
    };

    // Save in Redis as string
    await redis.set(
      `pending_user:${uniqueId}`,
      JSON.stringify(userData),
      "EX",
      600
    );

    // const account = await model.create({
    //   name,
    //   email: normalizedEmail, // save lowercase
    //   password: hashedPassword,
    //   type,
    //   uniqueId, // ✅ Save generated ID
    // });
    // console.log("generated account details:", account);
    return NextResponse.json({
      message: `OTP sent to ${email}. Please verify to complete registration.`,
      userData: {
        uniqueId: userData.uniqueId,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: `Duplicate email detected for ${type}` },
        { status: 400 }
      );
    }

    console.error("Error registering:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

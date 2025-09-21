'use server';
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password, type } = await req.json();
console.log(name, email, password, type);

  try {
    // 🔽 Convert email to lowercase
    const normalizedEmail = email.toLowerCase();

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

    const account = await model.create({
      name,
      email: normalizedEmail, // 🔽 save lowercase
      password: hashedPassword,
       type, 
    });

    return NextResponse.json({
      message: `${type} registered successfully`,
      account: {
        id: account._id,
        name: account.name,
        email: account.email,
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
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

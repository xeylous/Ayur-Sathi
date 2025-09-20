import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, type } = await req.json();

    if (!email || !password || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find user by email + type
    const user = await User.findOne({ email, type });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Success (⚠️ don’t send password in real apps)
    return NextResponse.json({
      name: user.name,
      email: user.email,
      type: user.type,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

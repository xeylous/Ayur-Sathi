import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    let { email, password, type } = await req.json();

    if (!email || !password || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Convert to lowercase for consistency
    email = email.toLowerCase().trim();
    type = type.toLowerCase().trim();

    let model;
    if (type === "user") {
      model = User;
    } else if (type === "farmer") {
      model = Farmer;
    } else {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // Find by email
    const account = await model.findOne({ email });
    if (!account) {
      return NextResponse.json({ error: `${type} not found` }, { status: 404 });
    }

    // 🔒 Extra check: prevent same email across collections
    const otherModel = type === "user" ? Farmer : User;
    const conflict = await otherModel.findOne({ email });
    if (conflict) {
      return NextResponse.json({
        error: "This email is already registered as a different account type",
      }, { status: 403 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Success ✅ (don’t send password back!)
    return NextResponse.json({
      message: "Login successful",
      account: {
        id: account._id,
        name: account.name,
        email: account.email,
        type,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

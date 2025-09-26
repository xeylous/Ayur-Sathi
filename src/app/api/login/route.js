import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        id: account._id,
        email: account.email,
        type,
        uniqueId: account.uniqueId , // fallback if uniqueId not set
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token valid for 1 hour
    );

    // ✅ Set cookie (HttpOnly, Secure in production)
    const response = NextResponse.json({
      message: "Login successful",
      redirectUrl: `/id/${account.uniqueId || account._id}`, 
      account: {
        name: account.name,
        email: account.email,
        uniqueId: account.uniqueId || account._id,
        type,
      },
    });
// console.log("token:", token);

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/", // available across whole site
      maxAge: 60 * 60, // 1 hour
    });
    // console.log("Login successful for:", email);
    return response;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

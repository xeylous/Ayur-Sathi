import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Farmer from "@/models/Farmer";
import LabCredential from "@/models/LabCredential";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    let { email, password, type } = await req.json();

    // basic validation
    if (!email || !password || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // normalize
    email = String(email).toLowerCase().trim();
    type = String(type).toLowerCase().trim();

    // map account type -> model
    const modelMap = {
      user: User,
      farmer: Farmer,
      lab: LabCredential,
    };

    const model = modelMap[type];
    if (!model) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // find account in the selected collection
    const account = await model.findOne({ email });
    // console.log("account",account);
    if (!account) {
      return NextResponse.json({ error: `${type} not found` }, { status: 404 });
    }

    // make sure the same email isn't registered in any other account collection
    const conflicts = [];
    if (type !== "user") {
      const u = await User.findOne({ email });
      if (u) conflicts.push("user");
    }
    if (type !== "farmer") {
      const f = await Farmer.findOne({ email });
      if (f) conflicts.push("farmer");
    }
    if (type !== "lab") {
      const l = await LabCredential.findOne({ email });
      if (l) conflicts.push("lab");
    }
    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error: `This email is already registered as a different account type (${conflicts.join(", ")})`,
        },
        { status: 403 }
      );
    }

    // choose the correct hashed password field (lab uses hashedPassword in your original code)
    const hashedField = type === "lab" ? "hashedPassword" : "password";
    const hashed = account[hashedField];

    if (!hashed) {
      // defensive: if the expected hashed field doesn't exist, fail safely
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, hashed);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials", message: "password mismatch" }, { status: 401 });
    }

    // create token
    let token;
    if (type === "lab") {
      token = jwt.sign(
        {
          id: account._id,
          email: account.email,
          type,
          labId: account.labId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "9h" }
      );
    } else {
      token = jwt.sign(
        {
          id: account._id,
          email: account.email,
          type,
          uniqueId: account.uniqueId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    }

    // determine redirect
    const redirectUrl = type === "lab" ? `/labId/${account.labId}` : `/id/${account.uniqueId || account._id}`;
let response;
// console.log("type",type);
    if (type === "lab") {
      response = NextResponse.json(
        {
          message: "Login successful",
          redirectUrl,
          account: {
            labId: account.labId,
            name: account.name,
            email: account.email,
            type,
          },
        },
        { status: 200 }

      );
    // console.log("token",response.account);

    } else {
      response = NextResponse.json(
        {
          message: "Login successful",
          redirectUrl,
          account: {
            name: account.name,
            email: account.email,
            uniqueId: account.uniqueId || account._id,
            type,
            verified: account.verified || false,
          },
        },
        { status: 200 }
      );
    }
    // console.log("token", response.account);

    // set cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

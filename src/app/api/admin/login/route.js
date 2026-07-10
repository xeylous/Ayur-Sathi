import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const envAdminEmail = process.env.ADMIN_EMAIL;
    const envAdminPass = process.env.ADMIN_PASSWORD;
    const envAltEmail = process.env.ADMIN_ALT_EMAIL;
    const envAltPass = process.env.ADMIN_ALT_PASSWORD;

    const isAdmin1 = email === envAdminEmail && password === envAdminPass;
    const isAdmin2 = email === envAltEmail && password === envAltPass;

    if (!isAdmin1 && !isAdmin2) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        email,
        role: "admin",
        type: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "9h" }
    );

    const response = NextResponse.json({
      message: "Admin login successful",
      user: {
        type: "admin",
        email,
        name: "Central Admin",
        role: "admin",
      },
    }, { status: 200 });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 9 * 60 * 60, // 9 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

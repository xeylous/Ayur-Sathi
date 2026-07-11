import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password, adminType } = await req.json();

    const envAdminEmail = process.env.ADMIN_EMAIL;
    const envAdminPass = process.env.ADMIN_PASSWORD;
    const envAltEmail = process.env.ADMIN_ALT_EMAIL;
    const envAltPass = process.env.ADMIN_ALT_PASSWORD;
    const envStoreEmail = process.env.STORE_ADMIN_EMAIL;
    const envStorePass = process.env.STORE_ADMIN_PASSWORD;

    const matchesCentral = (email === envAdminEmail && password === envAdminPass) || 
                           (email === envAltEmail && password === envAltPass);
    const matchesStore = email === envStoreEmail && password === envStorePass;

    if (adminType === "store") {
      if (!matchesStore) {
        return NextResponse.json({ error: "Invalid Store Admin credentials" }, { status: 401 });
      }
    } else {
      if (!matchesCentral) {
        return NextResponse.json({ error: "Invalid Central Admin credentials" }, { status: 401 });
      }
    }

    const isCentralAdmin = adminType !== "store";
    const role = isCentralAdmin ? "admin" : "store_admin";
    const type = isCentralAdmin ? "admin" : "store_admin";
    const name = isCentralAdmin ? "Central Admin" : "Store Admin";

    const token = jwt.sign(
      {
        email,
        role,
        type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "9h" }
    );

    const response = NextResponse.json({
      message: `${name} login successful`,
      user: {
        type,
        email,
        name,
        role,
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

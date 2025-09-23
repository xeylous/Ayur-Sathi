// /app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the auth_token cookie by setting maxAge = 0
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ secure in prod
      sameSite: "strict",
      path: "/", // available across whole app
      maxAge: 0, // expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

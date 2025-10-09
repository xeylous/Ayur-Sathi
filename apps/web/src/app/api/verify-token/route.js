import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Get the cookie from the request
    const cookie = req.cookies.get("auth_token");
    if (!cookie) {
      return NextResponse.json(
        { error: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = cookie.value;

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type === "lab") {
      return NextResponse.json({
        message: "Token is valid",
        user: {
          id: decoded.id,
          labId: decoded.labId,
          email: decoded.email,
          type: decoded.type,
          uniqueId: decoded.uniqueId,
        },
      });
    } else {
      return NextResponse.json({
        message: "Token is valid",
        user: {
          id: decoded.id,
          email: decoded.email,
          type: decoded.type,
          uniqueId: decoded.uniqueId,
        },
      });
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

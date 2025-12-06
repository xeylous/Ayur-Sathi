import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const cookie = req.cookies.get("auth_token");

    if (!cookie) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const token = cookie.value;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    // Base response user object
    let user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      uniqueId: decoded.uniqueId,
    };

    // Special case for lab
    if (decoded.type === "lab") {
      user.labId = decoded.labId;
    }

    // Special case for manufacturer
    if (decoded.type === "manu") {
      user.manuId = decoded.manuId;
    }

    return NextResponse.json({
      success: true,
      message: "Token valid",
      user,
    });

  } catch (err) {
    console.error("VERIFY TOKEN ERROR:", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

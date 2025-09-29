import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Special handling for /admin
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token belongs to an admin
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin-login", req.url));
      }

      return NextResponse.next();
    } catch (err) {
      console.error("Admin JWT verification failed:", err.message);
      const response = NextResponse.redirect(new URL("/admin-login", req.url));
      response.cookies.set("auth_token", "", { maxAge: 0 });
      return response;
    }
  }

  // ✅ Default JWT check for /id/*
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("auth_token", "", { maxAge: 0 });
    return response;
  }
}

// ✅ Apply middleware only for /id/* and /admin
export const config = {
  matcher: ["/id/:path*", "/admin/:path*"],
};

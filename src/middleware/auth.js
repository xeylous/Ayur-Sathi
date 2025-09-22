import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (optional)
    req.user = decoded;

    // Allow request
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);

    // Invalid/expired token → clear cookie + redirect
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("auth_token", "", { maxAge: 0 }); // clear cookie
    return response;
  }
}

// Protect only /id/* routes
export const config = {
  matcher: ["/id/:path*"],
};

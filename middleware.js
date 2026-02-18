import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // Convert search params safely
  const search = searchParams.toString();
  const queryString = search ? `?${search}` : "";

  // -------- PUBLIC ROUTES --------
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/marketplace",
    "/explore",
    "/admin-login",
    "/google-callback",
  ];

  // Allow dynamic public routes (batchid and public API paths)
  const isPublicDynamic =
    pathname.startsWith("/batchid/") ||
    pathname.startsWith("/api/public/");

  if (publicRoutes.includes(pathname) || isPublicDynamic) {
    return NextResponse.next();
  }

  // -------- ADMIN PROTECTED ROUTES --------
  if (pathname.startsWith("/admin")) {
    if (!token)
      return NextResponse.redirect(new URL(`/admin-login${queryString}`, req.url));

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload: decoded } = await jwtVerify(token, secret);

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL(`/admin-login${queryString}`, req.url));
      }

      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(
        new URL(`/admin-login${queryString}`, req.url)
      );
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // -------- NORMAL USER PROTECTED ROUTES --------
  if (!token) {
    return NextResponse.redirect(new URL(`/login${queryString}`, req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(
      new URL(`/login${queryString}`, req.url)
    );
    response.cookies.delete("auth_token");
    return response;
  }
}

// -------- Apply only to protected routes --------
export const config = {
  matcher: [
    "/admin/:path*",
    "/id/:path*",
    "/labId/:path*",
    "/manuId/:path*",
  ],
};

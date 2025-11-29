// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const token = req.cookies.get("auth_token")?.value;

//   // -------- PUBLIC ROUTES --------
//   const publicRoutes = [
//     "/",
//     "/login",
//     "/register",
//     "/api/public",
//     "/marketplace",
//     "/explore",
//     "/admin"
//   ];

//   // Allow dynamic public route: /batchid/*
//   const isPublicDynamic =
//     pathname.startsWith("/batchid/") ||
//     pathname.startsWith("/api/public/");

//   if (publicRoutes.includes(pathname) || isPublicDynamic) {
//     return NextResponse.next();
//   }

//   // -------- ADMIN PROTECTED ROUTE ----------
//   if (pathname.startsWith("/admin")) {
//     if (!token) return NextResponse.redirect(new URL("/admin-login", req.url));

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       if (decoded.role !== "admin") {
//         return NextResponse.redirect(new URL("/admin-login", req.url));
//       }
//       return NextResponse.next();
//     } catch (err) {
//       console.error("Admin JWT failed:", err.message);
//       const response = NextResponse.redirect(new URL("/admin-login", req.url));
//       response.cookies.delete("auth_token");
//       return response;
//     }
//   }

//   // -------- NORMAL AUTH --------
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT failed:", err.message);
//     const response = NextResponse.redirect(new URL("/login", req.url));
//     response.cookies.delete("auth_token");
//     return response;
//   }
// }

// // -------- Apply only to protected routes --------
// export const config = {
//   matcher: [
//     "/id/:path*",
//     "/admin/:path*",
//     "/labId/:path*",
//     "/manuId/:path*",
//   ],
// };

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // -------- PUBLIC ROUTES --------
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/marketplace",
    "/explore",
    "/admin",
  ];

  // Dynamic public routes like /batchid/*
  const isPublicDynamic =
    pathname.startsWith("/batchid/") || pathname.startsWith("/api/public/");

  // 👉 If route is public, allow access
  if (publicRoutes.includes(pathname) || isPublicDynamic) {
    return NextResponse.next();
  }

  // -------- ADMIN PROTECTED ROUTES --------
  if (pathname.startsWith("/admin")) {
    if (!token)
      return NextResponse.redirect(new URL("/admin-login", req.url));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin-login", req.url));
      }

      return NextResponse.next();
    } catch (err) {
      const response = NextResponse.redirect(new URL("/admin-login", req.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  // -------- NORMAL AUTH PROTECTED ROUTES --------
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

// -------- Only Apply Middleware to Protected Routes --------
export const config = {
  matcher: [
    "/admin/:path*",
    "/id/:path*",
    "/labId/:path*",
    "/manuId/:path*",
  ],
};


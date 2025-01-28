// import { getToken } from "next-auth/jwt";
// import { type NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // Define public and protected paths
//   const isPublicPath =
//     path === "/" ||
//     path === "/login" ||
//     path === "/register" ||
//     path === "/api/auth/signin";
//   const isProtectedPath = path.startsWith("/dashboard");

//   const session = await getToken({
//     req,
//     secret: process.env.GOOGLE_CLIENT_SECRET, // Make sure this matches your .env variable
//   });

//   // Redirect logic
//   if (!session && isProtectedPath) {
//     // If no session and trying to access protected route, redirect to login
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (session && isPublicPath) {
//     // If session exists and trying to access public route, redirect to dashboard
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// // Configure which paths the middleware should run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - public (public files)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
//   ],
// };

// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  // Define protected paths
  const isDashboardPath = path.startsWith("/dashboard");

  // Redirect to sign-in if trying to access a protected route without a valid token
  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Redirect authenticated users away from the sign-in page
  if (path === "/api/auth/signin" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/signin"],
};

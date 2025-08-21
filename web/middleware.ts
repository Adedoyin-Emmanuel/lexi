import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to check authentication via lexi_auth_refresh_token.
 * If unauthenticated, redirects to auth/login with original URL preserved.
 * If authenticated, redirects away from auth pages to dashboard.
 * Only specified protected paths require authentication.
 */
export function middleware(request: NextRequest) {
  const protectedPaths = [
    "/analyze",
    "/settings",
    "/dashboard",
    "/onboarding",
    "/auth/logout",
  ];

  const authPaths = ["/auth/login", "/auth/callback"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const refreshToken = request.cookies.get("lexi_auth_refresh_token")?.value;
  const isAuthenticated = !!refreshToken;

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not authenticated and trying to access protected paths, redirect to login
  if (!isAuthenticated && isProtectedPath) {
    const isProduction = process.env.NODE_ENV === "production";
    const baseAuthUrl = isProduction
      ? "https://uselexi.xyz/auth/login"
      : "http://localhost:3000/auth/login";

    return NextResponse.redirect(baseAuthUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|robots.txt).*)"],
};

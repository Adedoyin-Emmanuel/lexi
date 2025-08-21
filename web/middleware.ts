import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to check authentication via clipsave_auth_refresh_token.
 * If unauthenticated, redirects to auth.clipsave.ng (or localhost) with original URL preserved.
 * Only specified protected paths require authentication.
 */
export function middleware(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/analyze", "/settings", "/onboarding"];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get("lexi_auth_refresh_token")?.value;
  const isAuthenticated = !!refreshToken;

  if (!isAuthenticated) {
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

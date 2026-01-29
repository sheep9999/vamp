// src/middleware.ts
// MINIMAL middleware - just check if session cookie exists for protected routes
// All role-based logic is handled by individual pages and OnboardingCheck component

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const sessionToken = 
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Only /submit and /settings require being logged in via middleware
  // /onboarding handles its own auth check to prevent loops
  const authRequiredPaths = ["/submit", "/settings"];
  const needsAuth = authRequiredPaths.some((path) => pathname.startsWith(path));

  // If route needs auth and no session cookie, redirect to sign-in
  if (needsAuth && !sessionToken) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware on these specific paths
export const config = {
  matcher: ["/submit/:path*", "/settings/:path*"],
};

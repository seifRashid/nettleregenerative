import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "nr_admin_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "fallback_default_secret_for_nettle_regenerative_dashboard_2026!";
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin/emails routes
  if (!pathname.startsWith("/admin/emails")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey(), {
        algorithms: ["HS256"],
      });
      if (payload.role === "admin" && payload.email) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. If trying to visit login page while already authenticated -> redirect to dashboard
  if (pathname === "/admin/emails/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/emails", req.url));
    }
    return NextResponse.next();
  }

  // 2. If trying to access dashboard while not authenticated -> redirect to login page
  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/emails/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/emails/:path*"],
};

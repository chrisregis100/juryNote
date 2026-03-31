import { JURY_COOKIE_NAME } from "@/lib/jury-session";
import { NextRequest, NextResponse } from "next/server";

const BETTER_AUTH_COOKIE = "better-auth.session_token";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/supervisor");
}

function isJuryRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/jury") &&
    !pathname.startsWith("/jury/join") &&
    pathname !== "/jury/join"
  );
}

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  if (isAdminRoute(pathname)) {
    const session = req.cookies.get(BETTER_AUTH_COOKIE);
    if (!session?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
      return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  if (isJuryRoute(pathname)) {
    const jurySession = req.cookies.get(JURY_COOKIE_NAME);
    if (!jurySession?.value) {
      const juryLoginUrl = req.nextUrl.clone();
      juryLoginUrl.pathname = "/jury/join";
      juryLoginUrl.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
      return applySecurityHeaders(NextResponse.redirect(juryLoginUrl));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)",
  ],
};

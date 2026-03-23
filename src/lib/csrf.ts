import { NextRequest } from "next/server";

export function validateCsrf(req: NextRequest): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL;
  if (!appUrl) {
    console.error("[CSRF] NEXT_PUBLIC_APP_URL not configured — request rejected");
    return false;
  }
  let allowed: string;
  try {
    allowed = new URL(appUrl).origin;
  } catch {
    return false;
  }
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  if (origin) return origin === allowed;
  if (referer) {
    try {
      return new URL(referer).origin === allowed;
    } catch {
      return false;
    }
  }
  return false;
}

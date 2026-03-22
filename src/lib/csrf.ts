import { NextRequest } from "next/server";

export function validateCsrf(req: NextRequest): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL;
  if (!appUrl) return true; // Skip if not configured

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const allowed = new URL(appUrl).origin;

  if (origin) return origin === allowed;
  if (referer) {
    try {
      return new URL(referer).origin === allowed;
    } catch {
      return false;
    }
  }
  // No origin/referer in production = suspicious
  return process.env.NODE_ENV !== "production";
}

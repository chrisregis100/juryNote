import { NextRequest, NextResponse } from "next/server";
import { JURY_COOKIE_NAME } from "@/lib/jury-session";
import { validateCsrf } from "@/lib/csrf";

export async function POST(req: NextRequest) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(JURY_COOKIE_NAME);
  return res;
}

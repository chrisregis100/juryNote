import { NextResponse } from "next/server";
import { JURY_COOKIE_NAME } from "@/lib/jury-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(JURY_COOKIE_NAME);
  return res;
}

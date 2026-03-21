import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { juryPinSchema } from "@/lib/validations/event";
import {
  createJuryToken,
  JURY_COOKIE_NAME,
  JURY_MAX_AGE,
} from "@/lib/jury-session";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  const raw = body as Record<string, unknown>;
  const eventSlug =
    typeof raw.eventSlug === "string" ? raw.eventSlug.trim() : null;
  const pinCode = typeof raw.pinCode === "string" ? raw.pinCode : null;

  if (!eventSlug) {
    return NextResponse.json(
      { error: "Slug de l'événement manquant." },
      { status: 400 }
    );
  }

  const parsed = juryPinSchema.safeParse({ pinCode });
  if (!parsed.success) {
    return NextResponse.json({ error: "Code PIN invalide." }, { status: 400 });
  }

  const event = await db.event.findUnique({ where: { slug: eventSlug } });
  if (!event) {
    return NextResponse.json(
      { error: "Code invalide ou expiré. Vérifiez le slug et le PIN." },
      { status: 401 }
    );
  }

  const assignment = await db.juryAssignment.findFirst({
    where: { eventId: event.id, pinCode: parsed.data.pinCode },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Code invalide ou expiré. Vérifiez le slug et le PIN." },
      { status: 401 }
    );
  }

  if (assignment.expiresAt && assignment.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Code invalide ou expiré. Vérifiez le slug et le PIN." },
      { status: 401 }
    );
  }

  const token = createJuryToken({
    id: assignment.id,
    role: "jury",
    eventId: event.id,
    juryAssignmentId: assignment.id,
    displayName: assignment.displayName ?? null,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(JURY_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: JURY_MAX_AGE,
    path: "/",
  });

  return res;
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createJuryToken,
  JURY_COOKIE_NAME,
  JURY_MAX_AGE,
} from "@/lib/jury-session";

const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Token manquant." }, { status: 400 });
  }

  const existing = await db.juryAssignment.findUnique({
    where: { magicToken: token },
    select: { id: true, magicTokenUsedAt: true, expiresAt: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré." },
      { status: 401 }
    );
  }

  if (existing.magicTokenUsedAt !== null) {
    return NextResponse.json(
      {
        error:
          "Ce lien de connexion a déjà été utilisé. Veuillez demander un nouveau lien.",
      },
      { status: 410 }
    );
  }

  if (existing.expiresAt && existing.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré." },
      { status: 401 }
    );
  }

  // Atomically mark token as used and fetch full assignment in a transaction
  const assignment = await db.$transaction(async (tx) => {
    const updated = await tx.juryAssignment.update({
      where: {
        id: existing.id,
        magicTokenUsedAt: null, // guard: only update if not yet used (prevents race)
      },
      data: { magicTokenUsedAt: new Date() },
      include: { event: true },
    });
    return updated;
  });

  const juryToken = createJuryToken({
    id: assignment.id,
    role: "jury",
    eventId: assignment.event.id,
    juryAssignmentId: assignment.id,
    displayName: assignment.displayName ?? null,
    isPresident: assignment.isPresident,
  });

  const redirectUrl = new URL("/jury", APP_BASE_URL || _req.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(JURY_COOKIE_NAME, juryToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: JURY_MAX_AGE,
    path: "/",
  });

  return response;
}

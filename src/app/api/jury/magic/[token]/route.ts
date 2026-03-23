import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createJuryToken,
  JURY_COOKIE_NAME,
  JURY_MAX_AGE,
} from "@/lib/jury-session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: "Token manquant." }, { status: 400 });
  }

  const assignment = await db.juryAssignment.findUnique({
    where: { magicToken: token },
    include: { event: true },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré." },
      { status: 401 }
    );
  }

  if (assignment.expiresAt && assignment.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré." },
      { status: 401 }
    );
  }

  const juryToken = createJuryToken({
    id: assignment.id,
    role: "jury",
    eventId: assignment.event.id,
    juryAssignmentId: assignment.id,
    displayName: assignment.displayName ?? null,
    isPresident: assignment.isPresident,
  });

  const response = NextResponse.redirect(new URL("/jury", _req.url));
  response.cookies.set(JURY_COOKIE_NAME, juryToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: JURY_MAX_AGE,
    path: "/",
  });

  return response;
}

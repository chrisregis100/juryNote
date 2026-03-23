import "server-only";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Verifies whether a user has ownership over an event.
 * Supervisors bypass the check (intended admin behaviour).
 * Organizers must be the creator (organizerId) of the event.
 */
export async function verifyEventOwnership(
  eventId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  if (userRole === "supervisor") return true;

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { organizerId: true },
  });

  if (!event) return false;

  return event.organizerId === userId;
}

/**
 * Guard helper for route handlers.
 * Returns a 403 NextResponse when ownership cannot be confirmed,
 * or null when the caller may proceed.
 */
export async function requireEventOwnership(
  eventId: string,
  session: { user: { id: string; role: string } }
): Promise<NextResponse | null> {
  const allowed = await verifyEventOwnership(
    eventId,
    session.user.id,
    session.user.role
  );

  if (!allowed) {
    return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
  }

  return null;
}

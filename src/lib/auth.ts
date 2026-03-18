import { getServerSession as getServerSessionNextAuth } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export type SessionUser =
  | { role: "organizer" | "supervisor"; id: string; email?: string | null; name?: string | null }
  | { role: "jury"; id: string; eventId: string; juryAssignmentId: string; displayName?: string | null };

export async function getServerSession() {
  return getServerSessionNextAuth(authOptions);
}

export function isJurySession(session: { user?: SessionUser } | null): boolean {
  return session?.user != null && "juryAssignmentId" in session.user && "eventId" in session.user;
}

export function isOrganizerOrSupervisor(session: { user?: SessionUser } | null): boolean {
  if (!session?.user) return false;
  return session.user.role === "organizer" || session.user.role === "supervisor";
}

import { auth } from "@/lib/better-auth";
import { getServerSession as getNextAuthSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { headers } from "next/headers";

export type SessionUser =
  | { role: "organizer" | "supervisor"; id: string; email?: string | null; name?: string | null }
  | { role: "jury"; id: string; eventId: string; juryAssignmentId: string; displayName?: string | null };

export async function getServerSession(): Promise<{ user: SessionUser } | null> {
  // Try Better Auth first (organizer / supervisor via email+password or magic link)
  const betterAuthSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (betterAuthSession?.user) {
    const u = betterAuthSession.user as {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string;
    };
    const role: "organizer" | "supervisor" =
      u.role === "supervisor" ? "supervisor" : "organizer";
    return { user: { id: u.id, email: u.email, name: u.name, role } };
  }

  // Fall back to NextAuth (jury PIN credentials provider)
  const nextAuthSession = await getNextAuthSession(authOptions);
  if (!nextAuthSession?.user) return null;

  const u = nextAuthSession.user;

  if (u.role === "jury" && u.eventId && u.juryAssignmentId) {
    return {
      user: {
        role: "jury",
        id: u.id as string,
        eventId: u.eventId,
        juryAssignmentId: u.juryAssignmentId,
        displayName: u.displayName ?? null,
      },
    };
  }

  if (u.role === "organizer" || u.role === "supervisor") {
    return {
      user: {
        id: u.id as string,
        email: u.email ?? null,
        name: u.name ?? null,
        role: u.role as "organizer" | "supervisor",
      },
    };
  }

  return null;
}

export function isJurySession(session: { user?: SessionUser } | null): boolean {
  return session?.user != null && "juryAssignmentId" in session.user && "eventId" in session.user;
}

export function isOrganizerOrSupervisor(session: { user?: SessionUser } | null): boolean {
  if (!session?.user) return false;
  return session.user.role === "organizer" || session.user.role === "supervisor";
}

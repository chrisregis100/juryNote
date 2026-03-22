import "server-only";
import { auth } from "@/lib/better-auth";
import { verifyJuryToken, JURY_COOKIE_NAME } from "@/lib/jury-session";
import { headers, cookies } from "next/headers";

export type SessionUser =
  | { role: "organizer" | "supervisor"; id: string; email?: string | null; name?: string | null }
  | { role: "jury"; id: string; eventId: string; juryAssignmentId: string; displayName?: string | null };

export async function getServerSession(): Promise<{ user: SessionUser } | null> {
  // Better Auth session (organizer / supervisor via magic link)
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

  // Jury session via custom signed cookie
  const cookieStore = await cookies();
  const juryCookie = cookieStore.get(JURY_COOKIE_NAME);
  if (juryCookie?.value) {
    const payload = verifyJuryToken(juryCookie.value);
    if (payload) {
      return {
        user: {
          role: "jury",
          id: payload.id,
          eventId: payload.eventId,
          juryAssignmentId: payload.juryAssignmentId,
          displayName: payload.displayName ?? null,
        },
      };
    }
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

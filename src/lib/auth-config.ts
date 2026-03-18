import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { juryPinSchema } from "@/lib/validations/event";

declare module "next-auth" {
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    eventId?: string;
    juryAssignmentId?: string;
    displayName?: string | null;
  }

  interface Session {
    user: User & {
      role?: string;
      eventId?: string;
      juryAssignmentId?: string;
      displayName?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    eventId?: string;
    juryAssignmentId?: string;
    displayName?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Organizer / Supervisor",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        if (user.role !== "organizer" && user.role !== "supervisor") return null;
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "jury-pin",
      name: "Jury PIN",
      credentials: {
        eventSlug: { label: "Event slug", type: "text" },
        pinCode: { label: "PIN", type: "text" },
      },
      async authorize(credentials) {
        const parsed = juryPinSchema.safeParse({ pinCode: credentials?.pinCode });
        if (!parsed.success || !credentials?.eventSlug) return null;

        const event = await db.event.findUnique({
          where: { slug: credentials.eventSlug },
        });
        if (!event) return null;

        const assignment = await db.juryAssignment.findFirst({
          where: {
            eventId: event.id,
            pinCode: parsed.data.pinCode,
          },
        });
        if (!assignment) return null;
        if (assignment.expiresAt && assignment.expiresAt < new Date()) return null;

        return {
          id: assignment.id,
          role: "jury",
          eventId: event.id,
          juryAssignmentId: assignment.id,
          name: assignment.displayName ?? `Jury`,
          displayName: assignment.displayName ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.eventId = user.eventId;
        token.juryAssignmentId = user.juryAssignmentId;
        token.displayName = user.displayName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.eventId = token.eventId as string;
        session.user.juryAssignmentId = token.juryAssignmentId as string;
        session.user.displayName = token.displayName as string | null;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

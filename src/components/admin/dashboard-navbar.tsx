"use client";

import Link from "next/link";
import type { SessionUser } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

interface DashboardNavbarProps {
  user: SessionUser;
}

function getUserDisplayName(user: SessionUser): string {
  if (user.role === "jury") {
    return user.displayName ?? "Jury";
  }
  return user.email ?? user.name ?? "Organisateur";
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <nav className="mx-auto flex h-16 items-center justify-between px-6" aria-label="Navigation principale">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xl font-black tracking-tight"
          aria-label="JuryNote Admin - Accueil"
        >
          <span className="inline-block h-4 w-4 rotate-6 bg-indigo-600" />
          JuryNote
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-600 md:block">
            {getUserDisplayName(user)}
          </span>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}

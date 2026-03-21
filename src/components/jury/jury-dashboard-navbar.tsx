"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

interface JuryDashboardNavbarProps {
  displayName: string;
  eventName: string;
}

export function JuryDashboardNavbar({ displayName, eventName }: JuryDashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white">
      <nav
        className="mx-auto flex h-16 flex-wrap items-center justify-between gap-2 px-4 sm:px-6"
        aria-label="Navigation principale jury"
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/jury"
            className="flex items-center gap-2 text-lg font-black tracking-tight sm:text-xl"
            aria-label="JuryFlow - Tableau de bord jury"
          >
            <span className="inline-block h-4 w-4 shrink-0 rotate-6 bg-indigo-600" aria-hidden />
            JuryFlow
          </Link>
          <span className="hidden truncate text-sm font-medium text-slate-500 sm:inline md:max-w-[12rem] lg:max-w-md">
            {eventName}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <span className="hidden max-w-[10rem] truncate text-sm text-slate-600 md:block" title={displayName}>
            {displayName}
          </span>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}

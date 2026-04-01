"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export const AuthNavButton = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />;
  }

  if (session) {
    return (
      <Link
        href="/admin"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Tableau de bord
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Se connecter
    </Link>
  );
};

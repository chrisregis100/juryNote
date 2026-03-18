"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const handleClick = () => signOut({ callbackUrl: "/" });
  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
      Déconnexion
    </Button>
  );
}

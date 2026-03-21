"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleClick = async () => {
    await authClient.signOut().catch(() => {});
    await fetch("/api/jury/sign-out", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick}>
      Déconnexion
    </Button>
  );
}

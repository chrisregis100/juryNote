"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { closeDeliberationAsPresident } from "@/server/actions/deliberation";
import { Button } from "@/components/ui/button";

interface CloseDeliberationButtonProps {
  eventId: string;
}

export function CloseDeliberationButton({ eventId }: CloseDeliberationButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await closeDeliberationAsPresident(eventId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleClose}
        disabled={isLoading}
        className="border-2 border-black bg-red-600 font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#000] disabled:opacity-60"
      >
        {isLoading ? "Clôture en cours…" : "Clôturer la délibération"}
      </Button>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

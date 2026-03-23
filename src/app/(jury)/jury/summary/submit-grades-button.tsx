"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitJuryGrades } from "@/server/actions/grade";
import { Button } from "@/components/ui/button";

interface SubmitGradesButtonProps {
  juryAssignmentId: string;
  isAllGraded: boolean;
  isPresident: boolean;
}

export function SubmitGradesButton({
  juryAssignmentId,
  isAllGraded,
  isPresident,
}: SubmitGradesButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitJuryGrades(juryAssignmentId);
      if (result?.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-green-600 bg-green-50 p-4 text-sm font-medium text-green-800 shadow-[4px_4px_0_0_#16a34a]">
          Notes soumises avec succès
        </div>
        {isPresident && (
          <Button
            asChild
            className="border-2 border-black bg-black font-bold text-white shadow-[2px_2px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4f46e5]"
          >
            <Link href="/jury/deliberation">Accéder à la délibération →</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isAllGraded || isLoading}
        className="border-2 border-black bg-black font-bold text-white shadow-[2px_2px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4f46e5] disabled:opacity-50"
      >
        {isLoading ? "Envoi en cours…" : "Soumettre mes notes"}
      </Button>
      {!isAllGraded && (
        <p className="text-xs text-slate-500">
          Toutes les équipes doivent être notées avant de soumettre.
        </p>
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

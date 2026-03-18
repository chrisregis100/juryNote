"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamRankingItem } from "@/lib/scoring";
import { closeDeliberation } from "@/server/actions/deliberation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeliberationViewProps {
  ranking: TeamRankingItem[];
  isLocked: boolean;
  eventId: string;
}

export function DeliberationView({
  ranking,
  isLocked,
  eventId,
}: DeliberationViewProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = async () => {
    if (isLocked) return;
    setIsClosing(true);
    setError(null);
    const result = await closeDeliberation(eventId);
    setIsClosing(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {!isLocked && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <p className="text-sm text-amber-800">
              Une fois le classement validé, les notes ne pourront plus être modifiées.
            </p>
            <Button
              variant="default"
              onClick={handleClose}
              disabled={isClosing}
            >
              {isClosing ? "Clôture…" : "Clôturer la délibération"}
            </Button>
          </CardContent>
        </Card>
      )}

      {isLocked && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Délibération clôturée. Classement figé.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Classement (score pondéré)</CardTitle>
          <p className="text-sm text-slate-600">
            Score = Σ(Note × Coefficient) / Σ(Coefficients)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 font-medium text-slate-700">Rang</th>
                  <th className="pb-2 font-medium text-slate-700">Équipe</th>
                  <th className="pb-2 font-medium text-slate-700">Score</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row) => (
                  <tr key={row.teamId} className="border-b border-slate-100">
                    <td className="py-2 font-mono text-slate-600">{row.rank}</td>
                    <td className="py-2 font-medium">{row.teamName}</td>
                    <td className="py-2 font-mono text-slate-600">
                      {row.score.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

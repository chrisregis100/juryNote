"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamRankingItem } from "@/lib/scoring";
import { closeDeliberation } from "@/server/actions/deliberation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DeliberationPanelProps {
  ranking: TeamRankingItem[];
  isLocked: boolean;
  eventId: string;
}

const PODIUM_STYLES: Record<
  number,
  { label: string; card: string; bar: string; accent: string }
> = {
  1: {
    label: "1er",
    card: "border-yellow-500 bg-gradient-to-b from-yellow-50 to-amber-50",
    bar: "h-28 bg-yellow-400",
    accent: "text-yellow-900",
  },
  2: {
    label: "2e",
    card: "border-slate-400 bg-gradient-to-b from-slate-50 to-slate-100",
    bar: "h-20 bg-slate-300",
    accent: "text-slate-800",
  },
  3: {
    label: "3e",
    card: "border-amber-700 bg-gradient-to-b from-amber-50 to-orange-50",
    bar: "h-16 bg-amber-600/80",
    accent: "text-amber-950",
  },
};

function PodiumBlock({ row, order }: { row: TeamRankingItem; order: "first" | "second" | "third" }) {
  const style = PODIUM_STYLES[row.rank];
  if (!style) return null;

  const orderClass =
    order === "first"
      ? "order-2 md:order-none md:col-start-2 md:row-start-1 md:z-10 md:-mt-4"
      : order === "second"
        ? "order-1 md:order-none md:col-start-1 md:row-start-1"
        : "order-3 md:order-none md:col-start-3 md:row-start-1";

  return (
    <div className={`flex flex-col items-center ${orderClass}`}>
      <Card
        className={`w-full max-w-44 border-2 border-black shadow-[4px_4px_0_0_#000] ${style.card}`}
      >
        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
          <span
            className={`inline-flex min-w-10 justify-center rounded-md border-2 border-black px-2 py-0.5 text-xs font-black ${style.accent} bg-white`}
          >
            {style.label}
          </span>
          <p className="text-sm font-black leading-tight text-black">{row.teamName}</p>
          <p className="font-mono text-lg font-bold text-indigo-700">{row.score.toFixed(2)}</p>
        </CardContent>
      </Card>
      <div
        className={`mt-2 w-full max-w-28 rounded-t-md border-2 border-b-0 border-black ${style.bar}`}
        aria-hidden
      />
    </div>
  );
}

export function DeliberationPanel({ ranking, isLocked, eventId }: DeliberationPanelProps) {
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

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  const rowByRank = (r: number) => top3.find((x) => x.rank === r);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-600">Phase délibération</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-black md:text-3xl">
          Classement &amp; synthèse
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Les scores agrègent toutes les notes des jurys. Lorsque vous clôturez, le classement est figé et la
          notation jury est verrouillée.
        </p>
      </div>

      {isLocked ? (
        <div
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-black bg-emerald-50 p-4 shadow-[4px_4px_0_0_#000]"
          role="status"
        >
          <div>
            <p className="text-sm font-black text-emerald-900">Délibération clôturée</p>
            <p className="text-sm text-emerald-800">Le classement affiché est définitif.</p>
          </div>
          <span className="rounded-md border-2 border-black bg-white px-3 py-1 text-xs font-bold text-emerald-800">
            Figé
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-indigo-600 bg-indigo-50 p-4 shadow-[4px_4px_0_0_#000]">
          <div>
            <p className="text-sm font-black text-indigo-950">Délibération ouverte</p>
            <p className="text-sm text-indigo-900">
              Les jurys peuvent encore ajuster leurs notes jusqu&apos;à la clôture.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isClosing}
            className="h-11 border-2 border-black bg-black font-bold text-white shadow-[4px_4px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-black disabled:opacity-60"
          >
            {isClosing ? "Clôture…" : "Clôturer la délibération"}
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {top3.length > 0 && (
        <section aria-labelledby="podium-heading">
          <h3 id="podium-heading" className="mb-4 text-lg font-black text-black">
            Podium
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end md:justify-items-center">
            {rowByRank(2) && <PodiumBlock row={rowByRank(2)!} order="second" />}
            {rowByRank(1) && <PodiumBlock row={rowByRank(1)!} order="first" />}
            {rowByRank(3) && <PodiumBlock row={rowByRank(3)!} order="third" />}
          </div>
        </section>
      )}

      <Card className="border-2 border-black shadow-[4px_4px_0_0_#000]">
        <CardContent className="p-0">
          <div className="border-b-2 border-black bg-slate-50 px-5 py-4">
            <h3 className="text-lg font-black text-black">Classement complet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Score pondéré : Σ(Note × coefficient) / Σ(coefficients), agrégé sur tous les jurys.
            </p>
          </div>
          <div className="overflow-x-auto p-2 md:p-0">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="px-4 py-3 font-black text-black">Rang</th>
                  <th className="px-4 py-3 font-black text-black">Équipe</th>
                  <th className="px-4 py-3 font-black text-black">Score</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-600">
                      Aucune équipe à classer pour cet événement.
                    </td>
                  </tr>
                ) : (
                  ranking.map((row) => (
                    <tr
                      key={row.teamId}
                      className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex min-w-8 justify-center rounded border-2 border-black bg-white px-2 py-0.5 font-mono text-sm font-bold text-slate-800">
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-black">{row.teamName}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                        {row.score.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {rest.length > 0 && (
        <p className="text-center text-xs text-slate-500">
          Le podium met en avant les trois premières places ; le tableau ci-dessus liste toutes les équipes.
        </p>
      )}
    </div>
  );
}

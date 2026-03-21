import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function JuryDashboardPage() {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) return null;

  const eventId = session.user.eventId;
  const juryAssignmentId = session.user.juryAssignmentId;

  const [event, teams, criteria, grades, deliberation] = await Promise.all([
    db.event.findUnique({
      where: { id: eventId },
      select: { name: true },
    }),
    db.team.findMany({
      where: { eventId },
      orderBy: { name: "asc" },
    }),
    db.criterion.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    }),
    db.grade.findMany({
      where: { juryAssignmentId },
      select: { teamId: true, criterionId: true },
    }),
    db.deliberation.findFirst({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isLocked = deliberation?.status === "locked";
  const criteriaCount = criteria.length;
  const gradesPerTeam = new Map<string, Set<string>>();
  for (const g of grades) {
    let set = gradesPerTeam.get(g.teamId);
    if (!set) {
      set = new Set();
      gradesPerTeam.set(g.teamId, set);
    }
    set.add(g.criterionId);
  }

  const fullyGradedTeamIds = new Set(
    teams
      .filter((t) => {
        const set = gradesPerTeam.get(t.id);
        return criteriaCount === 0 || (set?.size === criteriaCount);
      })
      .map((t) => t.id)
  );

  const gradedCount = fullyGradedTeamIds.size;
  const totalTeams = teams.length;
  const progressPct = totalTeams === 0 ? 0 : Math.round((gradedCount / totalTeams) * 100);

  const nextTeam = teams.find((t) => !fullyGradedTeamIds.has(t.id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Espace jury</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-black md:text-3xl">
          {event?.name ?? "Événement"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Bienvenue{session.user.displayName ? `, ${session.user.displayName}` : ""}. Suivez votre progression
          et accédez rapidement à la notation.
        </p>
      </div>

      {isLocked && (
        <div
          className="rounded-xl border-2 border-amber-500 bg-amber-50 p-4 text-sm font-medium text-amber-900 shadow-[4px_4px_0_0_#000]"
          role="status"
        >
          La délibération est clôturée. Vous pouvez consulter le récapitulatif ; les notes ne sont plus modifiables.
        </div>
      )}

      <Card className="border-2 border-black shadow-[4px_4px_0_0_#000]">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-700">Progression</p>
              <p className="text-3xl font-black tabular-nums text-black">
                {gradedCount}
                <span className="text-lg font-bold text-slate-500"> / {totalTeams}</span>
              </p>
              <p className="text-xs text-slate-500">équipes entièrement notées</p>
            </div>
            <span className="rounded-md border-2 border-black bg-indigo-50 px-3 py-1 text-sm font-black text-indigo-800">
              {progressPct}%
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full border-2 border-black bg-slate-100"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Pourcentage d'équipes notées"
          >
            <div
              className="h-full bg-indigo-600 transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!isLocked && nextTeam && (
          <Button
            asChild
            className="h-12 border-2 border-black bg-black font-bold text-white shadow-[4px_4px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-black sm:flex-1"
          >
            <Link href={`/jury/teams/${nextTeam.id}`}>Continuer — {nextTeam.name}</Link>
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          className="h-12 border-2 border-black bg-white font-bold hover:bg-slate-50 sm:flex-1"
        >
          <Link href="/jury/teams">Toutes les équipes</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 border-2 border-black bg-white font-bold hover:bg-slate-50 sm:flex-1"
        >
          <Link href="/jury/summary">Récapitulatif</Link>
        </Button>
      </div>

      {!isLocked && !nextTeam && totalTeams > 0 && (
        <p className="text-center text-sm font-medium text-emerald-800">
          Toutes les équipes sont notées. Consultez le récapitulatif ou revenez sur une fiche pour ajuster vos notes.
        </p>
      )}
    </div>
  );
}

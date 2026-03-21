import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JurySummaryPage() {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) return null;

  const eventId = session.user.eventId;
  const juryAssignmentId = session.user.juryAssignmentId;

  const [teams, criteria, grades, deliberation] = await Promise.all([
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
      include: { criterion: true },
    }),
    db.deliberation.findFirst({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isLocked = deliberation?.status === "locked";
  const gradesByTeam = new Map<string, typeof grades>();
  for (const g of grades) {
    const list = gradesByTeam.get(g.teamId) ?? [];
    list.push(g);
    gradesByTeam.set(g.teamId, list);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Mes notes</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-black md:text-3xl">
          Récapitulatif
        </h1>
        <p className="mt-2 text-sm text-slate-600">Vue par équipe et par critère.</p>
      </div>
      {isLocked && (
        <div className="rounded-xl border-2 border-black bg-amber-50 p-4 text-sm font-medium text-amber-900 shadow-[4px_4px_0_0_#000]">
          La délibération est clôturée. Les notes ne sont plus modifiables.
        </div>
      )}

      <ul className="space-y-4">
        {teams.map((team) => {
          const teamGrades = gradesByTeam.get(team.id) ?? [];
          return (
            <li key={team.id}>
              <Card className="border-2 border-black shadow-[4px_4px_0_0_#000]">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-black">{team.name}</p>
                    {!isLocked && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-2 border-black font-bold"
                      >
                        <Link href={`/jury/teams/${team.id}`}>Modifier</Link>
                      </Button>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                    {criteria.map((c) => {
                      const g = teamGrades.find((x) => x.criterionId === c.id);
                      return (
                        <li key={c.id}>
                          {c.name}: {g ? g.value : "—"}
                          {g?.comment && (
                            <span className="ml-2 text-slate-500">
                              « {g.comment} »
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="border-2 border-black font-medium">
          <Link href="/jury/teams">← Liste des équipes</Link>
        </Button>
        <Button asChild variant="outline" className="border-2 border-black font-medium">
          <Link href="/jury">Tableau de bord</Link>
        </Button>
      </div>
    </div>
  );
}

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
      <h1 className="text-xl font-semibold text-slate-900">Récapitulatif de mes notes</h1>
      {isLocked && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          La délibération est clôturée. Les notes ne sont plus modifiables.
        </p>
      )}

      <ul className="space-y-4">
        {teams.map((team) => {
          const teamGrades = gradesByTeam.get(team.id) ?? [];
          return (
            <li key={team.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{team.name}</p>
                    {!isLocked && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/jury/teams/${team.id}`}>Modifier</Link>
                      </Button>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600">
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

      <Button asChild variant="outline">
        <Link href="/jury">← Retour à la liste des équipes</Link>
      </Button>
    </div>
  );
}

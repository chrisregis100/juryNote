import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JuryDashboardPage() {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) return null;

  const eventId = session.user.eventId;
  const juryAssignmentId = session.user.juryAssignmentId;

  const [teams, criteria, grades] = await Promise.all([
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
  ]);

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
    teams.filter((t) => {
      const set = gradesPerTeam.get(t.id);
      return criteriaCount === 0 || (set?.size === criteriaCount);
    }).map((t) => t.id)
  );
  const gradedCount = fullyGradedTeamIds.size;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Équipes à noter</h1>
      <p className="text-sm text-slate-600">
        {gradedCount} / {teams.length} notées. Cliquez sur une équipe pour noter.
      </p>

      <ul className="space-y-2">
        {teams.map((team) => {
          const hasAllGrades = fullyGradedTeamIds.has(team.id);
          const status = hasAllGrades ? "Noté" : "À noter";
          return (
            <li key={team.id}>
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-slate-900">{team.name}</p>
                    <p
                      className={`text-sm ${hasAllGrades ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {status}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/jury/teams/${team.id}`}>
                      {hasAllGrades ? "Modifier" : "Noter"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card>
        <CardContent className="p-4">
          <Link
            href="/jury/summary"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Voir le récapitulatif de mes notes →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

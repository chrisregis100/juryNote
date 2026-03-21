import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function JuryTeamsListPage() {
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
    teams
      .filter((t) => {
        const set = gradesPerTeam.get(t.id);
        return criteriaCount === 0 || (set?.size === criteriaCount);
      })
      .map((t) => t.id)
  );
  const gradedCount = fullyGradedTeamIds.size;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-black">Équipes à noter</h1>
        <p className="mt-2 text-sm text-slate-600">
          {gradedCount} / {teams.length} équipes entièrement notées. Choisissez une équipe pour noter ou modifier.
        </p>
      </div>

      <ul className="space-y-3">
        {teams.map((team) => {
          const hasAllGrades = fullyGradedTeamIds.has(team.id);
          const status = hasAllGrades ? "Noté" : "À noter";
          return (
            <li key={team.id}>
              <Card className="border-2 border-black shadow-[4px_4px_0_0_#000] transition-shadow hover:shadow-[5px_5px_0_0_#000]">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-bold text-black">{team.name}</p>
                    <p
                      className={`text-sm font-medium ${hasAllGrades ? "text-emerald-700" : "text-amber-700"}`}
                    >
                      {status}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="border-2 border-black font-bold shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <Link href={`/jury/teams/${team.id}`}>{hasAllGrades ? "Modifier" : "Noter"}</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      <Card className="border-2 border-black bg-white shadow-[4px_4px_0_0_#000]">
        <CardContent className="p-4">
          <Link
            href="/jury/summary"
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            Voir le récapitulatif de mes notes →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

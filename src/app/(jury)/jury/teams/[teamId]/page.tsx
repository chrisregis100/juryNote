import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotationForm } from "./notation-form";

export default async function TeamNotationPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) return null;

  const { teamId } = await params;
  const eventId = session.user.eventId;
  const juryAssignmentId = session.user.juryAssignmentId;
  if (!eventId || !juryAssignmentId) return null;

  const [team, criteria, deliberation, existingGrades] = await Promise.all([
    db.team.findFirst({
      where: { id: teamId, eventId },
    }),
    db.criterion.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    }),
    db.deliberation.findFirst({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    }),
    db.grade.findMany({
      where: { teamId, juryAssignmentId },
      select: { criterionId: true, value: true, comment: true },
    }),
  ]);

  if (!team) notFound();
  const isLocked = deliberation?.status === "locked";
  const gradesByCriterion = Object.fromEntries(
    existingGrades.map((g) => [g.criterionId, { value: g.value, comment: g.comment }])
  );

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">{team.name}</h1>
      <NotationForm
        teamId={team.id}
        criteria={criteria}
        initialGrades={gradesByCriterion}
        juryAssignmentId={juryAssignmentId}
        isLocked={isLocked}
      />
    </div>
  );
}

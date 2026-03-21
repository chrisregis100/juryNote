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
      <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Notation</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-black">{team.name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ajustez les curseurs et commentaires ; la sauvegarde est automatique.
        </p>
      </div>
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

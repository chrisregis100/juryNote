"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { upsertGradeSchema } from "@/lib/validations/grade";
import { getServerSession } from "@/lib/auth";

async function getCriterionScaleMax(criterionId: string): Promise<number> {
  const c = await db.criterion.findUnique({
    where: { id: criterionId },
    select: { scaleType: true },
  });
  if (!c) return 10;
  const map: Record<string, number> = {
    SCALE_0_5: 5,
    SCALE_0_10: 10,
    SCALE_0_20: 20,
  };
  return map[c.scaleType] ?? 10;
}

export async function upsertGrade(
  juryAssignmentId: string,
  payload: { teamId: string; criterionId: string; value: number; comment?: string | null }
) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "jury") throw new Error("Forbidden");

  // IDOR guard: ensure the juryAssignmentId belongs to the authenticated jury member
  if (session.user.juryAssignmentId !== juryAssignmentId) throw new Error("Forbidden");

  const parsed = upsertGradeSchema.safeParse(payload);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const max = await getCriterionScaleMax(payload.criterionId);
  if (payload.value < 0 || payload.value > max) {
    return { error: { value: [`Value must be between 0 and ${max}`] } };
  }

  const assignment = await db.juryAssignment.findUnique({
    where: { id: juryAssignmentId },
    include: { event: { include: { deliberations: { where: { status: "locked" }, take: 1 } } } },
  });
  if (!assignment) return { error: "Jury assignment not found" };
  if (assignment.event.deliberations.length > 0) {
    return { error: "Deliberation is closed; notes cannot be modified." };
  }

  const { teamId, criterionId, value, comment } = parsed.data;
  await db.grade.upsert({
    where: {
      teamId_criterionId_juryAssignmentId: {
        teamId,
        criterionId,
        juryAssignmentId,
      },
    },
    create: {
      teamId,
      criterionId,
      juryAssignmentId,
      value,
      comment: comment ?? null,
    },
    update: {
      value,
      comment: comment ?? null,
    },
  });

  revalidatePath("/jury");
  revalidatePath("/jury/teams");
  return { data: { ok: true } };
}

export async function submitJuryGrades(juryAssignmentId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "jury") throw new Error("Forbidden");

  // IDOR guard
  if (session.user.juryAssignmentId !== juryAssignmentId) throw new Error("Forbidden");

  const assignment = await db.juryAssignment.findUnique({
    where: { id: juryAssignmentId },
    include: {
      event: {
        include: {
          teams: true,
          criteria: true,
          deliberations: { where: { status: "locked" }, take: 1 },
        },
      },
    },
  });
  if (!assignment) return { error: "Jury assignment not found" };
  if (assignment.event.deliberations.length > 0) {
    return { error: "La délibération est clôturée ; impossible de soumettre." };
  }

  const expectedCount = assignment.event.teams.length * assignment.event.criteria.length;

  const gradedCount = await db.grade.count({
    where: { juryAssignmentId },
  });

  if (gradedCount < expectedCount) {
    return {
      error: `Toutes les notes doivent être saisies avant de soumettre. (${gradedCount}/${expectedCount})`,
    };
  }

  await db.juryAssignment.update({
    where: { id: juryAssignmentId },
    data: { submittedAt: new Date() },
  });

  revalidatePath("/jury");
  revalidatePath("/jury/teams");
  return { data: { ok: true } };
}

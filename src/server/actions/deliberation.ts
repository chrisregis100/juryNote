"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { computeRanking } from "@/lib/scoring";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";

export async function getOrCreateDeliberation(eventId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  let d = await db.deliberation.findFirst({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });
  if (!d) {
    d = await db.deliberation.create({
      data: { eventId, status: "open" },
    });
  }
  return d;
}

export async function closeDeliberation(eventId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      teams: true,
      criteria: true,
      deliberations: { where: { status: "locked" }, take: 1 },
    },
  });
  if (!event) return { error: "Event not found" };
  if (event.deliberations.length > 0) return { error: "Deliberation already closed" };

  const grades = await db.grade.findMany({
    where: {
      team: { eventId },
    },
    select: { teamId: true, criterionId: true, value: true },
  });

  const ranking = computeRanking(
    event.teams.map((t) => ({ id: t.id, name: t.name })),
    grades,
    event.criteria
  );

  let deliberation = await db.deliberation.findFirst({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });
  if (!deliberation) {
    deliberation = await db.deliberation.create({
      data: { eventId, status: "open" },
    });
  }

  await db.deliberation.update({
    where: { id: deliberation.id },
    data: { status: "locked", closedAt: new Date() },
  });

  await db.rankingSnapshot.create({
    data: {
      deliberationId: deliberation.id,
      rankingsJson: JSON.stringify(ranking),
    },
  });

  revalidatePath(`/admin/events/${eventId}/deliberation`);
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/supervisor/events/${eventId}`);
  revalidatePath("/jury");
  return { data: { ok: true } };
}

export async function getRanking(eventId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: { teams: true, criteria: true },
  });
  if (!event) return { error: "Event not found" };

  const grades = await db.grade.findMany({
    where: { team: { eventId } },
    select: { teamId: true, criterionId: true, value: true },
  });

  const ranking = computeRanking(
    event.teams.map((t) => ({ id: t.id, name: t.name })),
    grades,
    event.criteria
  );

  const deliberation = await db.deliberation.findFirst({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: {
      ranking,
      isLocked: deliberation?.status === "locked",
    },
  };
}

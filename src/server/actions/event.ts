"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { createEventSchema, createCriterionSchema, createTeamSchema } from "@/lib/validations/event";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";

export async function createEvent(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };
  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const event = await db.event.create({
    data: { name: parsed.data.name, slug: parsed.data.slug },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/events");
  return { data: event };
}

export async function createCriterion(eventId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    name: formData.get("name") as string,
    weight: Number(formData.get("weight")),
    scaleType: formData.get("scaleType") as "SCALE_0_5" | "SCALE_0_10" | "SCALE_0_20",
    order: Number(formData.get("order") ?? 0),
  };
  const parsed = createCriterionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const criterion = await db.criterion.create({
    data: {
      eventId,
      name: parsed.data.name,
      weight: parsed.data.weight,
      scaleType: parsed.data.scaleType,
      order: parsed.data.order ?? 0,
    },
  });
  revalidatePath(`/admin/events/${eventId}`);
  return { data: criterion };
}

export async function createTeam(eventId: string, formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    name: formData.get("name") as string,
    members: [] as string[],
  };
  const membersStr = formData.get("members") as string | null;
  if (membersStr) {
    try {
      raw.members = JSON.parse(membersStr) as string[];
    } catch {
      raw.members = membersStr.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  const parsed = createTeamSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const team = await db.team.create({
    data: {
      eventId,
      name: parsed.data.name,
      membersJson: JSON.stringify(parsed.data.members ?? []),
    },
  });
  revalidatePath(`/admin/events/${eventId}`);
  return { data: team };
}

export async function createJuryMember(
  eventId: string,
  displayName: string,
  isPresident: boolean
) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");

  const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  const magicToken = randomUUID();

  const assignment = await db.juryAssignment.create({
    data: {
      eventId,
      pinCode,
      displayName,
      isPresident,
      magicToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/admin/events/${eventId}/jury`);
  return {
    data: {
      id: assignment.id,
      pinCode: assignment.pinCode,
      magicToken: assignment.magicToken,
      displayName: assignment.displayName,
      isPresident: assignment.isPresident,
    },
  };
}

export async function deleteJuryMember(assignmentId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");

  const assignment = await db.juryAssignment.findUnique({
    where: { id: assignmentId },
    select: { eventId: true },
  });
  if (!assignment) return { error: "Assignment not found" };

  await db.juryAssignment.delete({ where: { id: assignmentId } });

  revalidatePath(`/admin/events/${assignment.eventId}`);
  revalidatePath(`/admin/events/${assignment.eventId}/jury`);
  return { data: { ok: true } };
}

export async function generateJuryPin(eventId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  const assignment = await db.juryAssignment.create({
    data: {
      eventId,
      pinCode,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  revalidatePath(`/admin/events/${eventId}`);
  return {
    data: {
      id: assignment.id,
      pinCode: assignment.pinCode,
      magicToken: assignment.magicToken,
    },
  };
}

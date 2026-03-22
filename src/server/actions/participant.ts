"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  createInvitedParticipantSchema,
  updateInvitedParticipantSchema,
  bulkImportInvitedParticipantsSchema,
  createCustomQuestionSchema,
  updateCustomQuestionSchema,
} from "@/lib/validations/participant";
import type { ParsedParticipant } from "@/lib/utils/file-parser";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";

export async function createInvitedParticipant(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    eventId: formData.get("eventId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string | null,
    phone: formData.get("phone") as string | null,
    profession: formData.get("profession") as string | null,
  };
  const parsed = createInvitedParticipantSchema.safeParse({
    ...raw,
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    profession: raw.profession || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const participant = await db.invitedParticipant.create({
    data: {
      eventId: parsed.data.eventId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      profession: parsed.data.profession || null,
    },
  });

  // Ensure checkin link exists
  await ensureCheckinLink(parsed.data.eventId);

  revalidatePath(`/admin/events/${parsed.data.eventId}`);
  return { data: participant };
}

export async function updateInvitedParticipant(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string | null,
    email: formData.get("email") as string | null,
    phone: formData.get("phone") as string | null,
    profession: formData.get("profession") as string | null,
  };
  const parsed = updateInvitedParticipantSchema.safeParse({
    ...raw,
    email: raw.email || undefined,
    phone: raw.phone || undefined,
    profession: raw.profession || undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const participant = await db.invitedParticipant.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      profession: parsed.data.profession || null,
    },
  });

  revalidatePath(`/admin/events/${participant.eventId}`);
  return { data: participant };
}

export async function deleteInvitedParticipant(participantId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const participant = await db.invitedParticipant.findUnique({
    where: { id: participantId },
  });
  if (!participant) return { error: "Participant not found" };

  await db.invitedParticipant.delete({
    where: { id: participantId },
  });

  revalidatePath(`/admin/events/${participant.eventId}`);
  return { data: { success: true } };
}

export async function bulkImportInvitedParticipants(eventId: string, participants: ParsedParticipant[]) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const parsed = bulkImportInvitedParticipantsSchema.safeParse({
    eventId,
    participants,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const results = await Promise.allSettled(
    parsed.data.participants.map(async (participant) => {
      // Check if participant with same name already exists
      const existing = await db.invitedParticipant.findFirst({
        where: {
          eventId: parsed.data.eventId,
          name: participant.name,
        },
      });

      if (existing) {
        // Update existing
        return db.invitedParticipant.update({
          where: { id: existing.id },
          data: {
            email: participant.email || existing.email || null,
            phone: participant.phone || existing.phone || null,
            profession: participant.profession || existing.profession || null,
          },
        });
      } else {
        // Create new
        return db.invitedParticipant.create({
          data: {
            eventId: parsed.data.eventId,
            name: participant.name,
            email: participant.email || null,
            phone: participant.phone || null,
            profession: participant.profession || null,
          },
        });
      }
    })
  );

  // Ensure checkin link exists
  await ensureCheckinLink(parsed.data.eventId);

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  revalidatePath(`/admin/events/${parsed.data.eventId}`);
  return {
    data: {
      imported: successful,
      failed,
      total: parsed.data.participants.length,
    },
  };
}

async function ensureCheckinLink(eventId: string) {
  const existing = await db.checkinLink.findUnique({
    where: { eventId },
  });
  if (!existing) {
    await db.checkinLink.create({
      data: {
        eventId,
        isActive: true,
      },
    });
  }
}

export async function createCustomQuestion(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    eventId: formData.get("eventId") as string,
    label: formData.get("label") as string,
    type: formData.get("type") as string,
    options: formData.get("options") as string | null,
    isRequired: formData.get("isRequired") === "true",
    order: Number(formData.get("order") || 0),
  };

  let optionsArray: string[] | undefined;
  if (raw.options) {
    try {
      optionsArray = JSON.parse(raw.options) as string[];
    } catch {
      optionsArray = raw.options.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  const parsed = createCustomQuestionSchema.safeParse({
    ...raw,
    options: optionsArray,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const question = await db.customQuestion.create({
    data: {
      eventId: parsed.data.eventId,
      label: parsed.data.label,
      type: parsed.data.type,
      options: parsed.data.options ? JSON.stringify(parsed.data.options) : null,
      isRequired: parsed.data.isRequired,
      order: parsed.data.order,
    },
  });

  revalidatePath(`/admin/events/${parsed.data.eventId}`);
  return { data: question };
}

export async function updateCustomQuestion(formData: FormData) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const raw = {
    id: formData.get("id") as string,
    label: formData.get("label") as string | null,
    type: formData.get("type") as string | null,
    options: formData.get("options") as string | null,
    isRequired: formData.get("isRequired") === "true" ? true : formData.get("isRequired") === "false" ? false : undefined,
    order: formData.get("order") ? Number(formData.get("order")) : undefined,
  };

  let optionsArray: string[] | undefined;
  if (raw.options) {
    try {
      optionsArray = JSON.parse(raw.options) as string[];
    } catch {
      optionsArray = raw.options.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  const parsed = updateCustomQuestionSchema.safeParse({
    ...raw,
    options: optionsArray,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const question = await db.customQuestion.update({
    where: { id: parsed.data.id },
    data: {
      label: parsed.data.label,
      type: parsed.data.type,
      options: parsed.data.options ? JSON.stringify(parsed.data.options) : null,
      isRequired: parsed.data.isRequired,
      order: parsed.data.order,
    },
  });

  revalidatePath(`/admin/events/${question.eventId}`);
  return { data: question };
}

export async function deleteCustomQuestion(questionId: string) {
  const session = await getServerSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isOrganizerOrSupervisor(session)) throw new Error("Forbidden");
  const question = await db.customQuestion.findUnique({
    where: { id: questionId },
  });
  if (!question) return { error: "Question not found" };

  await db.customQuestion.delete({
    where: { id: questionId },
  });

  revalidatePath(`/admin/events/${question.eventId}`);
  return { data: { success: true } };
}

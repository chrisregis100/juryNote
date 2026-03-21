"use server";

import { revalidatePath } from "next/cache";
import type { ParticipantCheckin } from "@prisma/client";
import { db } from "@/lib/db";
import { checkinParticipantSchema, updateCheckinParticipantSchema } from "@/lib/validations/participant";

export async function getCheckinLinkByEventSlug(eventSlug: string) {
  const event = await db.event.findUnique({
    where: { slug: eventSlug },
    include: {
      checkinLinks: true,
    },
  });
  if (!event) return null;

  const checkinLink = event.checkinLinks[0];
  if (!checkinLink || !checkinLink.isActive) return null;

  return {
    eventId: event.id,
    eventName: event.name,
    token: checkinLink.token,
    isActive: checkinLink.isActive,
  };
}

export async function findInvitedParticipant(eventId: string, name: string) {
  // Normalize name for search (case-insensitive, handle accents)
  const normalizedSearch = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const participants = await db.invitedParticipant.findMany({
    where: { eventId },
  });

  // Find by exact match or normalized match
  const found = participants.find((p) => {
    const normalizedName = p.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    return normalizedName === normalizedSearch || p.name.toLowerCase() === name.toLowerCase();
  });

  return found || null;
}

export async function checkinParticipant(formData: FormData) {
  const raw = {
    eventId: formData.get("eventId") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    profession: formData.get("profession") as string,
    photoConsent: formData.get("photoConsent") === "true",
    invitedParticipantId: formData.get("invitedParticipantId") as string | null,
    answers: formData.get("answers") as string | null,
  };

  let answersArray: Array<{ customQuestionId: string; value: string }> = [];
  if (raw.answers) {
    try {
      answersArray = JSON.parse(raw.answers) as Array<{ customQuestionId: string; value: string }>;
    } catch {
      // Invalid JSON, ignore
    }
  }

  const parsed = checkinParticipantSchema.safeParse({
    ...raw,
    invitedParticipantId: raw.invitedParticipantId || undefined,
    answers: answersArray,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  // Check if participant already checked in (by name + email)
  const existing = await db.participantCheckin.findFirst({
    where: {
      eventId: parsed.data.eventId,
      name: parsed.data.name,
      email: parsed.data.email,
    },
  });

  let checkin: ParticipantCheckin;
  if (existing) {
    // Update existing checkin
    checkin = await db.participantCheckin.update({
      where: { id: existing.id },
      data: {
        phone: parsed.data.phone,
        profession: parsed.data.profession,
        photoConsent: parsed.data.photoConsent,
        updatedAt: new Date(),
      },
    });

    // Update answers
    if (parsed.data.answers && parsed.data.answers.length > 0) {
      await Promise.all(
        parsed.data.answers.map(async (answer) => {
          await db.participantAnswer.upsert({
            where: {
              participantCheckinId_customQuestionId: {
                participantCheckinId: checkin.id,
                customQuestionId: answer.customQuestionId,
              },
            },
            create: {
              participantCheckinId: checkin.id,
              customQuestionId: answer.customQuestionId,
              value: answer.value,
            },
            update: {
              value: answer.value,
            },
          });
        })
      );
    }
  } else {
    // Create new checkin
    checkin = await db.participantCheckin.create({
      data: {
        eventId: parsed.data.eventId,
        invitedParticipantId: parsed.data.invitedParticipantId || null,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        profession: parsed.data.profession,
        photoConsent: parsed.data.photoConsent,
        isInvited: !!parsed.data.invitedParticipantId,
      },
    });

    // Create answers
    if (parsed.data.answers && parsed.data.answers.length > 0) {
      await Promise.all(
        parsed.data.answers.map(async (answer) => {
          await db.participantAnswer.create({
            data: {
              participantCheckinId: checkin.id,
              customQuestionId: answer.customQuestionId,
              value: answer.value,
            },
          });
        })
      );
    }
  }

  return { data: checkin };
}

export async function updateCheckinParticipant(formData: FormData) {
  const raw = {
    id: formData.get("id") as string,
    name: formData.get("name") as string | null,
    email: formData.get("email") as string | null,
    phone: formData.get("phone") as string | null,
    profession: formData.get("profession") as string | null,
    photoConsent: formData.get("photoConsent") === "true" ? true : formData.get("photoConsent") === "false" ? false : undefined,
  };

  const parsed = updateCheckinParticipantSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const checkin = await db.participantCheckin.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      profession: parsed.data.profession,
      photoConsent: parsed.data.photoConsent,
    },
  });

  revalidatePath(`/admin/events/${checkin.eventId}`);
  return { data: checkin };
}

export async function toggleCheckinLink(eventId: string, isActive: boolean) {
  const checkinLink = await db.checkinLink.findUnique({
    where: { eventId },
  });
  if (!checkinLink) return { error: "Checkin link not found" };

  const updated = await db.checkinLink.update({
    where: { eventId },
    data: { isActive },
  });

  revalidatePath(`/admin/events/${eventId}`);
  return { data: updated };
}

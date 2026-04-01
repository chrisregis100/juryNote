import type { CustomQuestion, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  checkinListInclude,
  type ParticipantCheckinDashboardQuery,
  type ParticipantCheckinDashboardRow,
} from "@/lib/participant-checkin-dashboard";

export type { ParticipantCheckinDashboardQuery, ParticipantCheckinDashboardRow };

export function buildParticipantCheckinWhere(
  eventId: string,
  query: ParticipantCheckinDashboardQuery
): Prisma.ParticipantCheckinWhereInput {
  const parts: Prisma.ParticipantCheckinWhereInput[] = [{ eventId }];

  if (query.q) {
    const q = query.q;
    parts.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (query.invited === "invited") parts.push({ isInvited: true });
  if (query.invited === "not-invited") parts.push({ isInvited: false });

  if (query.photo === "yes") parts.push({ photoConsent: true });
  if (query.photo === "no") parts.push({ photoConsent: false });

  return parts.length === 1 ? parts[0]! : { AND: parts };
}

export interface ParticipantCheckinsDashboardData {
  eventExists: boolean;
  customQuestions: CustomQuestion[];
  checkins: ParticipantCheckinDashboardRow[];
  totalFiltered: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: {
    total: number;
    invited: number;
    notInvited: number;
    withPhotoConsent: number;
  };
}

export async function getParticipantCheckinsDashboardData(
  eventId: string,
  query: ParticipantCheckinDashboardQuery
): Promise<ParticipantCheckinsDashboardData> {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      customQuestions: { orderBy: { order: "asc" } },
    },
  });

  if (!event) {
    return {
      eventExists: false,
      customQuestions: [],
      checkins: [],
      totalFiltered: 0,
      totalPages: 1,
      page: 1,
      pageSize: query.pageSize,
      stats: { total: 0, invited: 0, notInvited: 0, withPhotoConsent: 0 },
    };
  }

  const where = buildParticipantCheckinWhere(eventId, query);

  const [total, invitedCount, withPhotoConsent, totalFiltered] = await Promise.all([
    db.participantCheckin.count({ where: { eventId } }),
    db.participantCheckin.count({ where: { eventId, isInvited: true } }),
    db.participantCheckin.count({ where: { eventId, photoConsent: true } }),
    db.participantCheckin.count({ where }),
  ]);

  const totalPages =
    totalFiltered === 0 ? 1 : Math.ceil(totalFiltered / query.pageSize);

  const clampPage = (p: number, min: number, max: number) =>
    Math.min(Math.max(p, min), max);
  const effectivePage =
    totalFiltered === 0 ? 1 : clampPage(query.page, 1, totalPages);

  const skip = (effectivePage - 1) * query.pageSize;

  const checkins = await db.participantCheckin.findMany({
    where,
    include: checkinListInclude,
    orderBy: { checkedInAt: "desc" },
    skip,
    take: query.pageSize,
  });

  return {
    eventExists: true,
    customQuestions: event.customQuestions,
    checkins,
    totalFiltered,
    totalPages,
    page: effectivePage,
    pageSize: query.pageSize,
    stats: {
      total,
      invited: invitedCount,
      notInvited: total - invitedCount,
      withPhotoConsent,
    },
  };
}

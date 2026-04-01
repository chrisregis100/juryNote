import type { Prisma } from "@prisma/client";

export const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export interface ParticipantCheckinDashboardQuery {
  page: number;
  pageSize: number;
  q: string;
  invited: "all" | "invited" | "not-invited";
  photo: "all" | "yes" | "no";
}

function clampInt(n: number, min: number, max: number): number {
  if (Number.isNaN(n) || n < min) return min;
  if (n > max) return max;
  return n;
}

function firstParam(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Parse dashboard URL search params (Next.js App Router). */
export function parseParticipantCheckinDashboardQuery(
  raw: Record<string, string | string[] | undefined>
): ParticipantCheckinDashboardQuery {
  const pageParsed = parseInt(firstParam(raw.page) ?? "1", 10);
  const page = clampInt(Number.isNaN(pageParsed) ? 1 : pageParsed, 1, 1_000_000);

  const pageSizeParsed = parseInt(
    firstParam(raw.pageSize) ?? String(DEFAULT_PAGE_SIZE),
    10
  );
  const pageSize = clampInt(
    Number.isNaN(pageSizeParsed) ? DEFAULT_PAGE_SIZE : pageSizeParsed,
    1,
    MAX_PAGE_SIZE
  );

  const q = (firstParam(raw.q) ?? "").trim().slice(0, 200);

  const invitedRaw = firstParam(raw.invited);
  const invited: ParticipantCheckinDashboardQuery["invited"] =
    invitedRaw === "invited" || invitedRaw === "not-invited" ? invitedRaw : "all";

  const photoRaw = firstParam(raw.photo);
  const photo: ParticipantCheckinDashboardQuery["photo"] =
    photoRaw === "yes" || photoRaw === "no" ? photoRaw : "all";

  return { page, pageSize, q, invited, photo };
}

export function buildDashboardQueryString(q: ParticipantCheckinDashboardQuery): string {
  const p = new URLSearchParams();
  if (q.page > 1) p.set("page", String(q.page));
  if (q.pageSize !== DEFAULT_PAGE_SIZE) p.set("pageSize", String(q.pageSize));
  if (q.q) p.set("q", q.q);
  if (q.invited !== "all") p.set("invited", q.invited);
  if (q.photo !== "all") p.set("photo", q.photo);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const checkinListInclude = {
  answers: {
    include: {
      customQuestion: true,
    },
  },
} satisfies Prisma.ParticipantCheckinInclude;

export type ParticipantCheckinDashboardRow = Prisma.ParticipantCheckinGetPayload<{
  include: typeof checkinListInclude;
}>;

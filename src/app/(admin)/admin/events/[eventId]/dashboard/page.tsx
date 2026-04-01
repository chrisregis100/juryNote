import { notFound } from "next/navigation";
import { ParticipantsDashboard } from "@/components/admin/events/participants-dashboard";
import { parseParticipantCheckinDashboardQuery } from "@/lib/participant-checkin-dashboard";
import { getParticipantCheckinsDashboardData } from "@/server/queries/participant-checkins-dashboard";

export default async function EventDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { eventId } = await params;
  const sp = await searchParams;
  const query = parseParticipantCheckinDashboardQuery(sp);
  const data = await getParticipantCheckinsDashboardData(eventId, query);

  if (!data.eventExists) notFound();

  const effectiveQuery = { ...query, page: data.page, pageSize: data.pageSize };

  return (
    <ParticipantsDashboard
      eventId={eventId}
      checkins={data.checkins}
      customQuestions={data.customQuestions}
      totalFiltered={data.totalFiltered}
      totalPages={data.totalPages}
      page={data.page}
      pageSize={data.pageSize}
      query={effectiveQuery}
      stats={data.stats}
    />
  );
}

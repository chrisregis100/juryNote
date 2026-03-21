import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EventConfig } from "@/components/admin/events/event-config";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      teams: true,
      criteria: true,
      juryAssignments: true,
      deliberations: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!event) notFound();

  const isLocked = event.deliberations[0]?.status === "locked";

  return (
    <EventConfig
      eventId={eventId}
      eventSlug={event.slug}
      teams={event.teams}
      criteria={event.criteria}
      juryAssignments={event.juryAssignments}
      isLocked={isLocked}
    />
  );
}

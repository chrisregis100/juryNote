import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ParticipantsDashboard } from "@/components/admin/events/participants-dashboard";

export default async function EventDashboardPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      customQuestions: { orderBy: { order: "asc" } },
      participantCheckins: {
        include: {
          answers: {
            include: {
              customQuestion: true,
            },
          },
        },
        orderBy: { checkedInAt: "desc" },
      },
    },
  });

  if (!event) notFound();

  return (
    <ParticipantsDashboard
      eventId={eventId}
      checkins={event.participantCheckins}
      customQuestions={event.customQuestions}
    />
  );
}

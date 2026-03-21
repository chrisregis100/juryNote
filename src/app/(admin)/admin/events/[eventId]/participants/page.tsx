import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ParticipantsSection } from "@/components/admin/events/participants-section";
import { CustomQuestionsSection } from "@/components/admin/events/custom-questions-section";

export default async function EventParticipantsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      invitedParticipants: { orderBy: { name: "asc" } },
      customQuestions: { orderBy: { order: "asc" } },
    },
  });

  if (!event) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ParticipantsSection
        eventId={eventId}
        invitedParticipants={event.invitedParticipants}
      />
      <CustomQuestionsSection
        eventId={eventId}
        customQuestions={event.customQuestions}
      />
    </div>
  );
}

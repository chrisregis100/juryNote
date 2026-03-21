import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckinLinkSection } from "@/components/admin/events/checkin-link-section";

export default async function EventCheckinPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      checkinLinks: true,
      participantCheckins: true,
    },
  });

  if (!event) notFound();

  const checkinLink = event.checkinLinks[0] || null;
  const checkedInCount = event.participantCheckins.length;

  return (
    <div className="max-w-2xl">
      <CheckinLinkSection
        eventId={eventId}
        eventSlug={event.slug}
        checkinLink={checkinLink}
        checkedInCount={checkedInCount}
      />
    </div>
  );
}

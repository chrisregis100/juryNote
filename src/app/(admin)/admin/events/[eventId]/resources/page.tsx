import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ResourcesSection } from "@/components/admin/events/resources-section";

export default async function EventResourcesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) notFound();

  return (
    <div className="max-w-3xl">
      <ResourcesSection eventId={event.id} />
    </div>
  );
}

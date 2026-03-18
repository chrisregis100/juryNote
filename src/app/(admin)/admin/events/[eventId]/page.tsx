import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventConfig } from "./event-config";

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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">← Événements</Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{event.name}</h1>
          <p className="text-slate-600">{event.slug}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/supervisor/events/${eventId}`}>Voir la délibération</Link>
        </Button>
      </div>

      <EventConfig
        eventId={eventId}
        eventSlug={event.slug}
        teams={event.teams}
        criteria={event.criteria}
        juryAssignments={event.juryAssignments}
        isLocked={isLocked}
      />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EventTabs } from "@/components/admin/events/event-tabs";

interface EventLayoutProps {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}

export default async function EventLayout({ children, params }: EventLayoutProps) {
  const { eventId } = await params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: {
          teams: true,
          criteria: true,
          juryAssignments: true,
          invitedParticipants: true,
          participantCheckins: true,
        },
      },
    },
  });

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-black"
        >
          <Link href="/admin">← Retour aux événements</Link>
        </Button>
      </div>

      {/* Event Title Card */}
      <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-black">
              {event.name}
            </h1>
            <p className="mt-1 font-mono text-sm text-slate-500">{event.slug}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-2 border-black font-medium"
          >
            <Link href={`/supervisor/events/${eventId}`}>
              Voir la délibération →
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            {event._count.teams} équipes
          </span>
          <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            {event._count.criteria} critères
          </span>
          <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            {event._count.juryAssignments} jurys
          </span>
          <span className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            {event._count.invitedParticipants} invités
          </span>
          <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {event._count.participantCheckins} check-ins
          </span>
        </div>
      </div>

      {/* Tabs */}
      <EventTabs eventId={eventId} />

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}

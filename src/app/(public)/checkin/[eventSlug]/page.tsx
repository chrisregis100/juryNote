import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCheckinLinkByEventSlug } from "@/server/actions/checkin";
import { CheckinForm } from "./checkin-form";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const checkinLink = await getCheckinLinkByEventSlug(eventSlug);

  if (!checkinLink) {
    notFound();
  }

  const event = await db.event.findUnique({
    where: { id: checkinLink.eventId },
    include: {
      customQuestions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{event.name}</h1>
        <p className="mt-2 text-slate-600">Enregistrement de présence</p>
      </div>
      <CheckinForm eventId={checkinLink.eventId} eventName={event.name} customQuestions={event.customQuestions} />
    </div>
  );
}

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
    <main className="dot-pattern-light relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-12">
      {/* Decorative shapes — mirroring the landing hero */}
      <div
        className="absolute right-12 top-16 h-20 w-20 rounded-full bg-yellow-400 opacity-60 md:right-24 md:top-20 md:h-28 md:w-28"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-8 h-16 w-16 rotate-12 bg-rose-500 opacity-40 md:left-16 md:h-20 md:w-20"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-40 right-1/4 h-10 w-10 -rotate-6 border-4 border-yellow-400 opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/4 top-24 h-12 w-12 rounded-md bg-indigo-600 opacity-20 rotate-6"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="mb-4 inline-block rounded-md border-2 border-black bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_0_#0a0a0a]">
            Enregistrement
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-black md:text-4xl">
            <span className="inline-block -rotate-1 bg-yellow-400 px-3 py-1">
              {event.name}
            </span>
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Confirmez votre présence en quelques instants.
          </p>
        </div>

        <CheckinForm
          eventId={checkinLink.eventId}
          eventName={event.name}
          customQuestions={event.customQuestions}
        />

        <p className="mt-6 text-center text-xs text-slate-400">
          Propulsé par{" "}
          <span className="font-bold text-black">JuryNote</span>
        </p>
      </div>
    </main>
  );
}

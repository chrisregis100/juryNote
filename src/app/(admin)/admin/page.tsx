import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const events = await db.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { teams: true, criteria: true, juryAssignments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Mes événements
          </h1>
          <p className="mt-1 text-slate-600">
            Gérez vos hackathons et concours
          </p>
        </div>
        <Button
          asChild
          className="h-11 border-2 border-black bg-indigo-600 px-6 font-bold text-white shadow-[3px_3px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[5px_5px_0_0_#000]"
        >
          <Link href="/admin/events/new">+ Nouvel événement</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border-2 border-black bg-white p-12 text-center shadow-[6px_6px_0_0_#000]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-slate-600">Aucun événement pour le moment.</p>
          <Button
            asChild
            className="mt-4 h-11 border-2 border-black bg-black px-6 font-bold text-white shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#4f46e5]"
          >
            <Link href="/admin/events/new">Créer votre premier événement</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/admin/events/${event.id}`}
                className="group block rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#4f46e5]"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-black group-hover:text-indigo-600">
                    {event.name}
                  </h2>
                  <svg className="h-5 w-5 text-slate-400 transition-colors group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="mt-1 text-sm font-mono text-slate-500">{event.slug}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                    {event._count.teams} équipes
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                    {event._count.criteria} critères
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                    {event._count.juryAssignments} jurys
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

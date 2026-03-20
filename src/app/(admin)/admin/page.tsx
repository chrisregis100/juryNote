import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const events = await db.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { teams: true, criteria: true, juryAssignments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Événements</h1>
        <Button asChild>
          <Link href="/admin/events/new">Nouvel événement</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-slate-600">Aucun événement.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/events/new">Créer un événement</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="hover:underline"
                    >
                      {event.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-slate-600">{event.slug}</p>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">
                  <span>{event._count.teams} équipes</span>
                  <span className="mx-2">·</span>
                  <span>{event._count.criteria} critères</span>
                  <span className="mx-2">·</span>
                  <span>{event._count.juryAssignments} jurys</span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

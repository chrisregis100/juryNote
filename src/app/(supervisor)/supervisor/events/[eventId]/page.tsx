import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { getRanking, closeDeliberation } from "@/server/actions/deliberation";
import { DeliberationView } from "./deliberation-view";
import { Button } from "@/components/ui/button";

export default async function SupervisorEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user) notFound();

  const { eventId } = await params;
  const result = await getRanking(eventId);
  if (result.error || !result.data) notFound();

  const { ranking, isLocked } = result.data;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">← Admin</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Délibération</h1>
      <DeliberationView
        ranking={ranking}
        isLocked={isLocked}
        eventId={eventId}
      />
    </div>
  );
}

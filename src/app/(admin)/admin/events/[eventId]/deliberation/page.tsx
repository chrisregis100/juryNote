import { notFound } from "next/navigation";
import { getRanking } from "@/server/actions/deliberation";
import { DeliberationPanel } from "@/components/deliberation/deliberation-panel";

export default async function AdminEventDeliberationPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const result = await getRanking(eventId);
  if (result.error || !result.data) notFound();

  const { ranking, isLocked } = result.data;

  return <DeliberationPanel ranking={ranking} isLocked={isLocked} eventId={eventId} />;
}

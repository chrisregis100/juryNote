import { redirect } from "next/navigation";

export default async function SupervisorEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  redirect(`/admin/events/${eventId}/deliberation`);
}

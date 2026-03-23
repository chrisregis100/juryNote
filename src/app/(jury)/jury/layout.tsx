import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { JuryDashboardNavbar } from "@/components/jury/jury-dashboard-navbar";
import { JuryDashboardSidebar } from "@/components/jury/jury-dashboard-sidebar";

const getCachedEventName = unstable_cache(
  async (eventId: string) => {
    return db.event.findUnique({
      where: { id: eventId },
      select: { name: true },
    });
  },
  ["jury-layout-event"],
  { revalidate: 60, tags: ["event"] }
);

export default async function JuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) {
    redirect("/jury/join");
  }

  const event = await getCachedEventName(session.user.eventId);

  const eventName = event?.name ?? "Événement";
  const displayName = session.user.displayName ?? "Jury";
  const isPresident = session.user.isPresident;

  return (
    <div className="min-h-screen bg-slate-50">
      <JuryDashboardNavbar displayName={displayName} eventName={eventName} />
      <div className="flex">
        <JuryDashboardSidebar eventName={eventName} isPresident={isPresident} />
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

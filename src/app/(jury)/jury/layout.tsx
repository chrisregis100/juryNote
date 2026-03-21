import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { JuryDashboardNavbar } from "@/components/jury/jury-dashboard-navbar";
import { JuryDashboardSidebar } from "@/components/jury/jury-dashboard-sidebar";

export default async function JuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) {
    redirect("/jury/join");
  }

  const event = await db.event.findUnique({
    where: { id: session.user.eventId },
    select: { name: true },
  });

  const eventName = event?.name ?? "Événement";
  const displayName = session.user.displayName ?? "Jury";

  return (
    <div className="min-h-screen bg-slate-50">
      <JuryDashboardNavbar displayName={displayName} eventName={eventName} />
      <div className="flex">
        <JuryDashboardSidebar eventName={eventName} />
        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

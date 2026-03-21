import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/admin/dashboard-navbar";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");
  if ("eventId" in session.user) redirect("/jury");

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar user={session.user} />
      <div className="flex">
        <DashboardSidebar />
        <main id="main" className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

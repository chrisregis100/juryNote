import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");
  if ("eventId" in session.user) redirect("/jury");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin" className="font-semibold text-slate-900">
            JuryFlow Admin
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {session.user.email ?? session.user.name ?? "Organisateur"}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main id="main" className="flex-1 p-4">{children}</main>
    </div>
  );
}

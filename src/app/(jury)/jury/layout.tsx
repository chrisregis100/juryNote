import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function JuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) {
    redirect("/jury/join");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/jury" className="font-semibold text-slate-900">
            JuryFlow – Notation
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              {session.user.displayName ?? "Jury"}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");
  if ("eventId" in session.user) redirect("/jury");

  return <main id="main">{children}</main>;
}

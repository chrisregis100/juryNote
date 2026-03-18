import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session?.user && !("eventId" in session.user)) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Connexion organisateur
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}

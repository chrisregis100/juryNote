import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session?.user && !("eventId" in session.user)) {
    redirect("/admin");
  }

  return (
    <div className="space-y-8">
      {/* Card */}
      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#0a0a0a] sm:p-10">
        <div className="mb-8">
          <div className="mb-2 inline-block rounded-lg bg-indigo-100 px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Organisateur
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Accédez à votre espace d&apos;organisation et de gestion.
          </p>
        </div>

        <LoginForm />
      </div>

      {/* Links */}
      <div className="space-y-3 text-center">
        <p className="text-sm text-slate-600">
          Vous n&apos;avez pas de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-800 hover:underline"
          >
            Créer un compte
          </Link>
        </p>
        <p className="text-sm text-slate-600">
          Vous êtes membre du jury ?{" "}
          <Link
            href="/jury/join"
            className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-800 hover:underline"
          >
            Accéder à la notation
          </Link>
        </p>
      </div>
    </div>
  );
}

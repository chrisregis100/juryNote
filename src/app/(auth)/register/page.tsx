import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
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
              Nouveau compte
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Inscription
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Créez votre espace organisateur et commencez à gérer vos jurys.
          </p>
        </div>

        <RegisterForm />
      </div>

      {/* Login link */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-800 hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

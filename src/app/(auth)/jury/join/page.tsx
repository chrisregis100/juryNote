import Link from "next/link";
import { JuryJoinForm } from "./jury-join-form";

export default function JuryJoinPage() {
  return (
    <div className="space-y-8">
      {/* Card */}
      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#0a0a0a] sm:p-10">
        <div className="mb-8">
          <div className="mb-2 inline-block rounded-lg bg-yellow-100 px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-800">
              Jury
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Accès jury
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Entrez le slug de l&apos;événement et votre code PIN pour accéder à
            la notation.
          </p>
        </div>

        <JuryJoinForm />
      </div>

      {/* Organizer login link */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          Vous êtes organisateur ?{" "}
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

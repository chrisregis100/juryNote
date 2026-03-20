import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-[6px_6px_0_0_#0a0a0a] sm:p-10">
        <div className="mb-8">
          <div className="mb-2 inline-block rounded-lg bg-indigo-100 px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Vérification
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Vérification de votre lien de connexion&hellip;
          </p>
        </div>

        <Suspense fallback={<VerifyEmailSkeleton />}>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  );
}

function VerifyEmailSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50">
        <svg
          className="h-6 w-6 animate-spin text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
      <p className="text-sm text-slate-500">Vérification en cours&hellip;</p>
    </div>
  );
}

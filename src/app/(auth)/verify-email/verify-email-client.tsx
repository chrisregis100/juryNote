"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

type VerifyStatus = "loading" | "error";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>(() =>
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(() =>
    token ? null : "Lien de connexion invalide ou manquant."
  );

  useEffect(() => {
    if (!token) return;

    async function verifyToken() {
      // Omit callbackURL so the API returns JSON + Set-Cookie instead of a 302.
      // A full navigation then ensures the session cookie is visible to the server (proxy / RSC).
      const { error } = await authClient.magicLink.verify({
        query: { token: token! },
      });

      if (error) {
        setStatus("error");
        setErrorMessage(
          error.message ?? "Lien invalide ou expiré. Veuillez en demander un nouveau."
        );
        return;
      }

      window.location.assign("/admin");
    }

    verifyToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-6 text-center"
        role="status"
        aria-live="polite"
        aria-label="Vérification du lien de connexion en cours"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-50">
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
        <p className="text-base font-semibold text-slate-700">
          Vérification en cours&hellip;
        </p>
        <p className="text-sm text-slate-400">
          Vous allez être redirigé automatiquement.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center gap-4 py-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 bg-red-50">
        <svg
          className="h-7 w-7 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-lg font-bold text-slate-900">Lien invalide</p>
      <p className="max-w-xs text-sm text-slate-500">{errorMessage}</p>
      <Link
        href="/login"
        className="mt-2 inline-flex h-10 items-center justify-center rounded-lg border-2 border-black bg-black px-5 text-sm font-bold text-white shadow-[3px_3px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#4f46e5]"
        tabIndex={0}
        aria-label="Retour à la page de connexion"
      >
        Demander un nouveau lien
      </Link>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormStatus = "idle" | "loading" | "sent" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    const { error: signInError } = await authClient.signIn.magicLink({
      email,
      callbackURL: "/admin",
    });

    if (signInError) {
      setError(
        signInError.message ?? "Une erreur est survenue. Veuillez réessayer."
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 py-6 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-500 bg-indigo-50">
          <svg
            className="h-7 w-7 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-900">Email envoyé !</p>
        <p className="max-w-xs text-sm text-slate-500">
          Consultez votre boîte de réception à{" "}
          <span className="font-semibold text-slate-700">{email}</span> et
          cliquez sur le lien de connexion.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
          className="mt-2 text-sm font-medium text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-800 hover:underline"
        >
          Utiliser une autre adresse
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-label="Formulaire de connexion par lien magique"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Adresse email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={status === "loading"}
          className="h-12 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 text-base transition-colors focus:border-indigo-500 focus:bg-white focus-visible:ring-indigo-500"
          aria-label="Adresse email de l'organisateur"
        />
      </div>

      <AnimatePresence>
        {status === "error" && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
            role="alert"
            aria-live="assertive"
          >
            <svg
              className="h-4 w-4 shrink-0 text-red-500"
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
            <p className="text-sm font-medium text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-lg border-2 border-black bg-black text-base font-bold text-white shadow-[4px_4px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-black hover:shadow-[6px_6px_0_0_#4f46e5] disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_0_#4f46e5]"
        aria-label="Envoyer le lien de connexion"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
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
            Envoi en cours&hellip;
          </span>
        ) : (
          "Envoyer le lien de connexion"
        )}
      </Button>

      <p className="text-center text-xs text-slate-400">
        Vous recevrez un lien valable 10&nbsp;minutes pour vous connecter sans
        mot de passe.
      </p>
    </motion.form>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitDemoRequest } from "@/server/actions/demo";

export function DemoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitDemoRequest(formData);

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error ?? "Une erreur est survenue.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Demande envoyée !</h3>
        <p className="mt-2 text-slate-400">
          Nous vous recontactons sous 24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Nom complet
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          aria-label="Nom complet"
          placeholder="Jean Dupont"
          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-yellow-400 focus-visible:ring-yellow-400/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Email professionnel
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          aria-label="Email professionnel"
          placeholder="jean@organisation.fr"
          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-yellow-400 focus-visible:ring-yellow-400/20"
        />
      </div>

      <div>
        <label
          htmlFor="organisation"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Établissement / Organisation
        </label>
        <Input
          id="organisation"
          name="organisation"
          type="text"
          required
          aria-label="Établissement ou Organisation"
          placeholder="Université de Paris"
          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-yellow-400 focus-visible:ring-yellow-400/20"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          Message / contexte (optionnel)
        </label>
        <Textarea
          id="message"
          name="message"
          aria-label="Message ou contexte"
          placeholder="Décrivez votre besoin ou votre contexte..."
          rows={4}
          className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-yellow-400 focus-visible:ring-yellow-400/20 resize-none"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full border-2 border-yellow-400 bg-yellow-400 px-10 font-black text-black shadow-[4px_4px_0_0_#fff] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#fff] hover:bg-yellow-400 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#fff]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Demander une démo"
          )}
        </Button>
        {error && (
          <p className="mt-3 text-center text-sm text-red-400">{error}</p>
        )}
      </div>
    </form>
  );
}

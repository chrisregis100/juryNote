"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JuryJoinForm() {
  const [eventSlug, setEventSlug] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pinCode = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 6) return;

    setError(null);
    setIsLoading(true);
    try {
      const res = await signIn("jury-pin", {
        eventSlug: eventSlug.trim(),
        pinCode,
        redirect: false,
      });
      if (res?.error) {
        setError("Code invalide ou expiré. Vérifiez le slug et le PIN.");
        return;
      }
      router.push("/jury");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="space-y-2">
        <Label
          htmlFor="eventSlug"
          className="text-sm font-semibold text-slate-700"
        >
          Slug de l&apos;événement
        </Label>
        <Input
          id="eventSlug"
          type="text"
          placeholder="mon-hackathon"
          value={eventSlug}
          onChange={(e) => setEventSlug(e.target.value)}
          required
          disabled={isLoading}
          className="h-12 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 text-base transition-colors focus:border-indigo-500 focus:bg-white focus-visible:ring-indigo-500"
          aria-label="Slug de l'événement"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-700">
          Code PIN (6 chiffres)
        </legend>
        <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(i, e)}
              disabled={isLoading}
              required
              className="h-14 w-full rounded-lg border-2 border-slate-200 bg-slate-50 text-center text-xl font-bold text-black transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:h-16 sm:text-2xl"
              aria-label={`Chiffre ${i + 1} du code PIN`}
            />
          ))}
        </div>
      </fieldset>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
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

      <Button
        type="submit"
        disabled={isLoading || pinCode.length !== 6}
        className="h-12 w-full rounded-lg border-2 border-black bg-black text-base font-bold text-white shadow-[4px_4px_0_0_#facc15] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-black hover:shadow-[6px_6px_0_0_#facc15] disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_0_#facc15]"
      >
        {isLoading ? (
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
            Connexion&hellip;
          </span>
        ) : (
          "Accéder à la notation"
        )}
      </Button>
    </motion.form>
  );
}

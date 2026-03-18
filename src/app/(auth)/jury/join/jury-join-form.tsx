"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JuryJoinForm() {
  const [eventSlug, setEventSlug] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await signIn("jury-pin", {
        eventSlug: eventSlug.trim(),
        pinCode: pinCode.replace(/\D/g, "").slice(0, 6),
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

  const handlePinChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 6);
    setPinCode(digits);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="eventSlug">Slug de l’événement</Label>
        <Input
          id="eventSlug"
          type="text"
          placeholder="mon-hackathon"
          value={eventSlug}
          onChange={(e) => setEventSlug(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pinCode">Code PIN (6 chiffres)</Label>
        <Input
          id="pinCode"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          placeholder="123456"
          value={pinCode}
          onChange={(e) => handlePinChange(e.target.value)}
          required
          disabled={isLoading}
          aria-label="Code PIN à 6 chiffres"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion…" : "Accéder à la notation"}
      </Button>
    </form>
  );
}

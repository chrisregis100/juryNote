"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/server/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateEventForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    const result = await createEvent(formData);
    setIsLoading(false);
    if (result.error) {
      setError(
        Object.values(result.error).flat().join(" ") || "Erreur de validation"
      );
      return;
    }
    if (result.data) router.push(`/admin/events/${result.data.id}`);
  };

  const slugFromName = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(slugFromName(e.target.value));
          }}
          placeholder="Hackathon 2025"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="hackathon-2025"
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Création…" : "Créer l’événement"}
      </Button>
    </form>
  );
}

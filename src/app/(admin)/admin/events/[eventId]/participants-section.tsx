"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { InvitedParticipant } from "@prisma/client";
import { createInvitedParticipant, deleteInvitedParticipant, bulkImportInvitedParticipants } from "@/server/actions/participant";
import { parseParticipantFile } from "@/lib/utils/file-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantsSectionProps {
  eventId: string;
  invitedParticipants: InvitedParticipant[];
}

export function ParticipantsSection({ eventId, invitedParticipants }: ParticipantsSectionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const result = await parseParticipantFile(file);
      if (!result.success) {
        setUploadError(result.errors.join(", "));
        setIsUploading(false);
        return;
      }

      const importResult = await bulkImportInvitedParticipants(eventId, result.participants);
      if (importResult.error) {
        setUploadError("Erreur lors de l'import: " + Object.values(importResult.error).flat().join(", "));
      } else {
        setUploadSuccess(
          `Import réussi: ${importResult.data?.imported} participant(s) importé(s)${importResult.data?.failed ? `, ${importResult.data.failed} échec(s)` : ""}`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        router.refresh();
      }
    } catch (error) {
      setUploadError(`Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("name", name.trim());
    formData.set("email", email.trim() || "");
    formData.set("phone", phone.trim() || "");
    formData.set("profession", profession.trim() || "");

    await createInvitedParticipant(formData);
    setName("");
    setEmail("");
    setPhone("");
    setProfession("");
    router.refresh();
  };

  const handleDeleteParticipant = async (participantId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
      await deleteInvitedParticipant(participantId);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Participants invités ({invitedParticipants.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Importer depuis un fichier (CSV ou Excel)</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
          </div>
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          {uploadSuccess && <p className="text-sm text-green-600">{uploadSuccess}</p>}
          <p className="text-xs text-slate-500">
            Le fichier doit contenir une colonne "nom" (requis). Colonnes optionnelles: "email", "phone", "profession".
          </p>
        </div>

        <div className="border-t pt-4">
          <Label className="mb-2 block">Ajouter un participant manuellement</Label>
          <form onSubmit={handleAddParticipant} className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <Label className="text-xs">Nom *</Label>
                <Input
                  placeholder="Nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Profession</Label>
                <Input
                  placeholder="Développeur, Designer, etc."
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" size="sm">
              Ajouter
            </Button>
          </form>
        </div>

        {invitedParticipants.length > 0 && (
          <div className="border-t pt-4">
            <Label className="mb-2 block">Liste des invités</Label>
            <ul className="space-y-1 text-sm">
              {invitedParticipants.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1">
                  <div className="flex-1">
                    <span className="font-medium">{p.name}</span>
                    {p.email && <span className="ml-2 text-slate-600">({p.email})</span>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteParticipant(p.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Supprimer
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

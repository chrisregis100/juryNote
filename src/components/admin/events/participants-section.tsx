"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { InvitedParticipant } from "@prisma/client";
import { createInvitedParticipant, deleteInvitedParticipant, bulkImportInvitedParticipants } from "@/server/actions/participant";
import { parseParticipantFile, parseWithMapping, type ParseResult } from "@/lib/utils/file-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnMappingModal } from "@/components/participants/column-mapping-modal";
import { DataPreview } from "@/components/participants/data-preview";

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

  // États pour le nouveau flux de mapping
  const [mappingModalOpen, setMappingModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<ParseResult | null>(null);
  /** Remonte le modal de mapping pour réinitialiser l’état (ex. préremplissage) */
  const [mappingModalSession, setMappingModalSession] = useState(0);
  /** D’où vient l’ouverture du mapping : annulation différente si retour prévisualisation */
  const [mappingOrigin, setMappingOrigin] = useState<"upload" | "preview" | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setCurrentFile(file);
    setParsedData(null);
    setMappingOrigin(null);

    try {
      const result = await parseParticipantFile(file);

      // Si mapping manuel requis
      if (result.requiresManualMapping && result.detectedColumns) {
        setMappingOrigin("upload");
        setMappingModalSession((s) => s + 1);
        setCsvColumns(result.detectedColumns);
        setMappingModalOpen(true);
        setIsUploading(false);
        return;
      }

      // Si succès direct, ouvrir la prévisualisation
      if (result.success || result.participants.length > 0) {
        setParsedData(result);
        if (result.detectedColumns?.length) {
          setCsvColumns(result.detectedColumns);
        }
        setPreviewModalOpen(true);
        setIsUploading(false);
        return;
      }

      // Si erreur sans mapping requis
      setUploadError(result.errors.join(", "));
      setIsUploading(false);
    } catch (error) {
      setUploadError(`Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
      setIsUploading(false);
    }
  };

  const handleMappingComplete = async (mapping: Record<string, string>) => {
    if (!currentFile) return;

    setMappingModalOpen(false);
    setMappingOrigin(null);
    setIsUploading(true);

    try {
      // Re-parser avec le mapping personnalisé
      const result = await parseWithMapping(currentFile, mapping);
      setParsedData(result);
      if (result.detectedColumns?.length) {
        setCsvColumns(result.detectedColumns);
      }
      setPreviewModalOpen(true);
    } catch (error) {
      setUploadError(`Erreur lors du parsing: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdjustMappingFromPreview = () => {
    if (!parsedData?.detectedColumns?.length || !currentFile) return;
    setMappingOrigin("preview");
    setMappingModalSession((s) => s + 1);
    setCsvColumns(parsedData.detectedColumns);
    setPreviewModalOpen(false);
    setMappingModalOpen(true);
  };

  const handlePreviewConfirm = async () => {
    if (!parsedData || parsedData.participants.length === 0) return;

    setPreviewModalOpen(false);
    setIsUploading(true);

    try {
      const importResult = await bulkImportInvitedParticipants(eventId, parsedData.participants);
      if (importResult.error) {
        setUploadError("Erreur lors de l'import: " + Object.values(importResult.error).flat().join(", "));
      } else {
        setUploadSuccess(
          `Import réussi: ${importResult.data?.imported} participant(s) importé(s)${importResult.data?.failed ? `, ${importResult.data.failed} échec(s)` : ""}`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Reset states
        setCurrentFile(null);
        setParsedData(null);
        setCsvColumns([]);
        setMappingOrigin(null);
        router.refresh();
      }
    } catch (error) {
      setUploadError(`Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelMapping = () => {
    setMappingModalOpen(false);
    if (mappingOrigin === "preview") {
      setMappingOrigin(null);
      setPreviewModalOpen(true);
      return;
    }
    setMappingOrigin(null);
    setCurrentFile(null);
    setCsvColumns([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelPreview = () => {
    setPreviewModalOpen(false);
    setCurrentFile(null);
    setParsedData(null);
    setCsvColumns([]);
    setMappingOrigin(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            {`Le fichier doit contenir une colonne "nom" (requis). Colonnes optionnelles: "email", "phone", "profession". Si les colonnes ne sont pas détectées automatiquement, un mapping manuel sera proposé. Après une détection automatique, vous pouvez aussi corriger le mapping depuis la prévisualisation.`}
          </p>
        </div>

        {/* Modals */}
        <ColumnMappingModal
          key={mappingModalSession}
          open={mappingModalOpen}
          csvColumns={csvColumns}
          initialMapping={parsedData?.columnMapping}
          onMappingComplete={handleMappingComplete}
          onCancel={handleCancelMapping}
        />

        {parsedData && (
          <DataPreview
            open={previewModalOpen}
            participants={parsedData.participants}
            errors={parsedData.errors}
            onConfirm={handlePreviewConfirm}
            onCancel={handleCancelPreview}
            onAdjustMapping={
              currentFile && parsedData.detectedColumns && parsedData.detectedColumns.length > 0
                ? handleAdjustMappingFromPreview
                : undefined
            }
          />
        )}

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

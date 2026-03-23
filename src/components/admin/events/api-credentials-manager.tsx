"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Upload, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getResourceCredentials,
  importApiCredentials,
  addApiCredential,
  deleteApiCredential,
} from "@/server/actions/resources";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Credential {
  id: string;
  participantHint: string | null;
  value: string;
  assignedToId: string | null;
  assignedAt: Date | null;
  assignedTo: { name: string } | null;
}

interface CsvPreviewRow {
  hint: string;
  value: string;
}

interface ApiCredentialsManagerProps {
  resourceId: string;
  resourceTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Column auto-detection ────────────────────────────────────────────────────

const HINT_COLUMNS = ["participant", "hint", "name", "nom", "email"];
const VALUE_COLUMNS = ["key", "api_key", "apikey", "value", "credential", "clé", "cle", "token"];

function detectColumn(headers: string[], candidates: string[]): string | null {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  for (const candidate of candidates) {
    const idx = normalized.findIndex((h) => h.includes(candidate));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ApiCredentialsManager({
  resourceId,
  resourceTitle,
  open,
  onOpenChange,
}: ApiCredentialsManagerProps) {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // CSV import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvPreview, setCsvPreview] = useState<CsvPreviewRow[]>([]);
  const [csvAllRows, setCsvAllRows] = useState<CsvPreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Manual add state
  const [manualHint, setManualHint] = useState("");
  const [manualValue, setManualValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    const result = await getResourceCredentials(resourceId);
    if (result.success && result.credentials) {
      setCredentials(result.credentials as Credential[]);
    } else {
      toast.error("Impossible de charger les clés");
    }
    setIsLoading(false);
  }, [resourceId]);

  useEffect(() => {
    if (open) fetchCredentials();
  }, [open, fetchCredentials]);

  const totalCount = credentials.length;
  const assignedCount = credentials.filter((c) => c.assignedToId !== null).length;
  const unassignedCount = totalCount - assignedCount;

  // ─── CSV ────────────────────────────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { default: Papa } = await import("papaparse");
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const hintCol = detectColumn(headers, HINT_COLUMNS);
        const valueCol = detectColumn(headers, VALUE_COLUMNS);

        if (!valueCol) {
          toast.error(
            "Colonne de clé non détectée. Nommez-la : key, api_key, value ou credential."
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        const rows: CsvPreviewRow[] = (results.data as Record<string, string>[])
          .map((row) => ({
            hint: hintCol ? (row[hintCol] ?? "") : "",
            value: row[valueCol] ?? "",
          }))
          .filter((r) => r.value.trim() !== "");

        if (rows.length === 0) {
          toast.error("Aucune clé trouvée dans le fichier.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        setCsvAllRows(rows);
        setCsvPreview(rows.slice(0, 3));
      },
      error: () => {
        toast.error("Impossible de lire le fichier CSV.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleImport = async () => {
    if (csvAllRows.length === 0) return;
    setIsImporting(true);
    const result = await importApiCredentials(resourceId, csvAllRows);
    if (result.success) {
      toast.success(`${result.count} clé(s) importée(s) avec succès`);
      setCsvAllRows([]);
      setCsvPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchCredentials();
    } else {
      toast.error(result.error ?? "Erreur lors de l'import");
    }
    setIsImporting(false);
  };

  const handleCancelImport = () => {
    setCsvAllRows([]);
    setCsvPreview([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Manual add ─────────────────────────────────────────────────────────────

  const handleAddManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualValue.trim()) return;
    setIsAdding(true);
    const result = await addApiCredential(resourceId, manualHint.trim(), manualValue.trim());
    if (result.success) {
      toast.success("Clé ajoutée");
      setManualHint("");
      setManualValue("");
      await fetchCredentials();
    } else {
      toast.error(result.error ?? "Impossible d'ajouter la clé");
    }
    setIsAdding(false);
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (credentialId: string) => {
    if (!confirm("Supprimer cette clé ?")) return;
    setDeletingId(credentialId);
    const result = await deleteApiCredential(credentialId);
    if (result.success) {
      toast.success("Clé supprimée");
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
    } else {
      toast.error(result.error ?? "Impossible de supprimer la clé");
    }
    setDeletingId(null);
  };

  const toggleVisibility = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-2 border-black shadow-[6px_6px_0_0_#000]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Gestion des clés API
            <span className="ml-2 font-normal text-slate-500">— {resourceTitle}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{assignedCount}</p>
            <p className="text-xs text-green-600">Assignées</p>
          </div>
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-3 text-center">
            <p className="text-2xl font-bold text-amber-700">{unassignedCount}</p>
            <p className="text-xs text-amber-600">Disponibles</p>
          </div>
        </div>

        {/* CSV Import */}
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Importer via CSV</p>
          <p className="mb-3 text-xs text-slate-500">
            Colonnes détectées automatiquement : participant/hint/name pour le participant, et
            key/api_key/value/credential pour la clé.
          </p>

          <div className="flex items-center gap-2">
            <label
              htmlFor="csv-upload"
              className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Choisir un fichier .csv
            </label>
            <input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>

          {csvPreview.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-slate-600">
                Aperçu ({csvAllRows.length} clé(s) détectée(s)) :
              </p>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-semibold text-slate-600">
                        Participant
                      </th>
                      <th className="px-3 py-1.5 text-left font-semibold text-slate-600">
                        Clé API
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.map((row, i) => (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="px-3 py-1.5 text-slate-700">{row.hint || "—"}</td>
                        <td className="px-3 py-1.5 font-mono text-slate-700">
                          {row.value.slice(0, 12)}•••
                        </td>
                      </tr>
                    ))}
                    {csvAllRows.length > 3 && (
                      <tr className="border-t border-slate-200">
                        <td colSpan={2} className="px-3 py-1.5 text-center text-slate-400">
                          + {csvAllRows.length - 3} autre(s)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={isImporting}
                  className="border-2 border-black bg-indigo-600 font-bold text-white shadow-[2px_2px_0_0_#000] hover:bg-indigo-700"
                >
                  {isImporting ? "Import..." : `Importer ${csvAllRows.length} clé(s)`}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelImport}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Manual add */}
        <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">Ajouter manuellement</p>
          <form onSubmit={handleAddManual} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="manual-hint" className="text-xs">
                  Participant (nom ou email)
                </Label>
                <Input
                  id="manual-hint"
                  placeholder="alice@example.com"
                  value={manualHint}
                  onChange={(e) => setManualHint(e.target.value)}
                  className="border-2 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="manual-value" className="text-xs">
                  Clé API <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="manual-value"
                  placeholder="sk-..."
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  required
                  className="border-2 border-slate-200"
                />
              </div>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isAdding}
              className="border-2 border-black bg-slate-800 font-bold text-white shadow-[2px_2px_0_0_#000] hover:bg-slate-900"
            >
              <Plus className="mr-1 h-4 w-4" />
              {isAdding ? "Ajout..." : "Ajouter"}
            </Button>
          </form>
        </div>

        {/* Credentials table */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Clés enregistrées ({totalCount})
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : credentials.length === 0 ? (
            <p className="rounded-lg bg-slate-50 py-6 text-center text-sm text-slate-400">
              Aucune clé enregistrée.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border-2 border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      Participant
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      Clé API
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                      Statut
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map((cred) => {
                    const isVisible = visibleIds.has(cred.id);
                    const isAssigned = cred.assignedToId !== null;
                    return (
                      <tr key={cred.id} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-700">
                          {cred.participantHint ?? <span className="text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-slate-700">
                              {isVisible ? cred.value : "•".repeat(Math.min(cred.value.length, 12))}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleVisibility(cred.id)}
                              aria-label={isVisible ? "Masquer la clé" : "Afficher la clé"}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              {isVisible ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {isAssigned ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              Assigné → {cred.assignedTo?.name ?? "Participant"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                              Non assigné
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isAssigned || deletingId === cred.id}
                            onClick={() => handleDelete(cred.id)}
                            aria-label="Supprimer la clé"
                            className="h-7 border-2 border-red-200 px-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

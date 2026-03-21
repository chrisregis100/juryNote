"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ParsedParticipant } from "@/lib/utils/file-parser";

interface DataPreviewProps {
  participants: ParsedParticipant[];
  errors: string[];
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
}

export function DataPreview({
  participants,
  errors,
  onConfirm,
  onCancel,
  open,
}: DataPreviewProps) {
  const validCount = participants.length;
  const errorCount = errors.length;
  const previewLimit = 10;
  const previewParticipants = participants.slice(0, previewLimit);
  const hasMore = participants.length > previewLimit;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévisualisation des données</DialogTitle>
          <DialogDescription>
            Vérifiez les données avant l'import. {validCount} participant(s) valide(s)
            {errorCount > 0 && `, ${errorCount} erreur(s)`}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Statistiques */}
          <div className="flex gap-4 text-sm">
            <div className="rounded bg-green-50 px-3 py-2 text-green-700">
              <span className="font-semibold">{validCount}</span> participant(s) valide(s)
            </div>
            {errorCount > 0 && (
              <div className="rounded bg-red-50 px-3 py-2 text-red-700">
                <span className="font-semibold">{errorCount}</span> erreur(s)
              </div>
            )}
          </div>

          {/* Erreurs */}
          {errorCount > 0 && (
            <div className="rounded border border-red-200 bg-red-50 p-4">
              <h4 className="mb-2 font-semibold text-red-900">Erreurs détectées :</h4>
              <ul className="max-h-40 space-y-1 overflow-y-auto text-sm text-red-700">
                {errors.slice(0, 20).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {errors.length > 20 && (
                  <li className="text-red-600">... et {errors.length - 20} autre(s) erreur(s)</li>
                )}
              </ul>
            </div>
          )}

          {/* Tableau de prévisualisation */}
          {validCount > 0 && (
            <div className="rounded border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-2 text-left font-semibold">
                        Nom
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 text-left font-semibold">
                        Email
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 text-left font-semibold">
                        Téléphone
                      </th>
                      <th className="border-b border-slate-200 px-4 py-2 text-left font-semibold">
                        Profession
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewParticipants.map((participant, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-2">{participant.name}</td>
                        <td className="px-4 py-2 text-slate-600">
                          {participant.email || "-"}
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {participant.phone || "-"}
                        </td>
                        <td className="px-4 py-2 text-slate-600">
                          {participant.profession || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs text-slate-600">
                  ... et {participants.length - previewLimit} autre(s) participant(s)
                </div>
              )}
            </div>
          )}

          {/* Message si aucun participant valide */}
          {validCount === 0 && (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-center text-yellow-800">
              Aucun participant valide trouvé. Veuillez corriger les erreurs avant de continuer.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={validCount === 0}
          >
            Importer {validCount > 0 && `(${validCount} participant${validCount > 1 ? "s" : ""})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

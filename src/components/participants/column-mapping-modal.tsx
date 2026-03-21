"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColumnMappingModalProps {
  csvColumns: string[];
  /** Colonnes CSV → champ système (préremplissage après détection auto ou pour ré-édition) */
  initialMapping?: Record<string, string>;
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
  open: boolean;
}

const FIELD_OPTIONS = [
  { value: "ignore", label: "Ignorer" },
  { value: "name", label: "Nom *" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "profession", label: "Profession" },
] as const;

function buildMappingState(
  columns: string[],
  initial?: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    columns.map((col) => [col, initial?.[col] ?? "ignore"])
  );
}

export function ColumnMappingModal({
  csvColumns,
  initialMapping,
  onMappingComplete,
  onCancel,
  open,
}: ColumnMappingModalProps) {
  const [mapping, setMapping] = useState<Record<string, string>>(() =>
    buildMappingState(csvColumns, initialMapping)
  );

  const handleMappingChange = (column: string, field: string) => {
    setMapping((prev) => ({
      ...prev,
      [column]: field,
    }));
  };

  const handleConfirm = () => {
    // Vérifier qu'au moins un champ "name" est mappé
    const nameMapped = Object.values(mapping).includes("name");
    if (!nameMapped) {
      alert("Vous devez mapper au moins une colonne vers le champ 'Nom' (requis).");
      return;
    }
    onMappingComplete(mapping);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mapping des colonnes</DialogTitle>
          <DialogDescription>
            Associez chaque colonne de votre fichier aux champs correspondants (CSV ou Excel).
            Le champ « Nom » est obligatoire.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {csvColumns.map((column) => (
            <div key={column} className="flex items-center gap-4">
              <Label className="flex-1 font-medium min-w-[200px]">{column}</Label>
              <Select
                value={mapping[column] || "ignore"}
                onValueChange={(value) => handleMappingChange(column, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner un champ" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

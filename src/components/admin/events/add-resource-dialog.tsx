"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Key, Link2, FileText, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventResource } from "@/server/actions/resources";

type ResourceType = "API_CREDENTIAL" | "LINK" | "TEXT_INFO";

interface AddResourceDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface TypeOption {
  type: ResourceType;
  label: string;
  description: string;
  icon: React.ElementType;
  badgeClass: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    type: "API_CREDENTIAL",
    label: "Crédits API",
    description: "Distribuez des clés API uniques à chaque participant lors du check-in.",
    icon: Key,
    badgeClass: "border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700",
  },
  {
    type: "LINK",
    label: "Lien",
    description: "Partagez une URL avec tous les participants enregistrés.",
    icon: Link2,
    badgeClass: "border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700",
  },
  {
    type: "TEXT_INFO",
    label: "Information",
    description: "Partagez du contenu textuel avec tous les participants.",
    icon: FileText,
    badgeClass: "border-green-300 bg-green-50 hover:bg-green-100 text-green-700",
  },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  url: "",
  fileName: "",
  content: "",
};

export function AddResourceDialog({
  eventId,
  open,
  onOpenChange,
  onSuccess,
}: AddResourceDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setSelectedType(null);
      setForm(INITIAL_FORM);
    }, 200);
  };

  const handleSelectType = (type: ResourceType) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedType(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;

    setIsSubmitting(true);
    const result = await createEventResource(eventId, {
      type: selectedType,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      url: form.url.trim() || undefined,
      fileName: form.fileName.trim() || undefined,
      content: form.content.trim() || undefined,
    });

    if (result.success) {
      toast.success("Ressource créée avec succès");
      onSuccess();
      handleClose();
    } else {
      toast.error(result.error ?? "Impossible de créer la ressource");
    }
    setIsSubmitting(false);
  };

  const updateField = (field: keyof typeof INITIAL_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-2 border-black shadow-[6px_6px_0_0_#000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Retour"
                className="rounded p-1 hover:bg-slate-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {step === 1 ? "Ajouter une ressource" : "Configurer la ressource"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-slate-500">Choisissez le type de ressource à ajouter.</p>
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => handleSelectType(option.type)}
                  className={`flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left transition-all hover:shadow-[2px_2px_0_0_#000] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${option.badgeClass}`}
                >
                  <div className="mt-0.5 rounded-lg bg-white p-2 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-0.5 text-xs opacity-75">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && selectedType && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="resource-title">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="resource-title"
                placeholder="Ex: Clé API OpenAI"
                value={form.title}
                onChange={updateField("title")}
                required
                className="border-2 border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="resource-description">Description (optionnelle)</Label>
              <Input
                id="resource-description"
                placeholder="Courte description visible par les participants"
                value={form.description}
                onChange={updateField("description")}
                className="border-2 border-slate-200"
              />
            </div>

            {selectedType === "LINK" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="resource-url">
                    URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="resource-url"
                    type="url"
                    placeholder="https://..."
                    value={form.url}
                    onChange={updateField("url")}
                    required
                    className="border-2 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="resource-filename">Libellé du lien (optionnel)</Label>
                  <Input
                    id="resource-filename"
                    placeholder="Ex: Télécharger le dataset"
                    value={form.fileName}
                    onChange={updateField("fileName")}
                    className="border-2 border-slate-200"
                  />
                </div>
              </>
            )}

            {selectedType === "TEXT_INFO" && (
              <div className="space-y-1">
                <Label htmlFor="resource-content">
                  Contenu <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="resource-content"
                  placeholder="Contenu textuel partagé avec les participants..."
                  value={form.content}
                  onChange={updateField("content")}
                  required
                  className="min-h-[120px] border-2 border-slate-200"
                />
              </div>
            )}

            {selectedType === "API_CREDENTIAL" && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                Vous pourrez importer les clés après la création de la ressource.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="border-2 border-black bg-indigo-600 font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[3px_3px_0_0_#000] disabled:opacity-60"
              >
                {isSubmitting ? "Création..." : "Créer la ressource"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomQuestion } from "@prisma/client";
import { createCustomQuestion, deleteCustomQuestion } from "@/server/actions/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomQuestionsSectionProps {
  eventId: string;
  customQuestions: CustomQuestion[];
}

const QUESTION_TYPES = [
  { value: "TEXT", label: "Texte libre" },
  { value: "MULTIPLE_CHOICE", label: "Choix multiple" },
  { value: "YES_NO", label: "Oui/Non" },
  { value: "DATE", label: "Date" },
  { value: "NUMBER", label: "Nombre" },
] as const;

export function CustomQuestionsSection({ eventId, customQuestions }: CustomQuestionsSectionProps) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"TEXT" | "MULTIPLE_CHOICE" | "YES_NO" | "DATE" | "NUMBER">("TEXT");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    if (type === "MULTIPLE_CHOICE" && options.length === 0) {
      alert("Veuillez ajouter au moins une option pour les questions à choix multiple");
      return;
    }

    const formData = new FormData();
    formData.set("eventId", eventId);
    formData.set("label", label.trim());
    formData.set("type", type);
    formData.set("isRequired", String(isRequired));
    formData.set("order", String(customQuestions.length));
    if (options.length > 0) {
      formData.set("options", JSON.stringify(options));
    }

    await createCustomQuestion(formData);
    setLabel("");
    setType("TEXT");
    setIsRequired(false);
    setOptions([]);
    setNewOption("");
    router.refresh();
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      await deleteCustomQuestion(questionId);
      router.refresh();
    }
  };

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Questions personnalisées ({customQuestions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddQuestion} className="space-y-3">
          <div>
            <Label>Question</Label>
            <Input
              placeholder="Quelle est votre question ?"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Type de question</Label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {type === "MULTIPLE_CHOICE" && (
            <div className="space-y-2">
              <Label>Options de réponse</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddOption} variant="outline">
                  Ajouter
                </Button>
              </div>
              {options.length > 0 && (
                <ul className="space-y-1">
                  {options.map((opt, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-sm">
                      <span>{opt}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(idx)}
                        className="h-6 px-2 text-xs"
                      >
                        Supprimer
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="question-required"
              checked={isRequired}
              onCheckedChange={(checked) => setIsRequired(checked === true)}
            />
            <Label htmlFor="question-required" className="cursor-pointer">
              Question obligatoire
            </Label>
          </div>

          <Button type="submit" size="sm">
            Ajouter la question
          </Button>
        </form>

        {customQuestions.length > 0 && (
          <div className="border-t pt-4">
            <Label className="mb-2 block">Questions configurées</Label>
            <ul className="space-y-2">
              {customQuestions
                .sort((a, b) => a.order - b.order)
                .map((q) => {
                  const questionType = QUESTION_TYPES.find((t) => t.value === q.type);
                  let optionsArray: string[] = [];
                  try {
                    optionsArray = q.options ? JSON.parse(q.options) : [];
                  } catch {
                    optionsArray = [];
                  }
                  return (
                    <li key={q.id} className="rounded bg-slate-50 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{q.label}</p>
                          <p className="text-xs text-slate-600">
                            Type: {questionType?.label || q.type} {q.isRequired && "• Requis"}
                          </p>
                          {optionsArray.length > 0 && (
                            <p className="mt-1 text-xs text-slate-500">
                              Options: {optionsArray.join(", ")}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

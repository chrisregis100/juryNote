"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Criterion } from "@prisma/client";
import { createCriterion } from "@/server/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CriteriaSectionProps {
  eventId: string;
  criteria: Criterion[];
  isLocked: boolean;
}

const SCALE_OPTIONS = [
  { value: "SCALE_0_5", label: "0–5" },
  { value: "SCALE_0_10", label: "0–10" },
  { value: "SCALE_0_20", label: "0–20" },
] as const;

export function CriteriaSection({ eventId, criteria, isLocked }: CriteriaSectionProps) {
  const router = useRouter();
  const [criterionName, setCriterionName] = useState("");
  const [criterionWeight, setCriterionWeight] = useState("1");
  const [criterionScale, setCriterionScale] = useState<"SCALE_0_5" | "SCALE_0_10" | "SCALE_0_20">("SCALE_0_10");

  const handleAddCriterion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!criterionName.trim()) return;
    const formData = new FormData();
    formData.set("name", criterionName.trim());
    formData.set("weight", criterionWeight);
    formData.set("scaleType", criterionScale);
    formData.set("order", String(criteria.length));
    await createCriterion(eventId, formData);
    setCriterionName("");
    setCriterionWeight("1");
    router.refresh();
  };

  return (
    <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Critères</h2>
        <span className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-bold text-indigo-700">
          {criteria.length}
        </span>
      </div>

      {!isLocked && (
        <form onSubmit={handleAddCriterion} className="mb-4 space-y-3">
          <Input
            placeholder="Nom du critère"
            value={criterionName}
            onChange={(e) => setCriterionName(e.target.value)}
            className="border-2 border-slate-200"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-600">Coefficient</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={criterionWeight}
                onChange={(e) => setCriterionWeight(e.target.value)}
                className="border-2 border-slate-200"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-600">Barème</Label>
              <select
                className="flex h-10 w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm"
                value={criterionScale}
                onChange={(e) => setCriterionScale(e.target.value as typeof criterionScale)}
              >
                {SCALE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full border-2 border-black bg-indigo-600 font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[3px_3px_0_0_#000]"
          >
            Ajouter le critère
          </Button>
        </form>
      )}

      {criteria.length === 0 ? (
        <p className="rounded-lg bg-slate-50 py-8 text-center text-sm text-slate-500">
          Aucun critère pour le moment.
        </p>
      ) : (
        <ul className="space-y-2">
          {criteria.map((criterion) => (
            <li
              key={criterion.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="font-medium text-slate-900">{criterion.name}</span>
              </div>
              <div className="flex gap-1 text-xs">
                <span className="rounded bg-white px-2 py-0.5 font-mono text-slate-600">
                  ×{criterion.weight}
                </span>
                <span className="rounded bg-white px-2 py-0.5 font-mono text-slate-600">
                  {criterion.scaleType.replace("SCALE_", "")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

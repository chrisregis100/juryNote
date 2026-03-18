"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Team, Criterion, JuryAssignment } from "@prisma/client";
import { createTeam, createCriterion, generateJuryPin } from "@/server/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventConfigProps {
  eventId: string;
  eventSlug: string;
  teams: Team[];
  criteria: Criterion[];
  juryAssignments: JuryAssignment[];
  isLocked: boolean;
}

const SCALE_OPTIONS = [
  { value: "SCALE_0_5", label: "0–5" },
  { value: "SCALE_0_10", label: "0–10" },
  { value: "SCALE_0_20", label: "0–20" },
] as const;

export function EventConfig({
  eventId,
  eventSlug,
  teams,
  criteria,
  juryAssignments,
  isLocked,
}: EventConfigProps) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [criterionName, setCriterionName] = useState("");
  const [criterionWeight, setCriterionWeight] = useState("1");
  const [criterionScale, setCriterionScale] = useState<"SCALE_0_5" | "SCALE_0_10" | "SCALE_0_20">("SCALE_0_10");
  const [newPin, setNewPin] = useState<string | null>(null);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    const formData = new FormData();
    formData.set("name", teamName.trim());
    formData.set("members", "[]");
    await createTeam(eventId, formData);
    setTeamName("");
    router.refresh();
  };

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

  const handleGeneratePin = async () => {
    const result = await generateJuryPin(eventId);
    if (result.data) {
      setNewPin(result.data.pinCode);
      router.refresh();
    }
  };

  const joinPath = "/jury/join";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Équipes ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLocked && (
            <form onSubmit={handleAddTeam} className="flex gap-2">
              <Input
                placeholder="Nom de l’équipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Button type="submit" size="sm">Ajouter</Button>
            </form>
          )}
          <ul className="space-y-1 text-sm">
            {teams.map((t) => (
              <li key={t.id} className="rounded bg-slate-50 px-2 py-1">
                {t.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Critères ({criteria.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLocked && (
            <form onSubmit={handleAddCriterion} className="space-y-2">
              <Input
                placeholder="Nom du critère"
                value={criterionName}
                onChange={(e) => setCriterionName(e.target.value)}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Coefficient</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={criterionWeight}
                    onChange={(e) => setCriterionWeight(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">Barème</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={criterionScale}
                    onChange={(e) => setCriterionScale(e.target.value as typeof criterionScale)}
                  >
                    {SCALE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" size="sm">Ajouter</Button>
            </form>
          )}
          <ul className="space-y-1 text-sm">
            {criteria.map((c) => (
              <li key={c.id} className="rounded bg-slate-50 px-2 py-1">
                {c.name} (×{c.weight}, {c.scaleType.replace("SCALE_", "")})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Accès jury</CardTitle>
          <p className="text-sm text-slate-600">
            Partager le slug <strong>{eventSlug}</strong> et le code PIN à 6 chiffres.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLocked && (
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" size="sm" onClick={handleGeneratePin}>
                Générer un code PIN
              </Button>
              {newPin && (
                <span className="rounded bg-indigo-100 px-3 py-1 font-mono text-indigo-800">
                  {newPin}
                </span>
              )}
            </div>
          )}
          <p className="text-sm text-slate-600">
            Les jurys se connectent sur <code className="rounded bg-slate-100 px-1">{joinPath}</code> avec le slug <strong>{eventSlug}</strong> et leur code PIN.
          </p>
          <ul className="space-y-1 text-sm">
            {juryAssignments.map((j) => (
              <li key={j.id} className="flex items-center gap-2 rounded bg-slate-50 px-2 py-1">
                <span className="font-mono">{j.pinCode}</span>
                {j.displayName && <span className="text-slate-600">({j.displayName})</span>}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

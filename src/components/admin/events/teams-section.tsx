"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@prisma/client";
import { createTeam } from "@/server/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeamsSectionProps {
  eventId: string;
  teams: Team[];
  isLocked: boolean;
}

export function TeamsSection({ eventId, teams, isLocked }: TeamsSectionProps) {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");

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

  return (
    <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Équipes</h2>
        <span className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-bold text-indigo-700">
          {teams.length}
        </span>
      </div>

      {!isLocked && (
        <form onSubmit={handleAddTeam} className="mb-4 flex gap-2">
          <Input
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border-2 border-slate-200"
          />
          <Button
            type="submit"
            size="sm"
            className="border-2 border-black bg-indigo-600 font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[3px_3px_0_0_#000]"
          >
            Ajouter
          </Button>
        </form>
      )}

      {teams.length === 0 ? (
        <p className="rounded-lg bg-slate-50 py-8 text-center text-sm text-slate-500">
          Aucune équipe pour le moment.
        </p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="font-medium text-slate-900">{team.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

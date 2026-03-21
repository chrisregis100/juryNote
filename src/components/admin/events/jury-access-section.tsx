"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JuryAssignment } from "@prisma/client";
import { generateJuryPin } from "@/server/actions/event";
import { Button } from "@/components/ui/button";

interface JuryAccessSectionProps {
  eventId: string;
  eventSlug: string;
  juryAssignments: JuryAssignment[];
  isLocked: boolean;
}

const JOIN_PATH = "/jury/join";

export function JuryAccessSection({
  eventId,
  eventSlug,
  juryAssignments,
  isLocked,
}: JuryAccessSectionProps) {
  const router = useRouter();
  const [newPin, setNewPin] = useState<string | null>(null);

  const handleGeneratePin = async () => {
    const result = await generateJuryPin(eventId);
    if (result.data) {
      setNewPin(result.data.pinCode);
      router.refresh();
    }
  };

  return (
    <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Accès jury</h2>
        <span className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-bold text-indigo-700">
          {juryAssignments.length}
        </span>
      </div>

      <div className="mb-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          Partagez le slug <strong className="font-mono text-indigo-600">{eventSlug}</strong> et le code PIN à 6 chiffres avec vos jurys.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Les jurys se connectent sur{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">{JOIN_PATH}</code>
        </p>
      </div>

      {!isLocked && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            onClick={handleGeneratePin}
            className="border-2 border-black bg-black font-bold text-white shadow-[2px_2px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4f46e5]"
          >
            Générer un code PIN
          </Button>
          {newPin && (
            <span className="rounded-lg border-2 border-indigo-600 bg-indigo-50 px-4 py-2 font-mono text-lg font-bold text-indigo-700">
              {newPin}
            </span>
          )}
        </div>
      )}

      {juryAssignments.length === 0 ? (
        <p className="rounded-lg bg-slate-50 py-6 text-center text-sm text-slate-500">
          Aucun jury enregistré. Générez des codes PIN pour permettre l&apos;accès.
        </p>
      ) : (
        <ul className="space-y-2">
          {juryAssignments.map((jury) => (
            <li
              key={jury.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="rounded-md bg-indigo-100 px-2 py-1 font-mono text-sm font-bold text-indigo-700">
                {jury.pinCode}
              </span>
              {jury.displayName ? (
                <span className="text-sm font-medium text-slate-700">{jury.displayName}</span>
              ) : (
                <span className="text-xs italic text-slate-400">Non nommé</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

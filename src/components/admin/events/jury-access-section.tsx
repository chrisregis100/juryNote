"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { JuryAssignment } from "@prisma/client";
import { createJuryMember, deleteJuryMember } from "@/server/actions/event";
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
  const [name, setName] = useState("");
  const [isPresident, setIsPresident] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleAddJury = async () => {
    if (!name.trim()) {
      setNameError("Le nom du jury est requis.");
      return;
    }
    setNameError(null);
    setIsSubmitting(true);
    try {
      await createJuryMember(eventId, name.trim(), isPresident);
      setName("");
      setIsPresident(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    await deleteJuryMember(assignmentId);
    router.refresh();
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          Partagez le slug{" "}
          <strong className="font-mono text-indigo-600">{eventSlug}</strong> et
          le code PIN à 6 chiffres avec vos jurys.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Les jurys se connectent sur{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            {JOIN_PATH}
          </code>
        </p>
      </div>

      {!isLocked && (
        <div className="mb-5 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddJury()}
              placeholder="Nom du jury…"
              aria-label="Nom du membre du jury"
              className="flex-1 rounded-lg border-2 border-black px-3 py-2 text-sm font-medium text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddJury}
              disabled={isSubmitting}
              className="border-2 border-black bg-black font-bold text-white shadow-[2px_2px_0_0_#4f46e5] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4f46e5] disabled:opacity-60"
            >
              {isSubmitting ? "…" : "Ajouter ce jury"}
            </Button>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPresident}
              onChange={(e) => setIsPresident(e.target.checked)}
              className="h-4 w-4 rounded border-black accent-indigo-600"
            />
            <span className="font-medium text-slate-700">Président de jury</span>
          </label>
          {nameError && (
            <p className="text-xs font-medium text-red-600">{nameError}</p>
          )}
        </div>
      )}

      {juryAssignments.length === 0 ? (
        <p className="rounded-lg bg-slate-50 py-6 text-center text-sm text-slate-500">
          Aucun jury enregistré. Ajoutez des membres de jury pour permettre
          l&apos;accès.
        </p>
      ) : (
        <ul className="space-y-2">
          {juryAssignments.map((assignment) => {
            const magicUrl =
              assignment.magicToken && origin
                ? `${origin}/api/jury/magic/${assignment.magicToken}`
                : null;
            return (
              <li
                key={assignment.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-black">
                      {assignment.displayName ?? "Sans nom"}
                    </span>
                    {assignment.isPresident && (
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                        Président
                      </span>
                    )}
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 font-mono text-xs font-bold text-slate-700">
                      {assignment.pinCode}
                    </span>
                  </div>
                  {!isLocked && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(assignment.id)}
                      className="border-2 border-red-500 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
                {magicUrl && (
                  <div className="flex items-center gap-2 overflow-hidden rounded border border-slate-200 bg-white px-2 py-1">
                    <span className="flex-1 truncate font-mono text-xs text-slate-500">
                      {magicUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(magicUrl, assignment.id)}
                      className="shrink-0 rounded px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50"
                      aria-label="Copier le lien magique"
                    >
                      {copiedId === assignment.id ? "Copié !" : "Copier"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

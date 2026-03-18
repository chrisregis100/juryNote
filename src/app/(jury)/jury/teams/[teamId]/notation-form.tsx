"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Criterion } from "@prisma/client";
import { upsertGrade } from "@/server/actions/grade";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const SCALE_MAX: Record<string, number> = {
  SCALE_0_5: 5,
  SCALE_0_10: 10,
  SCALE_0_20: 20,
};

interface NotationFormProps {
  teamId: string;
  criteria: Criterion[];
  initialGrades: Record<string, { value: number; comment: string | null }>;
  juryAssignmentId: string;
  isLocked: boolean;
}

export function NotationForm({
  teamId,
  criteria,
  initialGrades,
  juryAssignmentId,
  isLocked,
}: NotationFormProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    criteria.forEach((c) => {
      o[c.id] = initialGrades[c.id]?.value ?? 0;
    });
    return o;
  });
  const [comments, setComments] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    criteria.forEach((c) => {
      o[c.id] = initialGrades[c.id]?.comment ?? "";
    });
    return o;
  });
  const [teamComment, setTeamComment] = useState("");
  const [pending, setPending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const queueRef = useRef<Array<{ criterionId: string; value: number; comment: string | null }>>([]);
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (queueRef.current.length === 0) return;
    const toSend = [...queueRef.current];
    queueRef.current = [];
    setPending(true);
    setLastError(null);
    for (const item of toSend) {
      const result = await upsertGrade(juryAssignmentId, {
        teamId,
        criterionId: item.criterionId,
        value: item.value,
        comment: item.comment ?? undefined,
      });
      if (result.error) {
        setLastError(Object.values(result.error).flat().join(" "));
          break;
        }
      }
    setPending(false);
  }, [juryAssignmentId, teamId]);

  const scheduleFlush = useCallback(() => {
    if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current);
    flushTimeoutRef.current = setTimeout(() => {
      flushTimeoutRef.current = null;
      void flush();
    }, 800);
  }, [flush]);

  const updateValue = useCallback(
    (criterionId: string, value: number) => {
      if (isLocked) return;
      setValues((prev) => ({ ...prev, [criterionId]: value }));
      queueRef.current.push({
        criterionId,
        value,
        comment: comments[criterionId] ?? null,
      });
      scheduleFlush();
    },
    [isLocked, comments, scheduleFlush]
  );

  const updateComment = useCallback(
    (criterionId: string, comment: string) => {
      setComments((prev) => ({ ...prev, [criterionId]: comment }));
      const value = values[criterionId] ?? 0;
      queueRef.current.push({ criterionId, value, comment: comment || null });
      scheduleFlush();
    },
    [values, scheduleFlush]
  );

  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) clearTimeout(flushTimeoutRef.current);
      void flush();
    };
  }, [flush]);

  if (isLocked) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        La délibération est clôturée. Les notes ne sont plus modifiables.
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/jury">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {criteria.map((c) => {
        const max = SCALE_MAX[c.scaleType] ?? 10;
        const value = values[c.id] ?? 0;
        return (
          <div key={c.id} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
            <Label className="text-base font-medium">
              {c.name} (×{c.weight}, 0–{max})
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[value]}
                onValueChange={([v]) => updateValue(c.id, v ?? 0)}
                max={max}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="w-8 text-right font-mono text-slate-600">{value}</span>
            </div>
            <Textarea
              placeholder="Commentaire (optionnel)"
              value={comments[c.id] ?? ""}
              onChange={(e) => updateComment(c.id, e.target.value)}
              onBlur={() => scheduleFlush()}
              className="min-h-[60px] resize-y"
            />
          </div>
        );
      })}

      {lastError && (
        <p className="text-sm text-red-600" role="alert">
          {lastError}
        </p>
      )}
      {pending && (
        <p className="text-sm text-slate-500">Sauvegarde…</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/jury">Retour à la liste</Link>
        </Button>
      </div>
    </div>
  );
}

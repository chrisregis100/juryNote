"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CheckinLink } from "@prisma/client";
import { toggleCheckinLink } from "@/server/actions/checkin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckinLinkSectionProps {
  eventId: string;
  eventSlug: string;
  checkinLink: CheckinLink | null;
  checkedInCount: number;
}

export function CheckinLinkSection({ eventId, eventSlug, checkinLink, checkedInCount }: CheckinLinkSectionProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(checkinLink?.isActive ?? false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsActive(checkinLink?.isActive ?? false);
  }, [checkinLink]);

  const checkinUrl = checkinLink ? `${typeof window !== "undefined" ? window.location.origin : ""}/checkin/${eventSlug}` : null;

  const handleCopyLink = async () => {
    if (!checkinUrl) return;
    try {
      await navigator.clipboard.writeText(checkinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    setIsActive(checked);
    await toggleCheckinLink(eventId, checked);
    router.refresh();
  };

  if (!checkinLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lien de checking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Ajoutez d'abord des participants invités pour générer le lien de checking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Lien de checking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="checkin-active"
            checked={isActive}
            onCheckedChange={(checked) => handleToggleActive(checked === true)}
          />
          <Label htmlFor="checkin-active" className="cursor-pointer">
            Activer le checking pour cet événement
          </Label>
        </div>

        {isActive && checkinUrl && (
          <div className="space-y-2">
            <Label>Lien public de checking</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={checkinUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button type="button" size="sm" onClick={handleCopyLink} variant="outline">
                {copied ? "Copié !" : "Copier"}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Partagez ce lien avec les participants pour qu'ils puissent s'enregistrer.
            </p>
          </div>
        )}

        <div className="rounded bg-slate-50 p-3">
          <p className="text-sm font-medium">Statistiques</p>
          <p className="text-2xl font-bold text-indigo-600">{checkedInCount}</p>
          <p className="text-xs text-slate-600">participant(s) enregistré(s)</p>
        </div>
      </CardContent>
    </Card>
  );
}

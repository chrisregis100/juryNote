"use client";

import { useState, useMemo } from "react";
import type { ParticipantCheckin, CustomQuestion, ParticipantAnswer } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ParticipantsDashboardProps {
  eventId: string;
  checkins: (ParticipantCheckin & {
    answers: (ParticipantAnswer & {
      customQuestion: CustomQuestion;
    })[];
  })[];
  customQuestions: CustomQuestion[];
}

export function ParticipantsDashboard({ checkins, customQuestions }: ParticipantsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInvited, setFilterInvited] = useState<"all" | "invited" | "not-invited">("all");
  const [filterPhotoConsent, setFilterPhotoConsent] = useState<"all" | "yes" | "no">("all");

  const filteredCheckins = useMemo(() => {
    return checkins.filter((checkin) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !checkin.name.toLowerCase().includes(query) &&
          !checkin.email.toLowerCase().includes(query) &&
          !checkin.phone.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Invited filter
      if (filterInvited === "invited" && !checkin.isInvited) return false;
      if (filterInvited === "not-invited" && checkin.isInvited) return false;

      // Photo consent filter
      if (filterPhotoConsent === "yes" && !checkin.photoConsent) return false;
      if (filterPhotoConsent === "no" && checkin.photoConsent) return false;

      return true;
    });
  }, [checkins, searchQuery, filterInvited, filterPhotoConsent]);

  const stats = useMemo(() => {
    const total = checkins.length;
    const invited = checkins.filter((c) => c.isInvited).length;
    const notInvited = total - invited;
    const withPhotoConsent = checkins.filter((c) => c.photoConsent).length;
    return { total, invited, notInvited, withPhotoConsent };
  }, [checkins]);

  const handleDownload = (format: "csv" | "xlsx" | "pdf") => {
    const url = `/api/events/${eventId}/participants/export?format=${format}`;
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Participants enregistrés ({filteredCheckins.length})</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleDownload("csv")}>
              CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDownload("xlsx")}>
              Excel
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDownload("pdf")}>
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded bg-slate-50 p-3">
            <p className="text-xs text-slate-600">Total</p>
            <p className="text-xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded bg-green-50 p-3">
            <p className="text-xs text-slate-600">Invités</p>
            <p className="text-xl font-bold text-green-600">{stats.invited}</p>
          </div>
          <div className="rounded bg-orange-50 p-3">
            <p className="text-xs text-slate-600">Non invités</p>
            <p className="text-xl font-bold text-orange-600">{stats.notInvited}</p>
          </div>
          <div className="rounded bg-blue-50 p-3">
            <p className="text-xs text-slate-600">Avec consentement</p>
            <p className="text-xl font-bold text-blue-600">{stats.withPhotoConsent}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 border-t pt-4">
          <div>
            <Label>Recherche</Label>
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Statut d'invitation</Label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={filterInvited}
                onChange={(e) => setFilterInvited(e.target.value as typeof filterInvited)}
              >
                <option value="all">Tous</option>
                <option value="invited">Invités uniquement</option>
                <option value="not-invited">Non invités uniquement</option>
              </select>
            </div>

            <div>
              <Label>Consentement photo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={filterPhotoConsent}
                onChange={(e) => setFilterPhotoConsent(e.target.value as typeof filterPhotoConsent)}
              >
                <option value="all">Tous</option>
                <option value="yes">Avec consentement</option>
                <option value="no">Sans consentement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredCheckins.length === 0 ? (
          <div className="rounded bg-slate-50 p-8 text-center text-slate-600">
            {checkins.length === 0
              ? "Aucun participant enregistré pour le moment."
              : "Aucun participant ne correspond aux filtres sélectionnés."}
          </div>
        ) : (
          <div className="overflow-x-auto border-t pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium">Nom</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Téléphone</th>
                  <th className="px-3 py-2 text-left font-medium">Profession</th>
                  <th className="px-3 py-2 text-center font-medium">Statut</th>
                  <th className="px-3 py-2 text-center font-medium">Photo</th>
                  <th className="px-3 py-2 text-left font-medium">Date</th>
                  {customQuestions.map((q) => (
                    <th key={q.id} className="px-3 py-2 text-left font-medium">
                      {q.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.map((checkin) => {
                  const answerMap = new Map(
                    checkin.answers.map((a) => [a.customQuestionId, a.value])
                  );
                  return (
                    <tr key={checkin.id} className="border-b">
                      <td className="px-3 py-2 font-medium">{checkin.name}</td>
                      <td className="px-3 py-2">{checkin.email}</td>
                      <td className="px-3 py-2">{checkin.phone}</td>
                      <td className="px-3 py-2">{checkin.profession}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs ${
                            checkin.isInvited
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {checkin.isInvited ? "Invité" : "Non invité"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {checkin.photoConsent ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-red-600">✗</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {new Date(checkin.checkedInAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      {customQuestions.map((q) => {
                        const answer = answerMap.get(q.id);
                        let displayValue = answer || "-";
                        if (q.type === "YES_NO") {
                          displayValue = answer === "true" || answer === "oui" ? "Oui" : answer === "false" || answer === "non" ? "Non" : "-";
                        } else if (q.type === "MULTIPLE_CHOICE" && answer) {
                          try {
                            const parsed = JSON.parse(answer);
                            displayValue = Array.isArray(parsed) ? parsed.join(", ") : parsed;
                          } catch {
                            displayValue = answer;
                          }
                        }
                        return (
                          <td key={q.id} className="px-3 py-2 text-slate-600">
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import type { CustomQuestion } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildDashboardQueryString,
  type ParticipantCheckinDashboardQuery,
  type ParticipantCheckinDashboardRow,
} from "@/lib/participant-checkin-dashboard";

interface ParticipantsDashboardProps {
  eventId: string;
  checkins: ParticipantCheckinDashboardRow[];
  customQuestions: CustomQuestion[];
  totalFiltered: number;
  totalPages: number;
  page: number;
  pageSize: number;
  query: ParticipantCheckinDashboardQuery;
  stats: {
    total: number;
    invited: number;
    notInvited: number;
    withPhotoConsent: number;
  };
}

export function ParticipantsDashboard({
  eventId,
  checkins,
  customQuestions,
  totalFiltered,
  totalPages,
  page,
  pageSize,
  query,
  stats,
}: ParticipantsDashboardProps) {
  const basePath = `/admin/events/${eventId}/dashboard`;

  const queryWithPage = (newPage: number): ParticipantCheckinDashboardQuery => ({
    ...query,
    page: newPage,
  });

  const handleDownload = (format: "csv" | "xlsx" | "pdf") => {
    const url = `/api/events/${eventId}/participants/export?format=${format}`;
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">
            Participants correspondants ({totalFiltered}
            {totalFiltered !== stats.total ? ` sur ${stats.total} au total` : ""})
          </CardTitle>
          <div className="flex flex-wrap gap-2">
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

        <form
          method="get"
          action={basePath}
          className="space-y-3 border-t pt-4"
          key={`${query.q}-${query.invited}-${query.photo}-${pageSize}`}
        >
          <input type="hidden" name="page" value="1" />

          <div>
            <Label htmlFor="participants-filter-q">Recherche</Label>
            <Input
              id="participants-filter-q"
              name="q"
              placeholder="Rechercher par nom, email ou téléphone..."
              defaultValue={query.q}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="participants-filter-invited">Statut d&apos;invitation</Label>
              <select
                id="participants-filter-invited"
                name="invited"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                defaultValue={query.invited}
              >
                <option value="all">Tous</option>
                <option value="invited">Invités uniquement</option>
                <option value="not-invited">Non invités uniquement</option>
              </select>
            </div>

            <div>
              <Label htmlFor="participants-filter-photo">Consentement photo</Label>
              <select
                id="participants-filter-photo"
                name="photo"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                defaultValue={query.photo}
              >
                <option value="all">Tous</option>
                <option value="yes">Avec consentement</option>
                <option value="no">Sans consentement</option>
              </select>
            </div>

            <div>
              <Label htmlFor="participants-filter-page-size">Par page</Label>
              <select
                id="participants-filter-page-size"
                name="pageSize"
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                defaultValue={String(pageSize)}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="default">
            Appliquer les filtres
          </Button>
        </form>

        {checkins.length === 0 ? (
          <div className="rounded bg-slate-50 p-8 text-center text-slate-600">
            {stats.total === 0
              ? "Aucun participant enregistré pour le moment."
              : "Aucun participant ne correspond aux filtres sélectionnés."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border-t pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Nom
                    </th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Téléphone
                    </th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Profession
                    </th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">
                      Statut
                    </th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">
                      Photo
                    </th>
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Date
                    </th>
                    {customQuestions.map((q) => (
                      <th key={q.id} scope="col" className="px-3 py-2 text-left font-medium">
                        {q.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((checkin) => {
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
                          <span
                            className={
                              checkin.photoConsent ? "font-medium text-green-700" : "font-medium text-red-700"
                            }
                          >
                            {checkin.photoConsent ? "Oui" : "Non"}
                          </span>
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
                            displayValue =
                              answer === "true" || answer === "oui"
                                ? "Oui"
                                : answer === "false" || answer === "non"
                                  ? "Non"
                                  : "-";
                          } else if (q.type === "MULTIPLE_CHOICE" && answer) {
                            try {
                              const parsed = JSON.parse(answer) as unknown;
                              displayValue = Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
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

            {totalPages > 1 ? (
              <nav
                className="flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row"
                aria-label="Pagination des participants"
              >
                <p className="text-sm text-slate-600">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`${basePath}${buildDashboardQueryString(queryWithPage(page - 1))}`}
                        prefetch={false}
                      >
                        Précédent
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Précédent
                    </Button>
                  )}
                  {page < totalPages ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`${basePath}${buildDashboardQueryString(queryWithPage(page + 1))}`}
                        prefetch={false}
                      >
                        Suivant
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Suivant
                    </Button>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

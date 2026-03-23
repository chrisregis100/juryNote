"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Key, Link2, FileText, Plus, Trash2, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getEventResources,
  deleteEventResource,
  updateEventResource,
} from "@/server/actions/resources";
import dynamic from "next/dynamic";
import { AddResourceDialog } from "./add-resource-dialog";

const ApiCredentialsManager = dynamic(
  () =>
    import("./api-credentials-manager").then((m) => ({
      default: m.ApiCredentialsManager,
    })),
  {
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl bg-slate-100" />
    ),
    ssr: false,
  }
);

interface Resource {
  id: string;
  type: "API_CREDENTIAL" | "LINK" | "TEXT_INFO";
  title: string;
  description: string | null;
  isActive: boolean;
  url: string | null;
  fileName: string | null;
  content: string | null;
  totalCredentials: number;
  assignedCount: number;
}

interface ResourcesSectionProps {
  eventId: string;
}

const TYPE_CONFIG = {
  API_CREDENTIAL: {
    label: "Crédits API",
    badgeClass: "bg-purple-100 text-purple-700 border border-purple-200",
    icon: Key,
  },
  LINK: {
    label: "Lien",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: Link2,
  },
  TEXT_INFO: {
    label: "Information",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
    icon: FileText,
  },
} as const;

export function ResourcesSection({ eventId }: ResourcesSectionProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [managerResourceId, setManagerResourceId] = useState<string | null>(null);
  const [managerResourceTitle, setManagerResourceTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    const result = await getEventResources(eventId);
    if (result.success && result.resources) {
      setResources(result.resources as Resource[]);
    } else {
      toast.error("Impossible de charger les ressources");
    }
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleToggleActive = async (resource: Resource) => {
    setTogglingId(resource.id);
    const result = await updateEventResource(resource.id, { isActive: !resource.isActive });
    if (result.success) {
      setResources((prev) =>
        prev.map((r) => (r.id === resource.id ? { ...r, isActive: !resource.isActive } : r))
      );
    } else {
      toast.error("Impossible de mettre à jour la ressource");
    }
    setTogglingId(null);
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) return;
    setDeletingId(resourceId);
    const result = await deleteEventResource(resourceId);
    if (result.success) {
      setResources((prev) => prev.filter((r) => r.id !== resourceId));
      toast.success("Ressource supprimée");
    } else {
      toast.error("Impossible de supprimer la ressource");
    }
    setDeletingId(null);
  };

  const handleOpenManager = (resource: Resource) => {
    setManagerResourceId(resource.id);
    setManagerResourceTitle(resource.title);
  };

  const activeManagerResource = managerResourceId
    ? resources.find((r) => r.id === managerResourceId)
    : null;

  return (
    <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Ressources</h2>
        <Button
          size="sm"
          onClick={() => setAddDialogOpen(true)}
          className="border-2 border-black bg-indigo-600 font-bold text-white shadow-[2px_2px_0_0_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[3px_3px_0_0_#000]"
        >
          <Plus className="mr-1 h-4 w-4" />
          Ajouter une ressource
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : resources.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          Aucune ressource ajoutée. Ajoutez des ressources pour les distribuer automatiquement lors
          du check-in.
        </p>
      ) : (
        <ul className="space-y-3">
          {resources.map((resource) => {
            const config = TYPE_CONFIG[resource.type];
            const Icon = config.icon;
            return (
              <li
                key={resource.id}
                className="rounded-lg border-2 border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${config.badgeClass}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                      {!resource.isActive && (
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                          Inactif
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-900">{resource.title}</p>
                    {resource.description && (
                      <p className="mt-0.5 text-sm text-slate-500">{resource.description}</p>
                    )}

                    {resource.type === "API_CREDENTIAL" && (
                      <p className="mt-1 inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                        {resource.assignedCount} / {resource.totalCredentials} assignés
                      </p>
                    )}

                    {resource.type === "LINK" && resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 truncate text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="max-w-[260px] truncate">{resource.url}</span>
                      </a>
                    )}

                    {resource.type === "TEXT_INFO" && resource.content && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{resource.content}</p>
                    )}
                  </div>

                    <div className="flex shrink-0 items-center gap-2">
                    {resource.type === "API_CREDENTIAL" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenManager(resource)}
                        className="border-2 border-slate-300 text-xs font-medium"
                      >
                        <Settings className="mr-1 h-3 w-3" />
                        Gérer les clés
                      </Button>
                    )}

                    <button
                      type="button"
                      role="switch"
                      aria-checked={resource.isActive}
                      aria-label={resource.isActive ? "Désactiver" : "Activer"}
                      disabled={togglingId === resource.id}
                      onClick={() => handleToggleActive(resource)}
                      className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full border-2 border-black transition-colors disabled:opacity-50 ${
                        resource.isActive ? "bg-green-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          resource.isActive ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={deletingId === resource.id}
                      onClick={() => handleDelete(resource.id)}
                      aria-label="Supprimer la ressource"
                      className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AddResourceDialog
        eventId={eventId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchResources}
      />

      {activeManagerResource && (
        <ApiCredentialsManager
          resourceId={managerResourceId!}
          resourceTitle={managerResourceTitle}
          open={!!managerResourceId}
          onOpenChange={(open) => {
            if (!open) {
              setManagerResourceId(null);
              fetchResources();
            }
          }}
        />
      )}
    </div>
  );
}

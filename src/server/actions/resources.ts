"use server";

import { db } from "@/lib/db";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";
import type { ResourceType } from "@prisma/client";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface CreateResourceData {
  type: ResourceType;
  title: string;
  description?: string;
  url?: string;
  fileName?: string;
  content?: string;
}

interface UpdateResourceData {
  title?: string;
  description?: string;
  url?: string;
  fileName?: string;
  content?: string;
  isActive?: boolean;
}

interface ImportCredentialRow {
  hint: string;
  value: string;
}

export interface UnlockedResource {
  id: string;
  type: "API_CREDENTIAL" | "LINK" | "TEXT_INFO";
  title: string;
  description?: string | null;
  url?: string | null;
  fileName?: string | null;
  content?: string | null;
  credentialValue?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeStr(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function createEventResource(eventId: string, data: CreateResourceData) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) return { success: false, error: "Event not found" };

    const resource = await db.eventResource.create({
      data: {
        eventId,
        type: data.type,
        title: data.title,
        description: data.description,
        url: data.url,
        fileName: data.fileName,
        content: data.content,
      },
    });

    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create resource",
    };
  }
}

export async function updateEventResource(resourceId: string, data: UpdateResourceData) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const resource = await db.eventResource.update({
      where: { id: resourceId },
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        fileName: data.fileName,
        content: data.content,
        isActive: data.isActive,
      },
    });

    return { success: true, resource };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update resource",
    };
  }
}

export async function deleteEventResource(resourceId: string) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    await db.eventResource.delete({ where: { id: resourceId } });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete resource",
    };
  }
}

export async function importApiCredentials(resourceId: string, rows: ImportCredentialRow[]) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, count: 0, error: "Unauthorized" };
    }

    const resource = await db.eventResource.findUnique({ where: { id: resourceId } });
    if (!resource) return { success: false, count: 0, error: "Resource not found" };

    const result = await db.apiCredential.createMany({
      data: rows.map((row) => ({
        resourceId,
        participantHint: row.hint,
        value: row.value,
      })),
    });

    return { success: true, count: result.count };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : "Failed to import credentials",
    };
  }
}

export async function addApiCredential(resourceId: string, hint: string, value: string) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const resource = await db.eventResource.findUnique({ where: { id: resourceId } });
    if (!resource) return { success: false, error: "Resource not found" };

    const credential = await db.apiCredential.create({
      data: {
        resourceId,
        participantHint: hint,
        value,
      },
    });

    return { success: true, credential };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add credential",
    };
  }
}

export async function deleteApiCredential(credentialId: string) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const credential = await db.apiCredential.findUnique({ where: { id: credentialId } });
    if (!credential) return { success: false, error: "Credential not found" };

    if (credential.assignedToId !== null) {
      return { success: false, error: "Cannot delete an already-assigned credential" };
    }

    await db.apiCredential.delete({ where: { id: credentialId } });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete credential",
    };
  }
}

export async function getEventResources(eventId: string) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const rawResources = await db.eventResource.findMany({
      where: { eventId },
      include: {
        _count: {
          select: { apiCredentials: true },
        },
        apiCredentials: {
          where: { assignedToId: { not: null } },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const resources = rawResources.map((r) => ({
      id: r.id,
      eventId: r.eventId,
      type: r.type,
      title: r.title,
      description: r.description,
      isActive: r.isActive,
      url: r.url,
      fileName: r.fileName,
      content: r.content,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      totalCredentials: r._count.apiCredentials,
      assignedCount: r.apiCredentials.length,
    }));

    return { success: true, resources };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch resources",
    };
  }
}

export async function getResourceCredentials(resourceId: string) {
  try {
    const session = await getServerSession();
    if (!session || !isOrganizerOrSupervisor(session)) {
      return { success: false, error: "Unauthorized" };
    }

    const credentials = await db.apiCredential.findMany({
      where: { resourceId },
      include: {
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, credentials };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch credentials",
    };
  }
}

// ─── Internal Helper (no "use server" — called from checkin.ts) ──────────────

export async function unlockResourcesForParticipant(
  participantCheckinId: string,
  eventId: string
): Promise<UnlockedResource[]> {
  const checkin = await db.participantCheckin.findUnique({
    where: { id: participantCheckinId },
  });

  if (!checkin) return [];

  const resources = await db.eventResource.findMany({
    where: { eventId, isActive: true },
    include: {
      apiCredentials: {
        where: { assignedToId: null },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const existingParticipantResources = await db.participantResource.findMany({
    where: { participantCheckinId },
    select: { resourceId: true },
  });

  const alreadyUnlockedIds = new Set(existingParticipantResources.map((r) => r.resourceId));

  const normalizedName = normalizeStr(checkin.name);
  const normalizedEmail = normalizeStr(checkin.email);

  const unlockedResources: UnlockedResource[] = [];

  for (const resource of resources) {
    if (resource.type === "API_CREDENTIAL") {
      if (alreadyUnlockedIds.has(resource.id)) continue;

      const candidates = resource.apiCredentials;

      // Exact match first
      let matched =
        candidates.find((c) => {
          if (!c.participantHint) return false;
          const hint = normalizeStr(c.participantHint);
          return hint === normalizedName || hint === normalizedEmail;
        }) ?? null;

      // Fallback: substring / includes match
      if (!matched) {
        matched =
          candidates.find((c) => {
            if (!c.participantHint) return false;
            const hint = normalizeStr(c.participantHint);
            return (
              normalizedName.includes(hint) ||
              hint.includes(normalizedName) ||
              normalizedEmail.includes(hint) ||
              hint.includes(normalizedEmail)
            );
          }) ?? null;
      }

      if (!matched) continue;

      // Atomic assignment: only succeeds if credential is still unassigned
      const updateResult = await db.apiCredential.updateMany({
        where: { id: matched.id, assignedToId: null },
        data: { assignedToId: participantCheckinId, assignedAt: new Date() },
      });

      if (updateResult.count === 0) continue;

      await db.participantResource.create({
        data: {
          participantCheckinId,
          resourceId: resource.id,
          apiCredentialId: matched.id,
        },
      });

      unlockedResources.push({
        id: resource.id,
        type: "API_CREDENTIAL",
        title: resource.title,
        description: resource.description,
        url: resource.url,
        fileName: resource.fileName,
        content: resource.content,
        credentialValue: matched.value,
      });
    } else {
      // LINK or TEXT_INFO
      if (alreadyUnlockedIds.has(resource.id)) continue;

      await db.participantResource.create({
        data: {
          participantCheckinId,
          resourceId: resource.id,
        },
      });

      unlockedResources.push({
        id: resource.id,
        type: resource.type as "LINK" | "TEXT_INFO",
        title: resource.title,
        description: resource.description,
        url: resource.url,
        fileName: resource.fileName,
        content: resource.content,
      });
    }
  }

  return unlockedResources;
}

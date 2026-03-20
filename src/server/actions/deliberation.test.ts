import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrCreateDeliberation, closeDeliberation, getRanking } from "./deliberation";

const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args) }));

const mockComputeRanking = vi.fn();
vi.mock("@/lib/scoring", () => ({ computeRanking: (...args: unknown[]) => mockComputeRanking(...args) }));

const mockDeliberationFindFirst = vi.fn();
const mockDeliberationCreate = vi.fn();
const mockDeliberationUpdate = vi.fn();
const mockEventFindUnique = vi.fn();
const mockGradeFindMany = vi.fn();
const mockRankingSnapshotCreate = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    deliberation: {
      findFirst: (...args: unknown[]) => mockDeliberationFindFirst(...args),
      create: (...args: unknown[]) => mockDeliberationCreate(...args),
      update: (...args: unknown[]) => mockDeliberationUpdate(...args),
    },
    event: { findUnique: (...args: unknown[]) => mockEventFindUnique(...args) },
    grade: { findMany: (...args: unknown[]) => mockGradeFindMany(...args) },
    rankingSnapshot: { create: (...args: unknown[]) => mockRankingSnapshotCreate(...args) },
  },
}));

describe("deliberation actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockComputeRanking.mockReturnValue([
      { teamId: "t1", teamName: "A", score: 10, rank: 1 },
      { teamId: "t2", teamName: "B", score: 5, rank: 2 },
    ]);
  });

  describe("getOrCreateDeliberation", () => {
    it("returns existing deliberation when found", async () => {
      const existing = { id: "d1", eventId: "ev-1", status: "open", createdAt: new Date() };
      mockDeliberationFindFirst.mockResolvedValue(existing);

      const result = await getOrCreateDeliberation("ev-1");

      expect(result).toEqual(existing);
      expect(mockDeliberationFindFirst).toHaveBeenCalledWith({
        where: { eventId: "ev-1" },
        orderBy: { createdAt: "desc" },
      });
      expect(mockDeliberationCreate).not.toHaveBeenCalled();
    });

    it("creates and returns new deliberation when none exists", async () => {
      mockDeliberationFindFirst.mockResolvedValue(null);
      const created = { id: "d2", eventId: "ev-1", status: "open", createdAt: new Date() };
      mockDeliberationCreate.mockResolvedValue(created);

      const result = await getOrCreateDeliberation("ev-1");

      expect(result).toEqual(created);
      expect(mockDeliberationCreate).toHaveBeenCalledWith({
        data: { eventId: "ev-1", status: "open" },
      });
    });

    it("propagates database errors when finding deliberation", async () => {
      mockDeliberationFindFirst.mockRejectedValue(new Error("Database error"));

      await expect(getOrCreateDeliberation("ev-1")).rejects.toThrow("Database error");
    });

    it("propagates database errors when creating deliberation", async () => {
      mockDeliberationFindFirst.mockResolvedValue(null);
      mockDeliberationCreate.mockRejectedValue(new Error("Create failed"));

      await expect(getOrCreateDeliberation("ev-1")).rejects.toThrow("Create failed");
    });
  });

  describe("closeDeliberation", () => {
    const eventWithTeamsAndCriteria = {
      id: "ev-1",
      teams: [{ id: "t1", name: "A" }, { id: "t2", name: "B" }],
      criteria: [{ id: "c1", weight: 1, scaleType: "SCALE_0_10" }],
      deliberations: [] as { id: string; status: string }[],
    };

    it("returns error when event not found", async () => {
      mockEventFindUnique.mockResolvedValue(null);

      const result = await closeDeliberation("ev-1");

      expect(result).toEqual({ error: "Event not found" });
      expect(mockDeliberationUpdate).not.toHaveBeenCalled();
      expect(mockRankingSnapshotCreate).not.toHaveBeenCalled();
    });

    it("returns error when deliberation already closed", async () => {
      mockEventFindUnique.mockResolvedValue({
        ...eventWithTeamsAndCriteria,
        deliberations: [{ id: "d1", status: "locked" }],
      });

      const result = await closeDeliberation("ev-1");

      expect(result).toEqual({ error: "Deliberation already closed" });
      expect(mockDeliberationUpdate).not.toHaveBeenCalled();
    });

    it("locks deliberation and creates ranking snapshot when event exists and not closed", async () => {
      mockEventFindUnique.mockResolvedValue(eventWithTeamsAndCriteria);
      mockGradeFindMany.mockResolvedValue([
        { teamId: "t1", criterionId: "c1", value: 8 },
        { teamId: "t2", criterionId: "c1", value: 5 },
      ]);
      mockDeliberationFindFirst
        .mockResolvedValueOnce({ id: "d1", eventId: "ev-1", status: "open" })
        .mockResolvedValueOnce({ id: "d1", eventId: "ev-1", status: "open" });
      mockDeliberationUpdate.mockResolvedValue(undefined);
      mockRankingSnapshotCreate.mockResolvedValue(undefined);

      const result = await closeDeliberation("ev-1");

      expect(result).toEqual({ data: { ok: true } });
      expect(mockComputeRanking).toHaveBeenCalled();
      expect(mockDeliberationUpdate).toHaveBeenCalledWith({
        where: { id: "d1" },
        data: { status: "locked", closedAt: expect.any(Date) },
      });
      expect(mockRankingSnapshotCreate).toHaveBeenCalledWith({
        data: {
          deliberationId: "d1",
          rankingsJson: expect.any(String),
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/supervisor/events/ev-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/jury");
    });

    it("creates deliberation if none exists before closing", async () => {
      mockEventFindUnique.mockResolvedValue(eventWithTeamsAndCriteria);
      mockGradeFindMany.mockResolvedValue([]);
      // findFirst is called after computing ranking to find the deliberation to close
      // Reset and set up mock to return null so the code creates a new deliberation
      mockDeliberationFindFirst.mockReset();
      mockDeliberationFindFirst.mockResolvedValue(null);
      const createdDeliberation = { id: "d-new", eventId: "ev-1", status: "open", createdAt: new Date() };
      mockDeliberationCreate.mockResolvedValue(createdDeliberation);
      mockDeliberationUpdate.mockResolvedValue(undefined);
      mockRankingSnapshotCreate.mockResolvedValue(undefined);

      const result = await closeDeliberation("ev-1");

      expect(result).toEqual({ data: { ok: true } });
      expect(mockDeliberationCreate).toHaveBeenCalledWith({
        data: { eventId: "ev-1", status: "open" },
      });
      expect(mockDeliberationUpdate).toHaveBeenCalledWith({
        where: { id: "d-new" },
        data: { status: "locked", closedAt: expect.any(Date) },
      });
    });

    it("propagates database errors when finding event", async () => {
      mockEventFindUnique.mockRejectedValue(new Error("Database connection error"));

      await expect(closeDeliberation("ev-1")).rejects.toThrow("Database connection error");
    });

    it("propagates database errors when creating deliberation", async () => {
      mockEventFindUnique.mockResolvedValue(eventWithTeamsAndCriteria);
      mockGradeFindMany.mockResolvedValue([]);
      mockDeliberationFindFirst.mockResolvedValue(null);
      mockDeliberationCreate.mockRejectedValue(new Error("Database constraint violation"));

      await expect(closeDeliberation("ev-1")).rejects.toThrow("Database constraint violation");
    });

    it("propagates database errors when updating deliberation", async () => {
      mockEventFindUnique.mockResolvedValue(eventWithTeamsAndCriteria);
      mockGradeFindMany.mockResolvedValue([]);
      mockDeliberationFindFirst.mockResolvedValue({ id: "d1", eventId: "ev-1", status: "open" });
      mockDeliberationUpdate.mockRejectedValue(new Error("Update failed"));

      await expect(closeDeliberation("ev-1")).rejects.toThrow("Update failed");
    });
  });

  describe("getRanking", () => {
    it("returns error when event not found", async () => {
      mockEventFindUnique.mockResolvedValue(null);

      const result = await getRanking("ev-1");

      expect(result).toEqual({ error: "Event not found" });
    });

    it("returns ranking and isLocked false when no locked deliberation", async () => {
      const event = {
        id: "ev-1",
        teams: [{ id: "t1", name: "A" }],
        criteria: [{ id: "c1", weight: 1, scaleType: "SCALE_0_10" }],
      };
      mockEventFindUnique.mockResolvedValue(event);
      mockGradeFindMany.mockResolvedValue([]);
      mockDeliberationFindFirst.mockResolvedValue(null);

      const result = await getRanking("ev-1");

      expect(result).toEqual({
        data: {
          ranking: mockComputeRanking(),
          isLocked: false,
        },
      });
      expect(mockComputeRanking).toHaveBeenCalledWith(
        [{ id: "t1", name: "A" }],
        [],
        event.criteria
      );
    });

    it("returns isLocked true when deliberation is locked", async () => {
      const event = {
        id: "ev-1",
        teams: [{ id: "t1", name: "A" }],
        criteria: [{ id: "c1", weight: 1, scaleType: "SCALE_0_10" }],
      };
      mockEventFindUnique.mockResolvedValue(event);
      mockGradeFindMany.mockResolvedValue([]);
      mockDeliberationFindFirst.mockResolvedValue({ id: "d1", status: "locked" });

      const result = await getRanking("ev-1");

      expect(result.data?.isLocked).toBe(true);
    });

    it("propagates database errors when finding event", async () => {
      mockEventFindUnique.mockRejectedValue(new Error("Database error"));

      await expect(getRanking("ev-1")).rejects.toThrow("Database error");
    });

    it("propagates database errors when finding grades", async () => {
      const event = {
        id: "ev-1",
        teams: [{ id: "t1", name: "A" }],
        criteria: [{ id: "c1", weight: 1, scaleType: "SCALE_0_10" }],
      };
      mockEventFindUnique.mockResolvedValue(event);
      mockGradeFindMany.mockRejectedValue(new Error("Grade query failed"));

      await expect(getRanking("ev-1")).rejects.toThrow("Grade query failed");
    });
  });
});

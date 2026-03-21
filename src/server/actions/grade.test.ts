import { describe, it, expect, vi, beforeEach } from "vitest";
import { upsertGrade } from "./grade";

const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args) }));

const mockCriterionFindUnique = vi.fn();
const mockJuryAssignmentFindUnique = vi.fn();
const mockGradeUpsert = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    criterion: { findUnique: (...args: unknown[]) => mockCriterionFindUnique(...args) },
    juryAssignment: { findUnique: (...args: unknown[]) => mockJuryAssignmentFindUnique(...args) },
    grade: { upsert: (...args: unknown[]) => mockGradeUpsert(...args) },
  },
}));

describe("grade actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCriterionFindUnique.mockResolvedValue({ scaleType: "SCALE_0_10" });
    mockJuryAssignmentFindUnique.mockResolvedValue({
      id: "ja-1",
      event: { deliberations: [] },
    });
    mockGradeUpsert.mockResolvedValue(undefined);
  });

  describe("upsertGrade", () => {
    const validPayload = {
      teamId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      criterionId: "clxxxxxxxxxxxxxxxxxxxxxxxxy",
      value: 5,
      comment: "Good",
    };

    it("returns data when payload is valid and deliberation is open", async () => {
      const result = await upsertGrade("ja-1", validPayload);

      expect(result).toEqual({ data: { ok: true } });
      expect(mockGradeUpsert).toHaveBeenCalledWith({
        where: {
          teamId_criterionId_juryAssignmentId: {
            teamId: validPayload.teamId,
            criterionId: validPayload.criterionId,
            juryAssignmentId: "ja-1",
          },
        },
        create: {
          teamId: validPayload.teamId,
          criterionId: validPayload.criterionId,
          juryAssignmentId: "ja-1",
          value: 5,
          comment: "Good",
        },
        update: { value: 5, comment: "Good" },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/jury");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/jury/teams");
    });

    it("returns error when jury assignment not found", async () => {
      mockJuryAssignmentFindUnique.mockResolvedValue(null);

      const result = await upsertGrade("ja-1", validPayload);

      expect(result).toEqual({ error: "Jury assignment not found" });
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("returns error when deliberation is locked", async () => {
      mockJuryAssignmentFindUnique.mockResolvedValue({
        id: "ja-1",
        event: { deliberations: [{ id: "d1", status: "locked" }] },
      });

      const result = await upsertGrade("ja-1", validPayload);

      expect(result).toEqual({ error: "Deliberation is closed; notes cannot be modified." });
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("returns error when value exceeds scale max (SCALE_0_5)", async () => {
      mockCriterionFindUnique.mockResolvedValue({ scaleType: "SCALE_0_5" });

      const result = await upsertGrade("ja-1", { ...validPayload, value: 10 });

      expect(result).toHaveProperty("error");
      expect((result as { error: Record<string, string[]> }).error.value).toBeDefined();
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("returns error when value is negative", async () => {
      const result = await upsertGrade("ja-1", { ...validPayload, value: -1 });

      expect(result).toHaveProperty("error");
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("returns error when payload fails schema (invalid cuid)", async () => {
      const result = await upsertGrade("ja-1", {
        teamId: "short",
        criterionId: validPayload.criterionId,
        value: 5,
      });

      expect(result).toHaveProperty("error");
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("accepts null comment", async () => {
      const result = await upsertGrade("ja-1", { ...validPayload, comment: null });

      expect(result).toEqual({ data: { ok: true } });
      expect(mockGradeUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ comment: null }),
          update: expect.objectContaining({ comment: null }),
        })
      );
    });

    it("uses scale max 20 for SCALE_0_20", async () => {
      mockCriterionFindUnique.mockResolvedValue({ scaleType: "SCALE_0_20" });

      const result = await upsertGrade("ja-1", { ...validPayload, value: 20 });

      expect(result).toEqual({ data: { ok: true } });
      expect(mockGradeUpsert).toHaveBeenCalled();
    });

    it("defaults to max 10 when criterion not found", async () => {
      mockCriterionFindUnique.mockResolvedValue(null);

      const result = await upsertGrade("ja-1", { ...validPayload, value: 10 });

      expect(result).toEqual({ data: { ok: true } });
      expect(mockGradeUpsert).toHaveBeenCalled();
    });

    it("returns error when value exceeds default max (10) when criterion not found", async () => {
      mockCriterionFindUnique.mockResolvedValue(null);

      const result = await upsertGrade("ja-1", { ...validPayload, value: 11 });

      expect(result).toHaveProperty("error");
      expect((result as { error: Record<string, string[]> }).error.value).toBeDefined();
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("returns error when comment exceeds max length (2000)", async () => {
      const longComment = "a".repeat(2001);
      const result = await upsertGrade("ja-1", { ...validPayload, comment: longComment });

      expect(result).toHaveProperty("error");
      expect(mockGradeUpsert).not.toHaveBeenCalled();
    });

    it("accepts comment at max length (2000)", async () => {
      const maxComment = "a".repeat(2000);
      const result = await upsertGrade("ja-1", { ...validPayload, comment: maxComment });

      expect(result).toEqual({ data: { ok: true } });
      expect(mockGradeUpsert).toHaveBeenCalled();
    });

    it("propagates database errors when finding criterion", async () => {
      mockCriterionFindUnique.mockRejectedValue(new Error("Database error"));

      await expect(upsertGrade("ja-1", validPayload)).rejects.toThrow("Database error");
    });

    it("propagates database errors when upserting grade", async () => {
      mockGradeUpsert.mockRejectedValue(new Error("Database constraint violation"));

      await expect(upsertGrade("ja-1", validPayload)).rejects.toThrow("Database constraint violation");
    });
  });
});

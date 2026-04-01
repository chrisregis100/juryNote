import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  getServerSession: vi.fn(async () => ({
    user: { role: "organizer" as const, id: "org-1", email: "o@test.com", name: "Org" },
  })),
  isOrganizerOrSupervisor: () => true,
  isJurySession: () => false,
}));

import { createEvent, createCriterion, createTeam, generateJuryPin } from "./event";

const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args) }));

const mockEventCreate = vi.fn();
const mockCriterionCreate = vi.fn();
const mockTeamCreate = vi.fn();
const mockJuryAssignmentCreate = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    event: { create: (...args: unknown[]) => mockEventCreate(...args) },
    criterion: { create: (...args: unknown[]) => mockCriterionCreate(...args) },
    team: { create: (...args: unknown[]) => mockTeamCreate(...args) },
    juryAssignment: { create: (...args: unknown[]) => mockJuryAssignmentCreate(...args) },
  },
}));

function formData(entries: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    if (Array.isArray(v)) fd.set(k, JSON.stringify(v));
    else fd.set(k, v);
  }
  return fd;
}

describe("event actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createEvent", () => {
    it("returns data when validation passes and db creates event", async () => {
      const event = { id: "ev-1", name: "Hack 2025", slug: "hack-2025" };
      mockEventCreate.mockResolvedValue(event);

      const form = formData({ name: "Hack 2025", slug: "hack-2025" });
      const result = await createEvent(form);

      expect(result).toEqual({ data: event });
      expect(mockEventCreate).toHaveBeenCalledWith({
        data: { name: "Hack 2025", slug: "hack-2025", organizerId: "org-1" },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events");
    });

    it("returns error when name is missing", async () => {
      const form = formData({ name: "", slug: "hack-2025" });
      const result = await createEvent(form);

      expect(result).toHaveProperty("error");
      expect((result as { error: Record<string, string[]> }).error).toHaveProperty("name");
      expect(mockEventCreate).not.toHaveBeenCalled();
    });

    it("returns error when slug is invalid", async () => {
      const form = formData({ name: "Hack", slug: "UPPER_case" });
      const result = await createEvent(form);

      expect(result).toHaveProperty("error");
      expect((result as { error: Record<string, string[]> }).error).toHaveProperty("slug");
      expect(mockEventCreate).not.toHaveBeenCalled();
    });

    it("returns error when FormData fields are missing", async () => {
      const form = new FormData();
      form.set("name", "Hack");
      // slug is missing

      const result = await createEvent(form);

      expect(result).toHaveProperty("error");
      expect(mockEventCreate).not.toHaveBeenCalled();
    });

    it("returns error when name is too long", async () => {
      const longName = "a".repeat(201);
      const form = formData({ name: longName, slug: "hack-2025" });
      const result = await createEvent(form);

      expect(result).toHaveProperty("error");
      expect(mockEventCreate).not.toHaveBeenCalled();
    });

    it("propagates db errors", async () => {
      mockEventCreate.mockRejectedValue(new Error("DB error"));

      const form = formData({ name: "Hack", slug: "hack-2025" });
      await expect(createEvent(form)).rejects.toThrow("DB error");
    });
  });

  describe("createCriterion", () => {
    it("returns data when validation passes", async () => {
      const criterion = {
        id: "cr-1",
        eventId: "ev-1",
        name: "Innovation",
        weight: 2,
        scaleType: "SCALE_0_10",
        order: 0,
      };
      mockCriterionCreate.mockResolvedValue(criterion);

      const form = formData({
        name: "Innovation",
        weight: "2",
        scaleType: "SCALE_0_10",
        order: "0",
      });
      const result = await createCriterion("ev-1", form);

      expect(result).toEqual({ data: criterion });
      expect(mockCriterionCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          name: "Innovation",
          weight: 2,
          scaleType: "SCALE_0_10",
          order: 0,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events/ev-1");
    });

    it("returns error when scaleType is invalid", async () => {
      const form = formData({
        name: "Innovation",
        weight: "2",
        scaleType: "INVALID",
        order: "0",
      });
      const result = await createCriterion("ev-1", form);

      expect(result).toHaveProperty("error");
      expect(mockCriterionCreate).not.toHaveBeenCalled();
    });

    it("returns error when weight is not positive", async () => {
      const form = formData({
        name: "Innovation",
        weight: "0",
        scaleType: "SCALE_0_10",
        order: "0",
      });
      const result = await createCriterion("ev-1", form);

      expect(result).toHaveProperty("error");
      expect(mockCriterionCreate).not.toHaveBeenCalled();
    });

    it("returns error when FormData fields are missing", async () => {
      const form = new FormData();
      form.set("name", "Innovation");
      // weight and scaleType are missing

      const result = await createCriterion("ev-1", form);

      expect(result).toHaveProperty("error");
      expect(mockCriterionCreate).not.toHaveBeenCalled();
    });

    it("handles invalid weight format", async () => {
      const form = formData({
        name: "Innovation",
        weight: "not-a-number",
        scaleType: "SCALE_0_10",
        order: "0",
      });
      const result = await createCriterion("ev-1", form);

      expect(result).toHaveProperty("error");
      expect(mockCriterionCreate).not.toHaveBeenCalled();
    });

    it("propagates database errors", async () => {
      mockCriterionCreate.mockRejectedValue(new Error("Database constraint violation"));

      const form = formData({
        name: "Innovation",
        weight: "2",
        scaleType: "SCALE_0_10",
        order: "0",
      });
      await expect(createCriterion("ev-1", form)).rejects.toThrow("Database constraint violation");
    });
  });

  describe("createTeam", () => {
    it("returns data with members from JSON", async () => {
      const team = { id: "tm-1", eventId: "ev-1", name: "Team A", membersJson: "[]" };
      mockTeamCreate.mockResolvedValue(team);

      const form = formData({ name: "Team A", members: '["Alice","Bob"]' });
      const result = await createTeam("ev-1", form);

      expect(result).toEqual({ data: team });
      expect(mockTeamCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          name: "Team A",
          membersJson: '["Alice","Bob"]',
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events/ev-1");
    });

    it("handles members as comma-separated when JSON parse fails", async () => {
      mockTeamCreate.mockResolvedValue({ id: "tm-1", eventId: "ev-1", name: "Team A", membersJson: "[]" });

      const form = formData({ name: "Team A", members: "Alice, Bob" });
      await createTeam("ev-1", form);

      expect(mockTeamCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          name: "Team A",
          membersJson: '["Alice","Bob"]',
        },
      });
    });

    it("returns error when name is empty", async () => {
      const form = formData({ name: "" });
      const result = await createTeam("ev-1", form);

      expect(result).toHaveProperty("error");
      expect(mockTeamCreate).not.toHaveBeenCalled();
    });

    it("handles empty members string", async () => {
      mockTeamCreate.mockResolvedValue({ id: "tm-1", eventId: "ev-1", name: "Team A", membersJson: "[]" });

      const form = formData({ name: "Team A", members: "" });
      await createTeam("ev-1", form);

      expect(mockTeamCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          name: "Team A",
          membersJson: "[]",
        },
      });
    });

    it("handles null members in FormData", async () => {
      mockTeamCreate.mockResolvedValue({ id: "tm-1", eventId: "ev-1", name: "Team A", membersJson: "[]" });

      const form = new FormData();
      form.set("name", "Team A");
      // members is not set (null)

      await createTeam("ev-1", form);

      expect(mockTeamCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          name: "Team A",
          membersJson: "[]",
        },
      });
    });

    it("propagates database errors", async () => {
      mockTeamCreate.mockRejectedValue(new Error("Database error"));

      const form = formData({ name: "Team A" });
      await expect(createTeam("ev-1", form)).rejects.toThrow("Database error");
    });
  });

  describe("generateJuryPin", () => {
    it("returns pin data with id, pinCode, magicToken", async () => {
      const assignment = {
        id: "ja-1",
        eventId: "ev-1",
        pinCode: "123456",
        magicToken: "magic-xyz",
        expiresAt: new Date(),
      };
      mockJuryAssignmentCreate.mockResolvedValue(assignment);

      const result = await generateJuryPin("ev-1");

      expect(result.data).toHaveProperty("id", "ja-1");
      expect(result.data).toHaveProperty("pinCode", "123456");
      expect(result.data).toHaveProperty("magicToken", "magic-xyz");
      expect(mockJuryAssignmentCreate).toHaveBeenCalledWith({
        data: {
          eventId: "ev-1",
          pinCode: expect.stringMatching(/^\d{6}$/),
          expiresAt: expect.any(Date),
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events/ev-1");
    });

    it("generates 6-digit pin", async () => {
      mockJuryAssignmentCreate.mockImplementation(({ data }: { data: { pinCode: string } }) =>
        Promise.resolve({ id: "ja-1", pinCode: data.pinCode, magicToken: "t", expiresAt: new Date() })
      );

      await generateJuryPin("ev-1");

      const call = mockJuryAssignmentCreate.mock.calls[0][0];
      expect(call.data.pinCode).toMatch(/^\d{6}$/);
      const num = parseInt(call.data.pinCode, 10);
      expect(num).toBeGreaterThanOrEqual(100000);
      expect(num).toBeLessThanOrEqual(999999);
    });

    it("propagates database errors", async () => {
      mockJuryAssignmentCreate.mockRejectedValue(new Error("Database error"));

      await expect(generateJuryPin("ev-1")).rejects.toThrow("Database error");
    });
  });
});

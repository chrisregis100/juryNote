import { describe, it, expect } from "vitest";
import {
  createEventSchema,
  createCriterionSchema,
  createTeamSchema,
  juryPinSchema,
} from "./event";

describe("createEventSchema", () => {
  it("accepts valid name and slug", () => {
    const result = createEventSchema.safeParse({
      name: "Hackathon 2025",
      slug: "hackathon-2025",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createEventSchema.safeParse({
      name: "",
      slug: "ok",
    });
    expect(result.success).toBe(false);
  });

  it("rejects slug with invalid chars", () => {
    const result = createEventSchema.safeParse({
      name: "Ok",
      slug: "invalid slug!",
    });
    expect(result.success).toBe(false);
  });
});

describe("createCriterionSchema", () => {
  it("accepts valid criterion", () => {
    const result = createCriterionSchema.safeParse({
      name: "Innovation",
      weight: 2,
      scaleType: "SCALE_0_10",
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero or negative weight", () => {
    expect(createCriterionSchema.safeParse({ name: "X", weight: 0, scaleType: "SCALE_0_10" }).success).toBe(false);
    expect(createCriterionSchema.safeParse({ name: "X", weight: -1, scaleType: "SCALE_0_10" }).success).toBe(false);
  });
});

describe("createTeamSchema", () => {
  it("accepts name only", () => {
    const result = createTeamSchema.safeParse({ name: "Team 1" });
    expect(result.success).toBe(true);
  });

  it("accepts members array", () => {
    const result = createTeamSchema.safeParse({
      name: "Team 1",
      members: ["Alice", "Bob"],
    });
    expect(result.success).toBe(true);
  });
});

describe("juryPinSchema", () => {
  it("accepts 6 digits", () => {
    expect(juryPinSchema.safeParse({ pinCode: "123456" }).success).toBe(true);
  });

  it("rejects non-6 length", () => {
    expect(juryPinSchema.safeParse({ pinCode: "12345" }).success).toBe(false);
    expect(juryPinSchema.safeParse({ pinCode: "1234567" }).success).toBe(false);
  });

  it("rejects non-numeric", () => {
    expect(juryPinSchema.safeParse({ pinCode: "12345a" }).success).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { upsertGradeSchema, gradeValueSchema } from "./grade";

describe("upsertGradeSchema", () => {
  it("accepts valid payload", () => {
    const result = upsertGradeSchema.safeParse({
      teamId: "clxx123456789012345678901",
      criterionId: "clxx123456789012345678902",
      value: 7,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional comment", () => {
    const result = upsertGradeSchema.safeParse({
      teamId: "clxx123456789012345678901",
      criterionId: "clxx123456789012345678902",
      value: 5,
      comment: "Good pitch",
    });
    expect(result.success).toBe(true);
  });

  it("rejects value out of 0-20", () => {
    expect(
      upsertGradeSchema.safeParse({
        teamId: "clxx123456789012345678901",
        criterionId: "clxx123456789012345678902",
        value: -1,
      }).success
    ).toBe(false);
    expect(
      upsertGradeSchema.safeParse({
        teamId: "clxx123456789012345678901",
        criterionId: "clxx123456789012345678902",
        value: 21,
      }).success
    ).toBe(false);
  });
});

describe("gradeValueSchema", () => {
  it("SCALE_0_5 accepts 0-5", () => {
    const schema = gradeValueSchema("SCALE_0_5");
    expect(schema.safeParse(0).success).toBe(true);
    expect(schema.safeParse(5).success).toBe(true);
    expect(schema.safeParse(6).success).toBe(false);
  });

  it("SCALE_0_10 accepts 0-10", () => {
    const schema = gradeValueSchema("SCALE_0_10");
    expect(schema.safeParse(10).success).toBe(true);
    expect(schema.safeParse(11).success).toBe(false);
  });
});

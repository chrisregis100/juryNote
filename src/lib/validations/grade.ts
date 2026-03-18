import { z } from "zod";

const scaleTypeSchema = z.enum(["SCALE_0_5", "SCALE_0_10", "SCALE_0_20"]);

const scaleMaxMap: Record<string, number> = {
  SCALE_0_5: 5,
  SCALE_0_10: 10,
  SCALE_0_20: 20,
};

export function gradeValueSchema(scaleType: string): z.ZodNumber {
  const max = scaleMaxMap[scaleType] ?? 10;
  return z.number().int().min(0).max(max);
}

export const upsertGradeSchema = z.object({
  teamId: z.string().cuid(),
  criterionId: z.string().cuid(),
  value: z.number().int().min(0).max(20), // max 20 for any scale; refine per criterion in action
  comment: z.string().max(2000).optional().nullable(),
});

export type UpsertGradeInput = z.infer<typeof upsertGradeSchema>;

import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export const updateEventSchema = createEventSchema.partial();

export const createCriterionSchema = z.object({
  name: z.string().min(1).max(200),
  weight: z.number().positive(),
  scaleType: z.enum(["SCALE_0_5", "SCALE_0_10", "SCALE_0_20"]),
  order: z.number().int().min(0).optional(),
});

export const updateCriterionSchema = createCriterionSchema.partial();

export const createTeamSchema = z.object({
  name: z.string().min(1).max(200),
  members: z.array(z.string().max(200)).optional().default([]),
});

export const createTeamsBulkSchema = z.object({
  teams: z.array(createTeamSchema),
});

export const juryPinSchema = z.object({
  pinCode: z.string().length(6).regex(/^\d{6}$/),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateCriterionInput = z.infer<typeof createCriterionSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JuryPinInput = z.infer<typeof juryPinSchema>;

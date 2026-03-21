import { z } from "zod";

export const invitedParticipantSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  profession: z.string().max(200).optional().or(z.literal("")),
});

export const createInvitedParticipantSchema = invitedParticipantSchema.extend({
  eventId: z.string().min(1),
});

export const updateInvitedParticipantSchema = invitedParticipantSchema.partial().extend({
  id: z.string().min(1),
});

export const bulkImportInvitedParticipantsSchema = z.object({
  eventId: z.string().min(1),
  participants: z.array(invitedParticipantSchema),
});

export const checkinParticipantSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  profession: z.string().min(1).max(200),
  photoConsent: z.boolean().refine((val) => val === true, {
    message: "Le consentement photo est requis",
  }),
  invitedParticipantId: z.string().optional(),
  answers: z
    .array(
      z.object({
        customQuestionId: z.string().min(1),
        value: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const updateCheckinParticipantSchema = checkinParticipantSchema.partial().extend({
  id: z.string().min(1),
});

export const questionTypeSchema = z.enum(["TEXT", "MULTIPLE_CHOICE", "YES_NO", "DATE", "NUMBER"]);

const customQuestionBaseSchema = z.object({
  eventId: z.string().min(1),
  label: z.string().min(1).max(500),
  type: questionTypeSchema,
  options: z.array(z.string().min(1).max(200)).optional(),
  isRequired: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const createCustomQuestionSchema = customQuestionBaseSchema.superRefine(
  (data, ctx) => {
    if (data.type === "MULTIPLE_CHOICE" && (!data.options || data.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Les options sont requises pour les questions à choix multiple",
        path: ["options"],
      });
    }
  }
);

export const updateCustomQuestionSchema = customQuestionBaseSchema
  .partial()
  .extend({ id: z.string().min(1) })
  .superRefine((data, ctx) => {
    if (data.type === "MULTIPLE_CHOICE" && (!data.options || data.options.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Les options sont requises pour les questions à choix multiple",
        path: ["options"],
      });
    }
  });

export const checkinLinkSchema = z.object({
  eventId: z.string().min(1),
  isActive: z.boolean().default(true),
});

export type InvitedParticipantInput = z.infer<typeof invitedParticipantSchema>;
export type CreateInvitedParticipantInput = z.infer<typeof createInvitedParticipantSchema>;
export type UpdateInvitedParticipantInput = z.infer<typeof updateInvitedParticipantSchema>;
export type BulkImportInvitedParticipantsInput = z.infer<typeof bulkImportInvitedParticipantsSchema>;
export type CheckinParticipantInput = z.infer<typeof checkinParticipantSchema>;
export type UpdateCheckinParticipantInput = z.infer<typeof updateCheckinParticipantSchema>;
export type CreateCustomQuestionInput = z.infer<typeof createCustomQuestionSchema>;
export type UpdateCustomQuestionInput = z.infer<typeof updateCustomQuestionSchema>;
export type CheckinLinkInput = z.infer<typeof checkinLinkSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;

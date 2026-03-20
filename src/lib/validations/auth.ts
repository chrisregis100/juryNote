import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  name: z.string().min(1, "Le nom est requis"),
});

export const magicLinkSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

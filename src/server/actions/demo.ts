"use server";

import { z } from "zod";
import { sendBrevoTransactionalEmail } from "@/lib/email/brevo";

const demoRequestSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  organisation: z.string().min(2, "L'organisation doit contenir au moins 2 caractères"),
  message: z.string().optional(),
});

export async function submitDemoRequest(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      organisation: formData.get("organisation")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
    };

    const result = demoRequestSchema.safeParse(rawData);

    if (!result.success) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
    }

    const { name, email, organisation, message } = result.data;

    const subject = `[Demande de démo] ${name} — ${organisation}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle demande de démo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 32px; background-color: #111827; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">Nouvelle demande de démo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 40%;">Nom</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Email</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeHtml(email)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Organisation</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827;">${escapeHtml(organisation)}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 12px; font-weight: 600; color: #374151; vertical-align: top;">Message</td>
                  <td style="padding: 12px; color: #111827; white-space: pre-wrap;">${escapeHtml(message)}</td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Envoyé depuis le formulaire de démo JuryFlow
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `Nouvelle demande de démo

Nom: ${name}
Email: ${email}
Organisation: ${organisation}
${message ? `Message: ${message}` : ""}

Envoyé depuis le formulaire de démo JuryFlow`;

    await sendBrevoTransactionalEmail({
      toEmail: "contact@juryflow.fr",
      subject,
      htmlContent,
      textContent,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de la demande.";
    return { success: false, error: errorMessage };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

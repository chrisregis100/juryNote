/**
 * Brevo (ex-Sendinblue) — envoi d’e-mails transactionnels via l’API REST v3.
 * @see https://developers.brevo.com/reference/sendtransacemail
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export interface SendBrevoTransactionalEmailParams {
  toEmail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

function getBrevoConfig(): { apiKey: string; senderEmail: string; senderName: string } | null {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) return null;

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() ??
    process.env.SMTP_FROM?.trim() ??
    "";

  if (!senderEmail) {
    throw new Error(
      "Brevo est configuré (BREVO_API_KEY) mais BREVO_SENDER_EMAIL (ou SMTP_FROM) est manquant."
    );
  }

  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() ?? "JuryFlow";

  return { apiKey, senderEmail, senderName };
}

export function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY?.trim());
}

export async function sendBrevoTransactionalEmail(
  params: SendBrevoTransactionalEmailParams
): Promise<void> {
  const config = getBrevoConfig();
  if (!config) {
    throw new Error("BREVO_API_KEY n’est pas défini.");
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: config.senderName,
        email: config.senderEmail,
      },
      to: [{ email: params.toEmail }],
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Brevo API error ${res.status}: ${body.slice(0, 500)}`
    );
  }
}

// ─── Resources Email ──────────────────────────────────────────────────────────

interface UnlockedResource {
  id: string;
  type: "API_CREDENTIAL" | "LINK" | "TEXT_INFO";
  title: string;
  description?: string | null;
  url?: string | null;
  fileName?: string | null;
  content?: string | null;
  credentialValue?: string | null;
}

function getResourceTypeLabel(type: UnlockedResource["type"]): string {
  switch (type) {
    case "API_CREDENTIAL":
      return "Clé API";
    case "LINK":
      return "Lien";
    case "TEXT_INFO":
      return "Information";
    default:
      return "Ressource";
  }
}

function getResourceTypeColor(type: UnlockedResource["type"]): string {
  switch (type) {
    case "API_CREDENTIAL":
      return "#9333ea"; // purple-600
    case "LINK":
      return "#2563eb"; // blue-600
    case "TEXT_INFO":
      return "#16a34a"; // green-600
    default:
      return "#6b7280"; // gray-500
  }
}

function renderResourceCard(resource: UnlockedResource): string {
  const typeLabel = getResourceTypeLabel(resource.type);
  const typeColor = getResourceTypeColor(resource.type);

  let contentHtml = "";

  if (resource.type === "API_CREDENTIAL" && resource.credentialValue) {
    contentHtml = `
      <div style="margin-top: 12px; padding: 12px; background-color: #f3f4f6; border-radius: 6px; border: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151; font-weight: 500;">Votre clé API :</p>
        <code style="display: block; padding: 10px; background-color: #1f2937; color: #10b981; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, monospace; font-size: 13px; border-radius: 4px; word-break: break-all;">${escapeHtml(resource.credentialValue)}</code>
      </div>
    `;
  } else if (resource.type === "LINK" && resource.url) {
    const linkText = resource.fileName || resource.title;
    contentHtml = `
      <div style="margin-top: 12px;">
        <a href="${escapeHtml(resource.url)}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">${escapeHtml(linkText)}</a>
      </div>
    `;
  } else if (resource.type === "TEXT_INFO" && resource.content) {
    contentHtml = `
      <div style="margin-top: 12px; padding: 12px; background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #1f2937; white-space: pre-wrap;">${escapeHtml(resource.content)}</p>
      </div>
    `;
  }

  return `
    <div style="margin-bottom: 24px; padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="display: inline-block; padding: 4px 12px; background-color: ${typeColor}20; color: ${typeColor}; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px;">
          ${typeLabel}
        </span>
      </div>
      <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #111827;">${escapeHtml(resource.title)}</h3>
      ${resource.description ? `<p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">${escapeHtml(resource.description)}</p>` : ""}
      ${contentHtml}
    </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendResourcesEmail(params: {
  to: string;
  participantName: string;
  eventName: string;
  resources: UnlockedResource[];
}): Promise<{ success: boolean; error?: string }> {
  const config = getBrevoConfig();
  if (!config) {
    return { success: false, error: "BREVO_API_KEY n'est pas défini." };
  }

  const subject = `Vos ressources - ${params.eventName}`;

  const resourcesHtml = params.resources.map(renderResourceCard).join("");

  const textContent = `Bonjour ${params.participantName},\n\nVoici les ressources disponibles pour l'événement "${params.eventName}":\n\n${params.resources.map(r => `- ${r.title} (${getResourceTypeLabel(r.type)})${r.type === "API_CREDENTIAL" && r.credentialValue ? `: ${r.credentialValue}` : ""}${r.type === "LINK" && r.url ? `: ${r.url}` : ""}${r.type === "TEXT_INFO" && r.content ? `: ${r.content}` : ""}`).join("\n")}\n\nCes ressources vous ont été attribuées suite à votre check-in. Conservez cet email précieusement.`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 32px; background-color: #111827; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">Vos ressources</h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; color: #9ca3af;">${escapeHtml(params.eventName)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Bonjour <strong>${escapeHtml(params.participantName)}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Voici les ressources qui vous ont été attribuées pour cet événement :
              </p>
              ${resourcesHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                  Ces ressources vous ont été attribuées suite à votre check-in. Conservez cet email précieusement.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Envoyé via JuryFlow
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

  try {
    await sendBrevoTransactionalEmail({
      toEmail: params.to,
      subject,
      htmlContent,
      textContent,
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Échec de l'envoi de l'email";
    return { success: false, error: errorMessage };
  }
}

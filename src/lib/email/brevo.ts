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

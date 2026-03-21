/**
 * Brevo — SMS transactionnels (OTP, rappels, etc.).
 * Les liens magiques organisateur sont envoyés par e-mail ; ce module sert aux cas où un SMS est requis.
 * @see https://developers.brevo.com/reference/sendtransacsms
 */

const BREVO_SMS_API_URL = "https://api.brevo.com/v3/transactionalSMS/sms";

export interface SendBrevoTransactionalSmsParams {
  /** Numéro au format international, ex. +33612345678 */
  recipient: string;
  content: string;
}

export function isBrevoSmsConfigured(): boolean {
  return Boolean(
    process.env.BREVO_API_KEY?.trim() && process.env.BREVO_SMS_SENDER?.trim()
  );
}

export async function sendBrevoTransactionalSms(
  params: SendBrevoTransactionalSmsParams
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const sender = process.env.BREVO_SMS_SENDER?.trim();

  if (!apiKey) {
    throw new Error("BREVO_API_KEY n’est pas défini.");
  }
  if (!sender) {
    throw new Error(
      "BREVO_SMS_SENDER est requis (nom d’expéditeur SMS enregistré dans Brevo)."
    );
  }

  const res = await fetch(BREVO_SMS_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      recipient: params.recipient,
      content: params.content,
      type: "transactional",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo SMS API error ${res.status}: ${body.slice(0, 500)}`);
  }
}

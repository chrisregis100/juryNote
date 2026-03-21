import { createHmac, timingSafeEqual } from "crypto";

export const JURY_COOKIE_NAME = "jury_session";
export const JURY_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

interface JuryPayload {
  id: string;
  role: "jury";
  eventId: string;
  juryAssignmentId: string;
  displayName: string | null;
  exp: number; // ms timestamp
}

function getSecret(): string {
  return (
    process.env.BETTER_AUTH_SECRET ??
    "dev-secret-please-set-BETTER_AUTH_SECRET"
  );
}

function sign(payload: JuryPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function createJuryToken(
  payload: Omit<JuryPayload, "exp">
): string {
  return sign({ ...payload, exp: Date.now() + JURY_MAX_AGE * 1000 });
}

export function verifyJuryToken(
  token: string
): Omit<JuryPayload, "exp"> | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const data = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  const expected = createHmac("sha256", getSecret())
    .update(data)
    .digest("base64url");

  try {
    const expectedBuf = Buffer.from(expected);
    const sigBuf = Buffer.from(sig);
    if (
      expectedBuf.length !== sigBuf.length ||
      !timingSafeEqual(expectedBuf, sigBuf)
    ) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString()
    ) as JuryPayload;
    if (payload.exp < Date.now()) return null;
    const { exp: _exp, ...rest } = payload;
    return rest;
  } catch {
    return null;
  }
}

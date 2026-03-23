export const JURY_COOKIE_NAME = "jury_session";
export const JURY_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

interface JuryPayload {
  id: string;
  role: "jury";
  eventId: string;
  juryAssignmentId: string;
  displayName: string | null;
  isPresident: boolean;
  exp: number; // ms timestamp
}

function getSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET environment variable must be set");
  return secret;
}

function uint8ArrayToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToUint8Array(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmacSha256Base64url(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return uint8ArrayToBase64url(new Uint8Array(signature));
}

async function sign(payload: JuryPayload): Promise<string> {
  const enc = new TextEncoder();
  const data = uint8ArrayToBase64url(enc.encode(JSON.stringify(payload)));
  const sig = await hmacSha256Base64url(getSecret(), data);
  return `${data}.${sig}`;
}

export async function createJuryToken(
  payload: Omit<JuryPayload, "exp">
): Promise<string> {
  return sign({ ...payload, exp: Date.now() + JURY_MAX_AGE * 1000 });
}

export async function verifyJuryToken(
  token: string
): Promise<Omit<JuryPayload, "exp"> | null> {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const data = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  const expected = await hmacSha256Base64url(getSecret(), data);

  const enc = new TextEncoder();
  if (!timingSafeEqual(enc.encode(expected), enc.encode(sig))) return null;

  try {
    const dec = new TextDecoder();
    const payload = JSON.parse(dec.decode(base64urlToUint8Array(data))) as JuryPayload;
    if (payload.exp < Date.now()) return null;
    const { exp: expTimestamp, ...rest } = payload;
    void expTimestamp;
    return rest;
  } catch {
    return null;
  }
}

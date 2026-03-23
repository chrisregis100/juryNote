import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey(salt: Buffer): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) throw new Error("ENCRYPTION_KEY environment variable is not set");
  return scryptSync(rawKey, salt, 32);
}

export function encrypt(plaintext: string): string {
  const salt = randomBytes(16);
  const key = getEncryptionKey(salt);
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [salt, iv, tag, encrypted].map((b) => b.toString("base64")).join(":");
}

export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(":");
  if (parts.length !== 4) throw new Error("Invalid encrypted value format");
  const [saltB64, ivB64, tagB64, encryptedB64] = parts;
  const salt = Buffer.from(saltB64, "base64");
  const key = getEncryptionKey(salt);
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final("utf8");
}

export function isEncrypted(value: string): boolean {
  return value.split(":").length === 4;
}

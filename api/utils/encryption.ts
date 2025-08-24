/**
 * Encryption utilities using Node.js crypto module
 * Provides functions to encrypt text and generate encryption keys
 */

import * as crypto from "crypto";

export interface EncryptionResult {
  encryptedData: string;
  keyBase64: string;
}

/**
 * Generates a new encryption key using AES-256-GCM
 * @returns Base64 encoded encryption key
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = crypto.randomBytes(32); // 256 bits = 32 bytes
  return key.toString("base64");
}

/**
 * Encrypts text using AES-256-GCM with a new encryption key
 * @param text - The text to encrypt
 * @returns Object containing encrypted data and encryption key
 */
export async function encryptTextWithNewKey(
  text: string
): Promise<EncryptionResult> {
  const keyBase64 = await generateEncryptionKey();
  const encryptedData = await encryptTextWithKey(text, keyBase64);

  return {
    encryptedData,
    keyBase64,
  };
}

/**
 * Encrypts text using an existing encryption key
 * @param text - The text to encrypt
 * @param keyBase64 - Base64 encoded encryption key
 * @returns Encrypted data as base64 string
 */
export async function encryptTextWithKey(
  text: string,
  keyBase64: string
): Promise<string> {
  const key = Buffer.from(keyBase64, "base64");
  const iv = crypto.randomBytes(12); // 96 bits for GCM

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Combine IV + encrypted data + auth tag
  const combined = Buffer.concat([
    iv,
    Buffer.from(encrypted, "base64"),
    authTag,
  ]);
  return combined.toString("base64");
}

/**
 * Decrypts text using an encryption key
 * @param encryptedDataBase64 - Base64 encoded encrypted data
 * @param keyBase64 - Base64 encoded encryption key
 * @returns Decrypted text
 */
export async function decryptText(
  encryptedDataBase64: string,
  keyBase64: string
): Promise<string> {
  const key = Buffer.from(keyBase64, "base64");
  const combined = Buffer.from(encryptedDataBase64, "base64");

  // Extract IV (first 12 bytes), auth tag (last 16 bytes), and encrypted data
  const iv = combined.slice(0, 12);
  const authTag = combined.slice(-16);
  const encryptedData = combined.slice(12, -16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encryption utilities using Web Crypto API
 * Provides functions to encrypt text and generate encryption keys
 */

export interface EncryptionResult {
  encryptedData: string;
  keyBase64: string;
}

/**
 * Generates a new encryption key using AES-GCM
 * @returns Base64 encoded encryption key
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

/**
 * Encrypts text using AES-GCM with a new encryption key
 * @param text - The text to encrypt
 * @returns Object containing encrypted data and encryption key
 */
export async function encryptTextWithNewKey(
  text: string
): Promise<EncryptionResult> {
  // Generate a new encryption key
  const keyBase64 = await generateEncryptionKey();

  // Convert base64 key back to CryptoKey
  const keyData = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Generate a random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert text to Uint8Array
  const textEncoder = new TextEncoder();
  const textData = textEncoder.encode(text);

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    textData
  );

  // Combine IV and encrypted data, then encode as base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return {
    encryptedData: btoa(String.fromCharCode(...combined)),
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
  // Convert base64 key back to CryptoKey
  const keyData = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Convert text to Uint8Array
  const textEncoder = new TextEncoder();
  const textData = textEncoder.encode(text);

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    textData
  );

  // Combine IV and encrypted data, then encode as base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);

  return btoa(String.fromCharCode(...combined));
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
  // Convert base64 key back to CryptoKey
  const keyData = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  // Convert base64 data back to Uint8Array
  const combined = Uint8Array.from(atob(encryptedDataBase64), (c) =>
    c.charCodeAt(0)
  );

  // Extract IV (first 12 bytes) and encrypted data
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedData
  );

  // Convert back to string
  const textDecoder = new TextDecoder();
  return textDecoder.decode(decryptedData);
}

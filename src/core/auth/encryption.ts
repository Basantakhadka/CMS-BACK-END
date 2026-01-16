import * as crypto from "crypto";

// Use a 32-byte key for AES-256
const IV_LENGTH = 16; // AES requires a 16-byte IV

// Derive a 256-bit key from the string
const key = crypto.createHash("sha256").update(process.env.ENCRYPTION_KEY || 'hg+iOKO4FtY4z7/vbg66jxNcaDuDOkpAFe5i9JBcTNk=').digest();

// Encrypt function
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);  // Generate random IV
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Return IV and encrypted text concatenated with ':'
    return `${iv.toString("base64")}:${encrypted}`;
}

/// Decrypt function with improved error handling
export function decrypt(encrypted: string): string {
    // Split the input string into IV and encrypted text
    const [iv, encryptedText] = encrypted.split(":");

    // Ensure both the IV and encryptedText exist and are not empty
    if (!iv || !encryptedText) {
        console.error("Error: Invalid encrypted string format. Make sure it contains both IV and encrypted data separated by ':'");
        throw new Error("Invalid encrypted string format");
    }

    try {
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "base64"));

        let decrypted = decipher.update(encryptedText, "base64", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Decryption failed");
    }
}
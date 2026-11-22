import crypto from "crypto";

// Simulated CMI (Centre Monétaire Interbancaire) or credit card gateway webhook verification
// In production, verify HMAC signature or gateway payload token.
export function verifyPaymentWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  const expected = Buffer.from(digest, "hex");
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && crypto.timingSafeEqual(expected, received);
}

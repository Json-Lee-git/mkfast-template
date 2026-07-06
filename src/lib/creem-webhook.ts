/**
 * Shared Creem webhook verification utility.
 *
 * Used by both the webhook route handler (report checkout / manual audit)
 * and the Creem payment provider (subscription lifecycle events). Having a
 * single implementation avoids drift between the two call sites.
 *
 * Uses Web Crypto API (not Node crypto) for Cloudflare Workers compatibility.
 */

/**
 * Constant-time string comparison to prevent timing attacks on HMAC digests.
 */
function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Verify a Creem webhook signature using HMAC-SHA256.
 *
 * @param payload   Raw webhook request body.
 * @param signature Expected signature from the `creem-signature` header.
 * @param secret    Creem webhook secret (CREEM_WEBHOOK_SECRET).
 * @throws          If the signature is missing or does not match.
 */
export async function verifyCreemWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<void> {
  if (!signature) {
    throw new Error('Missing Creem webhook signature');
  }

  if (!secret) {
    throw new Error('CREEM_WEBHOOK_SECRET is not configured');
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  const computed = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (!constantTimeEqual(computed, signature.trim().toLowerCase())) {
    throw new Error('Invalid Creem webhook signature');
  }
}

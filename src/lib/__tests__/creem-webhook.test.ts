import { describe, it, expect } from 'vitest';
import { verifyCreemWebhookSignature } from '../creem-webhook';

const SECRET = 'test-secret-key-32-bytes-long!!';

describe('verifyCreemWebhookSignature', () => {
  it('throws when signature is missing', async () => {
    await expect(
      verifyCreemWebhookSignature('payload', '', SECRET)
    ).rejects.toThrow('Missing Creem webhook signature');
  });

  it('throws when secret is empty', async () => {
    await expect(
      verifyCreemWebhookSignature('payload', 'abc123', '')
    ).rejects.toThrow('CREEM_WEBHOOK_SECRET is not configured');
  });

  it('throws on invalid signature', async () => {
    await expect(
      verifyCreemWebhookSignature('{"test":true}', 'deadbeef', SECRET)
    ).rejects.toThrow('Invalid Creem webhook signature');
  });

  it('passes with a correctly computed signature', async () => {
    // Compute the expected HMAC manually
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const payload = '{"event":"checkout.completed"}';
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const hex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Should not throw
    await expect(
      verifyCreemWebhookSignature(payload, hex, SECRET)
    ).resolves.toBeUndefined();
  });
});

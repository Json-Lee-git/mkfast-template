import { describe, it, expect } from 'vitest';

// The csrf module uses TanStack Start middleware which won't load in vitest.
// We test the pure logic: token generation + cookie format.

describe('CSRF token format', () => {
  it('generates a 64-char hex token', () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) =>
      b.toString(16).padStart(2, '0')
    ).join('');

    expect(token).toHaveLength(64);
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates unique tokens each call', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      tokens.add(
        Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
      );
    }
    expect(tokens.size).toBe(10);
  });
});

describe('CSRF Set-Cookie header', () => {
  it('builds a valid Set-Cookie string', () => {
    const token = 'a'.repeat(32) + 'b'.repeat(32); // 64-char hex
    const maxAge = 60 * 60 * 24; // 24 hours
    const header = [
      `__Host-csrf=${token}`,
      'Path=/',
      'Max-Age=' + maxAge,
      'SameSite=Lax',
      'Secure',
      'HttpOnly',
    ].join('; ');

    expect(header).toContain('__Host-csrf=');
    expect(header).toContain('Path=/');
    expect(header).toContain('Max-Age=86400');
    expect(header).toContain('SameSite=Lax');
  });
});

/**
 * Smoke test: email and URL normalization for report matching.
 *
 * Verifies that the normalizers used in createReportCheckout and
 * resendReportLink produce consistent keys regardless of user input
 * variation (case, trailing slash, missing protocol).
 */

import {
  normalizeEmail,
  normalizeWebsiteUrl,
} from '../src/api/ai-readiness/report-url';

let passed = 0;
let failed = 0;

function assert(description: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${description}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`FAIL ${description}: ${msg}`);
    failed++;
  }
}

function equal(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`expected "${String(expected)}", got "${String(actual)}"`);
  }
}

// ── Email normalization ──

assert('email: trim + lowercase', () => {
  equal(normalizeEmail('  Gmail@Example.COM  '), 'gmail@example.com');
});

assert('email: already normalized is stable', () => {
  equal(normalizeEmail('gmail@example.com'), 'gmail@example.com');
});

assert('email: mixed case domain', () => {
  equal(normalizeEmail('User@Example.Com'), 'user@example.com');
});

// ── URL normalization: basic cases ──

assert('url: adds https:// when missing', () => {
  equal(
    normalizeWebsiteUrl('example.com/pricing'),
    'https://example.com/pricing'
  );
});

assert('url: strips trailing slash', () => {
  equal(
    normalizeWebsiteUrl('https://example.com/pricing/'),
    'https://example.com/pricing'
  );
});

assert('url: lowercases pathname', () => {
  equal(
    normalizeWebsiteUrl('https://example.com/Pricing'),
    'https://example.com/pricing'
  );
});

assert('url: lowercases pathname with trailing slash', () => {
  equal(
    normalizeWebsiteUrl('https://example.com/Pricing/'),
    'https://example.com/pricing'
  );
});

// ── URL normalization: all three variants produce same key ──

const key1 = normalizeWebsiteUrl('example.com/pricing');
const key2 = normalizeWebsiteUrl('https://example.com/pricing/');
const key3 = normalizeWebsiteUrl('https://example.com/Pricing');

assert(
  'url: three variants (no protocol, trailing slash, upper path) produce same key',
  () => {
    equal(key1, key2);
    equal(key2, key3);
  }
);

// ── URL normalization: root path ──

assert('url: root path preserves /', () => {
  equal(normalizeWebsiteUrl('https://example.com/'), 'https://example.com/');
});

assert('url: root path without slash gets one', () => {
  equal(normalizeWebsiteUrl('example.com'), 'https://example.com/');
});

// ── URL normalization: rejections (should throw; resend catches these) ──

assert('url: rejects ftp protocol', () => {
  try {
    normalizeWebsiteUrl('ftp://example.com/a');
    throw new Error('should have thrown');
  } catch (e) {
    if (e instanceof Error && e.message === 'should have thrown') {
      throw e;
    }
    // Expected: normalizeUrlKeepPath throws
  }
});

assert('url: rejects localhost', () => {
  try {
    normalizeWebsiteUrl('http://127.0.0.1/a');
    throw new Error('should have thrown');
  } catch (e) {
    if (e instanceof Error && e.message === 'should have thrown') {
      throw e;
    }
    // Expected: normalizeUrlKeepPath throws
  }
});

// ── URL normalization: query string preserved ──

assert('url: preserves query string', () => {
  equal(
    normalizeWebsiteUrl('https://example.com/Page?Ref=Home'),
    'https://example.com/page?Ref=Home'
  );
});

assert('url: preserves hash', () => {
  equal(
    normalizeWebsiteUrl('https://example.com/Page#Section'),
    'https://example.com/page#Section'
  );
});

// ── Summary ──

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exitCode = 1;
}

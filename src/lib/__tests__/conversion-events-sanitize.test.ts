import { describe, expect, it } from 'vitest';
import {
  sanitizeConversionPath,
  sanitizeConversionPayload,
  sanitizeConversionUrl,
} from '../conversion-events-sanitize';

describe('conversion event sanitizers', () => {
  it('removes query strings and hashes from absolute URLs', () => {
    expect(
      sanitizeConversionUrl(
        'https://aeocheck.xyz/tools/aeo-checker?token=secret#checkout'
      )
    ).toBe('https://aeocheck.xyz/tools/aeo-checker');
  });

  it('removes query strings and hashes from paths', () => {
    expect(sanitizeConversionPath('/tools/aeo-checker?email=a@b.com#top')).toBe(
      '/tools/aeo-checker'
    );
  });

  it('drops sensitive payload keys and keeps safe aggregate fields', () => {
    expect(
      sanitizeConversionPayload({
        email: 'buyer@example.com',
        emailDomain: 'example.com',
        sessionToken: 'secret',
        checkoutId: 'co_123',
        websiteHost: 'example.com',
      })
    ).toEqual({
      emailDomain: 'example.com',
      websiteHost: 'example.com',
    });
  });

  it('redacts email addresses from non-sensitive string payload values', () => {
    expect(
      sanitizeConversionPayload({
        note: 'Please contact buyer@example.com for details',
      })
    ).toEqual({
      note: 'Please contact [redacted-email] for details',
    });
  });

  it('sanitizes payload URL values', () => {
    expect(
      sanitizeConversionPayload({
        websiteUrl: 'https://example.com/page?utm_source=test',
      })
    ).toEqual({
      websiteUrl: 'https://example.com/page',
    });
  });
});

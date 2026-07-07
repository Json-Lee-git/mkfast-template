import { describe, expect, it } from 'vitest';
import {
  formatWebhookErrorMessage,
  shouldExposeManualAuditSmokeErrorDetail,
} from './-creem-diagnostics';

describe('Creem webhook diagnostics', () => {
  it('exposes processing error detail only for manual audit smoke events', () => {
    expect(
      shouldExposeManualAuditSmokeErrorDetail({
        id: 'evt_manual_audit_smoke_1782982655854',
      })
    ).toBe(true);
    expect(
      shouldExposeManualAuditSmokeErrorDetail({ id: 'evt_real_checkout' })
    ).toBe(false);
    expect(shouldExposeManualAuditSmokeErrorDetail(undefined)).toBe(false);
  });

  it('formats unknown webhook errors without throwing', () => {
    expect(formatWebhookErrorMessage(new Error('D1 unavailable'))).toBe(
      'D1 unavailable'
    );
    expect(formatWebhookErrorMessage('plain failure')).toBe('plain failure');
  });
});

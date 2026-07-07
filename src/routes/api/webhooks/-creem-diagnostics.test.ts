import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  formatWebhookErrorMessage,
  shouldExposeManualAuditSmokeErrorDetail,
} from './-creem-diagnostics';

describe('Creem webhook diagnostics', () => {
  it('exposes processing error detail only for manual audit smoke events', () => {
    assert.equal(
      shouldExposeManualAuditSmokeErrorDetail({
        id: 'evt_manual_audit_smoke_1782982655854',
      }),
      true
    );
    assert.equal(
      shouldExposeManualAuditSmokeErrorDetail({ id: 'evt_real_checkout' }),
      false
    );
    assert.equal(shouldExposeManualAuditSmokeErrorDetail(undefined), false);
  });

  it('formats unknown webhook errors without throwing', () => {
    assert.equal(
      formatWebhookErrorMessage(new Error('D1 unavailable')),
      'D1 unavailable'
    );
    assert.equal(formatWebhookErrorMessage('plain failure'), 'plain failure');
  });
});

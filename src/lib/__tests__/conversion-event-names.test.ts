import { describe, expect, it } from 'vitest';
import {
  CONVERSION_EVENT_NAMES,
  isConversionEventName,
} from '../conversion-event-names';

describe('conversion event names', () => {
  it('accepts registered funnel events', () => {
    expect(isConversionEventName('locked_fix_preview_seen')).toBe(true);
    expect(isConversionEventName('full_report_checkout_clicked')).toBe(true);
    expect(isConversionEventName('checkout_created')).toBe(true);
    expect(isConversionEventName('report_activated')).toBe(true);
  });

  it('rejects unregistered events', () => {
    expect(isConversionEventName('checkout-created')).toBe(false);
    expect(isConversionEventName('unknown_event')).toBe(false);
  });

  it('keeps the registry unique', () => {
    expect(new Set(CONVERSION_EVENT_NAMES).size).toBe(
      CONVERSION_EVENT_NAMES.length
    );
  });
});

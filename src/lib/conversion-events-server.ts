import { getDb } from '@/db';
import { conversionEvents } from '@/db/app.schema';
import {
  sanitizeConversionPayload,
  type ConversionPayload,
} from '@/lib/conversion-events-sanitize';
import type { ConversionEventName } from '@/lib/conversion-event-names';

/**
 * Write a conversion event directly to D1 from server-side code.
 * Use this for server-authoritative events (checkout_created,
 * report_activated, etc.) where the client-side trackConversionEvent
 * (which uses sendBeacon/fetch) is not available.
 *
 * Privacy rules:
 * - Never store full email addresses. At most, store a domain or hash.
 * - URLs may include hostname/path, but avoid full query strings.
 * - payloadJson is capped at 4000 chars by the DB schema.
 */
export async function trackServerConversionEvent(
  event: ConversionEventName,
  payload: ConversionPayload = {}
) {
  try {
    const payloadJson = JSON.stringify(
      sanitizeConversionPayload(payload)
    ).slice(0, 4000);
    await getDb().insert(conversionEvents).values({
      event,
      path: null,
      pageUrl: null,
      referrer: null,
      sessionId: null,
      variant: 'seo-audit-for-chatgpt-v1',
      payloadJson,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error(
      `[conversion-events-server] Failed to write event "${event}":`,
      err
    );
  }
}

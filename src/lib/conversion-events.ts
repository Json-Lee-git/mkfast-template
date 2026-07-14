import {
  sanitizeConversionPath,
  sanitizeConversionPayload,
  sanitizeConversionUrl,
  type ConversionPayload,
} from '@/lib/conversion-events-sanitize';
import type { ConversionEventName } from '@/lib/conversion-event-names';

type ConversionEvent = ConversionPayload & {
  event: ConversionEventName;
};

declare global {
  interface Window {
    dataLayer?: ConversionEvent[];
    gtag?: (
      command: 'event',
      eventName: string,
      params: ConversionPayload
    ) => void;
  }
}

const CONVERSION_VARIANT = 'seo-audit-for-chatgpt-v1';
const SESSION_STORAGE_KEY = 'ai-search-readiness-session-id';

function getSessionId(): string | undefined {
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    const generated =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return undefined;
  }
}

function sendFirstPartyEvent(eventName: string, payload: ConversionPayload) {
  const sanitizedPayload = sanitizeConversionPayload(payload);
  const body = JSON.stringify({
    event: eventName,
    path: sanitizeConversionPath(window.location.pathname),
    pageUrl: sanitizeConversionUrl(window.location.href),
    referrer: sanitizeConversionUrl(document.referrer),
    sessionId: getSessionId(),
    variant: CONVERSION_VARIANT,
    payload: sanitizedPayload,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/api/conversion-events', blob)) return;
    }
  } catch {
    // Fall through to fetch.
  }

  fetch('/api/conversion-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackConversionEvent(
  eventName: ConversionEventName,
  payload: ConversionPayload = {}
) {
  if (typeof window === 'undefined') return;

  const sanitizedPayload = sanitizeConversionPayload(payload);
  const detail: ConversionEvent = {
    event: eventName,
    ...sanitizedPayload,
  };

  window.dispatchEvent(
    new CustomEvent('ai-search-readiness:event', { detail })
  );

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(detail);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: 'conversion',
      ...sanitizedPayload,
    });
  }

  sendFirstPartyEvent(eventName, sanitizedPayload);
}

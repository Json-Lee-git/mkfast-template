type ConversionPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

type ConversionEvent = ConversionPayload & {
  event: string;
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
  const body = JSON.stringify({
    event: eventName,
    path: window.location.pathname,
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
    variant: CONVERSION_VARIANT,
    payload,
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
  eventName: string,
  payload: ConversionPayload = {}
) {
  if (typeof window === 'undefined') return;

  const detail: ConversionEvent = {
    event: eventName,
    ...payload,
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
      ...payload,
    });
  }

  sendFirstPartyEvent(eventName, payload);
}

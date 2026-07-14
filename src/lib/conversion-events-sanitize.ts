type ConversionPayloadValue = string | number | boolean | null | undefined;

export type ConversionPayload = Record<string, ConversionPayloadValue>;

const EMAIL_PATTERN = /[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+/g;
const SENSITIVE_KEY_PATTERN =
  /(auth|bearer|checkout|customer|email|password|secret|session|token)/i;
const SAFE_KEY_PATTERN = /^(emailDomain|websiteHost)$/;

export function sanitizeConversionUrl(
  value: string | null | undefined
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    return `${url.origin}${url.pathname}`;
  } catch {
    const withoutHash = trimmed.split('#')[0];
    const withoutQuery = withoutHash.split('?')[0];
    return withoutQuery || undefined;
  }
}

export function sanitizeConversionPath(
  value: string | null | undefined
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const withoutHash = trimmed.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  return withoutQuery || undefined;
}

export function sanitizeConversionPayload(
  payload: ConversionPayload | null | undefined
): ConversionPayload {
  if (!payload) return {};

  return Object.fromEntries(
    Object.entries(payload).flatMap(([key, value]) => {
      if (shouldDropPayloadKey(key)) return [];
      if (typeof value === 'string') {
        return [[key, sanitizePayloadString(key, value)]];
      }
      return [[key, value]];
    })
  );
}

function shouldDropPayloadKey(key: string) {
  return SENSITIVE_KEY_PATTERN.test(key) && !SAFE_KEY_PATTERN.test(key);
}

function sanitizePayloadString(key: string, value: string) {
  if (/url/i.test(key)) {
    return sanitizeConversionUrl(value) ?? '';
  }
  return value.replace(EMAIL_PATTERN, '[redacted-email]');
}

// Shared URL and fetch utilities for ai-readiness tools

// ---------- Constants ----------

export const FETCH_TIMEOUT_MS = 8_000;
export const MAX_REDIRECTS = 3;

// ---------- URL validation ----------

function isPrivateOrLocalHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(lower))
    return true;
  if (lower.startsWith('[::ffff:')) {
    const normalized = lower.replace(/^\[::ffff:/, '').replace(/\]$/, '');
    if (normalized.includes('.')) {
      return isPrivateOrLocalHostname(normalized);
    }
    const parts = normalized.split(':');
    if (parts.length === 2) {
      const high = Number.parseInt(parts[0] ?? '', 16);
      const low = Number.parseInt(parts[1] ?? '', 16);
      if (Number.isFinite(high) && Number.isFinite(low)) {
        const a = (high >> 8) & 255;
        const b = high & 255;
        const c = (low >> 8) & 255;
        const d = low & 255;
        return isPrivateOrLocalHostname(`${a}.${b}.${c}.${d}`);
      }
    }
  }
  // IPv6-mapped IPv4: ::ffff:x.x.x.x
  const ipv6MappedMatch = lower.match(
    /^::ffff:(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  );
  if (ipv6MappedMatch) {
    const [, a, b] = ipv6MappedMatch.map(Number);
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 127) return true;
    return false;
  }
  const ipv4Match = lower.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 127) return true;
  }
  return false;
}

export function normalizeOrigin(raw: string): string {
  let url = raw.trim();
  // Reject non-http(s) protocols explicitly
  if (/^[a-z][a-z0-9+\-.]*:/i.test(url) && !/^https?:\/\//i.test(url)) {
    throw new Error('Only http and https URLs are allowed');
  }
  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }
  if (isPrivateOrLocalHostname(parsed.hostname)) {
    throw new Error('Internal and local addresses are not allowed');
  }
  return `${parsed.protocol}//${parsed.hostname}`;
}

/** Like normalizeOrigin but preserves the path (for sitemap URLs etc). */
export function normalizeUrlKeepPath(raw: string): string {
  let url = raw.trim();
  if (/^[a-z][a-z0-9+\-.]*:/i.test(url) && !/^https?:\/\//i.test(url)) {
    throw new Error('Only http and https URLs are allowed');
  }
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const parsed = new URL(url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed');
  }
  if (isPrivateOrLocalHostname(parsed.hostname)) {
    throw new Error('Internal and local addresses are not allowed');
  }
  return parsed.href;
}

/** Validate that a URL is safe to fetch (no private hosts, http(s) only). */
export function validateUrl(raw: string): void {
  normalizeOrigin(raw); // throws on invalid
}

// ---------- Fetch helpers ----------

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: 'manual' });
  } finally {
    clearTimeout(timer);
  }
}

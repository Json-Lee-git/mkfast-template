import { normalizeUrlKeepPath } from './shared';

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Normalize a URL for storage and matching. Uses the same logic as
 * the AEO checker (normalizeUrlKeepPath) and additionally:
 * - lowercases the pathname for case-insensitive matching
 * - strips trailing slashes from the path
 */
export function normalizeWebsiteUrl(raw: string): string {
  const url = normalizeUrlKeepPath(raw);
  const parsed = new URL(url);

  // Lowercase path for case-insensitive matching
  // (hostname is already lowercased by the URL constructor)
  parsed.pathname = parsed.pathname.toLowerCase();

  // Strip trailing slash unless the path is just "/"
  if (parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  }

  return parsed.href;
}

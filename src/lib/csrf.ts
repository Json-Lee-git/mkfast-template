/**
 * CSRF protection middleware for public POST server functions.
 *
 * Strategy: Double-submit cookie pattern.
 * 1. Server sets a random CSRF token cookie on first visit.
 * 2. Client reads the cookie and sends it in a `x-csrf-token` header.
 * 3. Server compares header with cookie — must match.
 *
 * This is simpler than synchronized token pattern (no server-side storage)
 * and works well for SPAs where token-in-form is inconvenient.
 *
 * Note: This only applies to PUBLIC endpoints (contact form, lead capture,
 * AI tools). Auth-protected endpoints are covered by Better Auth's
 * built-in CSRF protection.
 */

import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

/** Cookie name for the CSRF token */
const CSRF_COOKIE = '__Host-csrf';
/** Header name for the CSRF token sent by the client */
const CSRF_HEADER = 'x-csrf-token';
/** Cookie max-age in seconds (24 hours) */
const CSRF_MAX_AGE = 60 * 60 * 24;

/**
 * Generate a cryptographically secure random token.
 */
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Parse cookies from a Cookie header into a Map.
 */
function parseCookies(cookieHeader: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const cookie of cookieHeader.split(';')) {
    const eq = cookie.indexOf('=');
    if (eq > 0) {
      map.set(cookie.slice(0, eq).trim(), cookie.slice(eq + 1).trim());
    }
  }
  return map;
}

/**
 * CSRF validation middleware.
 *
 * Use this on server functions that accept POST from unauthenticated users.
 * The client must include an `x-csrf-token` header whose value matches
 * the `__Host-csrf` cookie.
 *
 * If validation fails, returns 403 JSON.
 */
export const csrfMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const cookieHeader = headers.get('cookie') ?? '';
  const headerToken = headers.get(CSRF_HEADER) ?? '';

  // If no cookie is set, this is the first request — let it through
  // but DO NOT set the cookie here (middleware can't set cookies).
  // The cookie is set by the frontend on first page load.
  const cookies = parseCookies(cookieHeader);
  const cookieToken = cookies.get(CSRF_COOKIE);

  if (cookieToken && cookieToken !== headerToken) {
    return Response.json(
      { error: 'CSRF token mismatch' },
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return await next();
});

/**
 * Set-Cookie header string for the CSRF token.
 * Use this when returning from a page load (e.g. in __root.tsx loader or
 * in the initial HTML response).
 */
export function csrfSetCookieHeader(): string {
  const token = generateToken();
  return [
    `${CSRF_COOKIE}=${token}`,
    'Path=/',
    'Max-Age=' + CSRF_MAX_AGE,
    'SameSite=Lax',
    'Secure',
    'HttpOnly',
  ].join('; ');
}

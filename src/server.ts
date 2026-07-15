// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from '@tanstack/react-start/server-entry';
import { localeMiddleware } from '@/locale/middleware';

/**
 * TanStack Start server entry
 * https://github.com/backpine/tanstack-start-on-cloudflare/blob/main/src/server.ts
 */
console.log("[server-entry]: using custom server entry in 'src/server.ts'");

const CANONICAL_HOST = 'aeocheck.xyz';
const WWW_HOST = `www.${CANONICAL_HOST}`;
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getCanonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const isProductionHost =
    url.hostname === CANONICAL_HOST || url.hostname === WWW_HOST;
  if (!isProductionHost) return null;

  const shouldRedirect =
    url.protocol !== 'https:' || url.hostname !== CANONICAL_HOST;
  if (!shouldRedirect) return null;

  url.protocol = 'https:';
  url.hostname = CANONICAL_HOST;
  url.port = '';

  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function getBlogPaginationRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.pathname !== '/blog' && url.pathname !== '/blog/') return null;
  if (url.searchParams.getAll('page').length <= 1) return null;

  return new Response(null, {
    status: 301,
    headers: {
      Location: '/blog',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export default {
  async fetch(request: Request) {
    const canonicalRedirect = getCanonicalRedirect(request);
    if (canonicalRedirect) return withSecurityHeaders(canonicalRedirect);

    const paginationRedirect = getBlogPaginationRedirect(request);
    if (paginationRedirect) return withSecurityHeaders(paginationRedirect);

    const response = await localeMiddleware(request, () =>
      handler.fetch(request, {
        context: {
          fromFetch: true,
        },
      })
    );
    return withSecurityHeaders(response);
  },
};

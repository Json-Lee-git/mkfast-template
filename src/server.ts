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

export default {
  fetch(request: Request) {
    const canonicalRedirect = getCanonicalRedirect(request);
    if (canonicalRedirect) return canonicalRedirect;

    return localeMiddleware(request, () =>
      handler.fetch(request, {
        context: {
          fromFetch: true,
        },
      })
    );
  },
};

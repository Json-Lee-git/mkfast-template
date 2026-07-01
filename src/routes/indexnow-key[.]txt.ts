import { createFileRoute } from '@tanstack/react-router';
import { indexNowKeyFile } from '@/lib/indexnow';

/**
 * IndexNow key file for domain ownership verification.
 * Serves at /indexnow-key.txt
 *
 * IndexNow protocol requires this file to prove you control the domain.
 * The key value is simply the hostname.
 * https://www.indexnow.org/documentation
 */
export const Route = createFileRoute('/indexnow-key.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(indexNowKeyFile(new URL(request.url).hostname), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      },
    },
  },
});

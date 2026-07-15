import { createFileRoute } from '@tanstack/react-router';

async function handleAuthRequest(request: Request) {
  const { auth } = await import('@/auth/auth');
  return auth.handler(request);
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handleAuthRequest(request),
      POST: ({ request }) => handleAuthRequest(request),
    },
  },
});

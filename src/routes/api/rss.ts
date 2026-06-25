import { createFileRoute } from '@tanstack/react-router';
import { buildRssFeed } from '@/lib/rss';

export const Route = createFileRoute('/api/rss')({
  server: {
    handlers: {
      GET: () => buildRssFeed(),
    },
  },
});

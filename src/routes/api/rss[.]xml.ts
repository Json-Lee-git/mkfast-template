import { createFileRoute } from '@tanstack/react-router';
import { buildRssFeed } from '@/lib/rss';

export const Route = createFileRoute('/api/rss.xml')({
  server: {
    handlers: {
      GET: () => buildRssFeed(),
    },
  },
});

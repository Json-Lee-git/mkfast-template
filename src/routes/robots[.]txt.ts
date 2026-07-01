import { createFileRoute } from '@tanstack/react-router';
import { AI_CRAWLERS } from '@/lib/ai-crawlers';
import { getBaseUrl } from '@/lib/urls';
import { baseLocale, locales, localizeHref } from '@/lib/locale';

const disallowedPaths = [
  '/auth',
  '/admin',
  '/settings',
  '/dashboard',
  '/ai',
  '/pricing',
  '/changelog',
  '/roadmap',
  '/waitlist',
];

function getDisallowRules() {
  return disallowedPaths
    .flatMap((path) => [
      path,
      ...locales
        .filter((locale) => locale !== baseLocale)
        .map((locale) => localizeHref(path, { locale })),
    ])
    .map((path) => `Disallow: ${path}`)
    .join('\n');
}

function getAiCrawlerAllowRules() {
  return AI_CRAWLERS.map(
    (crawler) =>
      `User-agent: ${crawler.userAgent}\nAllow: /\n${getDisallowRules()}`
  ).join('\n\n');
}

const robotsHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
};

/**
 * Dynamic robots.txt
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-robotstxt
 */
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      HEAD: async () => {
        return new Response(null, {
          headers: robotsHeaders,
        });
      },
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const robots = `${getAiCrawlerAllowRules()}

User-agent: *
Allow: /
${getDisallowRules()}

Sitemap: ${base}/sitemap.xml`;

        return new Response(robots, {
          headers: robotsHeaders,
        });
      },
    },
  },
});

import { createFileRoute } from '@tanstack/react-router';
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

const aiCrawlerUserAgents = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'meta-externalagent',
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
  return aiCrawlerUserAgents
    .map((userAgent) => `User-agent: ${userAgent}\nAllow: /`)
    .join('\n\n');
}

/**
 * Dynamic robots.txt
 * https://tanstack.dev/start/latest/docs/framework/react/guide/seo#dynamic-robotstxt
 */
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const robots = `${getAiCrawlerAllowRules()}

User-agent: *
Allow: /
${getDisallowRules()}

Sitemap: ${base}/sitemap.xml`;

        return new Response(robots, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      },
    },
  },
});

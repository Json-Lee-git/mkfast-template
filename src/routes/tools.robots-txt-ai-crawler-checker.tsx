import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import {
  HighIntentToolPage,
  type HighIntentToolPageProps,
} from '@/components/ai-visibility/high-intent-tool-page';
import { createFileRoute } from '@tanstack/react-router';

const page: HighIntentToolPageProps = {
  kicker: 'Robots.txt AI crawler checker',
  title: 'Robots.txt AI Crawler Checker',
  description:
    'Review whether robots.txt rules accidentally block AI discovery for GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, and other relevant crawler tokens.',
  primaryLabel: 'Check robots.txt and AI files',
  primaryHref: '/tools/llms-txt-checker',
  checks: [
    'Whether robots.txt exists and returns a crawlable status code.',
    'Whether broad Disallow rules block AI crawlers from useful public pages.',
    'Whether sitemap.xml is declared in robots.txt or available at the root.',
    'Whether LLMs.txt and LLMs-full.txt complement robots.txt access rules.',
  ],
  signals: [
    'robots.txt',
    'Disallow rules',
    'Sitemap directive',
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'Google-Extended',
  ],
  deliverables: [
    'Clear crawler access findings with blocked, allowed, or unknown status.',
    'Fix priorities for robots.txt, sitemap, and AI-readable site files.',
    'AEO recommendations that connect crawl access to content readiness.',
    'Downloadable report after the full AEO audit.',
  ],
  related: [
    { label: 'AI Crawler Checker', href: '/tools/ai-crawler-checker' },
    { label: 'AI Crawler Access Playbook', href: '/playbooks' },
    { label: 'GPTBot vs OAI-SearchBot', href: '/blog/gptbot-vs-oai-searchbot' },
    { label: 'LLMs.txt Checker', href: '/tools/llms-txt-checker' },
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    { label: 'LLMs.txt vs Robots.txt', href: '/blog/llms-txt-vs-robots-txt' },
  ],
};

const faqItems = [
  {
    q: 'Can robots.txt block AI search visibility?',
    a: 'It can block crawler access to public pages for user agents that respect robots.txt. That may reduce discoverability, but it is not the only factor behind AI search visibility or citations.',
  },
  {
    q: 'Should I allow every AI crawler?',
    a: 'Not always. Some teams allow search and answer crawlers while limiting training-related crawlers. The right policy depends on your content strategy and risk tolerance.',
  },
];

export const Route = createFileRoute('/tools/robots-txt-ai-crawler-checker')({
  head: () => ({
    ...seo('/tools/robots-txt-ai-crawler-checker', {
      title: 'Robots.txt AI Crawler Checker - GPTBot, ClaudeBot, PerplexityBot',
      description:
        'Check robots.txt rules for AI crawlers including GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, and sitemap discovery.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'Robots.txt AI Crawler Checker',
          websiteUrl: getCanonicalUrl('/tools/robots-txt-ai-crawler-checker'),
          longDescription: page.description,
          startingPrice: '$0',
          keyFeatures: page.checks,
        })
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Robots.txt AI Crawler Checker',
            url: getCanonicalUrl('/tools/robots-txt-ai-crawler-checker'),
          },
        ])
      ),
    ],
  }),
  component: () => <HighIntentToolPage {...page} />,
});

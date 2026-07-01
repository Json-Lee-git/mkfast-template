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
  kicker: 'AI crawler access checker',
  title: 'AI Crawler Checker for GPTBot, ClaudeBot, and PerplexityBot',
  description:
    'Check whether your public pages are technically accessible to major AI crawlers and whether robots.txt, sitemap.xml, LLMs.txt, and page structure support AI search discovery.',
  primaryLabel: 'Run free AI crawler audit',
  primaryHref: '/tools/llms-txt-checker',
  checks: [
    'Whether robots.txt allows or blocks major AI crawler user agents.',
    'Whether sitemap.xml and LLMs.txt are discoverable from the site root.',
    'Whether important pages expose crawlable titles, descriptions, and links.',
    'Whether the site has enough structured context for AI-assisted retrieval.',
  ],
  signals: [
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'OAI-SearchBot',
    'Google-Extended',
    'sitemap.xml',
    'LLMs.txt',
  ],
  deliverables: [
    'Prioritized fixes for crawler access and discoverability.',
    'AI-readable file recommendations for LLMs.txt and LLMs-full.txt.',
    'Schema and answer-ready content suggestions for the audited page.',
    'Downloadable report you can hand to a developer or SEO lead.',
  ],
  related: [
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    {
      label: 'Robots.txt AI Crawler Checker',
      href: '/tools/robots-txt-ai-crawler-checker',
    },
    { label: 'GEO Audit Tool', href: '/tools/geo-audit' },
    { label: 'LLMs.txt Checker', href: '/tools/llms-txt-checker' },
  ],
};

const faqItems = [
  {
    q: 'What is an AI crawler checker?',
    a: 'An AI crawler checker reviews public technical signals that affect whether AI crawlers can discover and parse your site, including robots.txt, sitemap.xml, LLMs.txt, crawlable metadata, and links.',
  },
  {
    q: 'Does allowing AI crawlers guarantee ChatGPT citations?',
    a: 'No. Crawler access is only one readiness signal. Citations depend on many factors outside this tool, including content usefulness, authority, retrieval systems, and product-specific policies.',
  },
];

export const Route = createFileRoute('/tools/ai-crawler-checker')({
  head: () => ({
    ...seo('/tools/ai-crawler-checker', {
      title:
        'AI Crawler Checker - GPTBot, ClaudeBot, PerplexityBot Access Audit',
      description:
        'Check AI crawler access for GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, sitemap.xml, robots.txt, and LLMs.txt readiness.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'AI Crawler Checker',
          websiteUrl: getCanonicalUrl('/tools/ai-crawler-checker'),
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
            name: 'AI Crawler Checker',
            url: getCanonicalUrl('/tools/ai-crawler-checker'),
          },
        ])
      ),
    ],
  }),
  component: () => <HighIntentToolPage {...page} />,
});

import {
  breadcrumbSchema,
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
  title: 'AI Crawler Checker for GPTBot, OAI-SearchBot, and PerplexityBot',
  description:
    'Check whether your public pages are technically accessible to major AI search crawlers and whether robots.txt, sitemap.xml, LLMs.txt, WAF rules, and page structure support AI search discovery.',
  primaryLabel: 'Run full AEO audit',
  primaryHref: '/tools/aeo-checker',
  checks: [
    'Whether robots.txt allows or blocks major AI crawler user agents.',
    'Whether OpenAI search crawling differs from model-training crawler access.',
    'Whether sitemap.xml and LLMs.txt are discoverable from the site root.',
    'Whether Cloudflare or other WAF rules may need explicit AI crawler allow rules.',
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
    'OpenAI, Perplexity, Anthropic, and Google crawler-control notes.',
    'AI-readable file recommendations for LLMs.txt and LLMs-full.txt.',
    'Schema and answer-ready content suggestions for the audited page.',
    'Downloadable implementation handoff for a developer or SEO lead.',
  ],
  related: [
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    { label: 'AI Crawler Access Playbook', href: '/playbooks' },
    { label: 'GPTBot vs OAI-SearchBot', href: '/blog/gptbot-vs-oai-searchbot' },
    {
      label: 'PerplexityBot and Cloudflare WAF',
      href: '/blog/perplexitybot-cloudflare-waf',
    },
    {
      label: 'Robots.txt AI Crawler Checker',
      href: '/tools/robots-txt-ai-crawler-checker',
    },
    { label: 'GEO Audit Tool', href: '/tools/geo-audit' },
    { label: 'LLMs.txt Checker', href: '/tools/llms-txt-checker' },
  ],
};

export const Route = createFileRoute('/tools/ai-crawler-checker')({
  head: () => ({
    ...seo('/tools/ai-crawler-checker', {
      title:
        'AI Crawler Checker - GPTBot, OAI-SearchBot, PerplexityBot Access Audit',
      description:
        'Check AI crawler access for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, sitemap.xml, robots.txt, WAF risks, and LLMs.txt readiness.',
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

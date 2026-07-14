import { AIHomePage } from '@/components/blocks/ai-home';
import {
  faqSchema,
  itemListSchema,
  jsonLd,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => {
    const pageSeo = seo('/', {
      title: 'AI Visibility Audit and ChatGPT Visibility Checker | AEOCheck',
      description:
        'Run a free AI visibility audit to check whether ChatGPT-style answers can understand, trust, and recommend your brand. Get a prioritized fix path.',
    });
    return {
      ...pageSeo,
      meta: [
        ...pageSeo.meta,
        { name: 'author', content: 'AEOCheck' },
        { property: 'article:published_time', content: '2026-02-15T00:00:00Z' },
        {
          property: 'article:modified_time',
          content: '2026-07-09T00:00:00Z',
        },
      ],
      scripts: [
        jsonLd(websiteSchema()),
        jsonLd(organizationSchema()),
        jsonLd(
          softwareApplicationSchema({
            name: 'AEOCheck',
            websiteUrl: getCanonicalUrl('/'),
            longDescription:
              'AI visibility audit tool for free URL scans, one-time Fix Packs, managed monitoring requests, and manual audits. It checks crawl access, AI crawler access, LLMs.txt, schema, answer-ready content, entity clarity, and trust signals behind ChatGPT-style recommendations.',
            startingPrice: '$0',
            keyFeatures: [
              'Free AI visibility audit',
              'ChatGPT visibility readiness checker',
              '$19 one-time Fix Pack',
              '$29/mo managed Monitor request path',
              '$99 Manual Audit for human review',
            ],
          })
        ),
        jsonLd(
          itemListSchema('/', [
            {
              name: 'ChatGPT Visibility Checker',
              url: getCanonicalUrl('/tools/chatgpt-visibility-checker'),
              description:
                'Run a free readiness-based audit for ChatGPT-style brand recommendations.',
            },
            {
              name: 'AEO Checker',
              url: getCanonicalUrl('/tools/aeo-checker'),
              description:
                'Diagnose page-level crawlability, schema, answer-ready content, entity clarity, and trust signals.',
            },
            {
              name: 'Query Fan-Out Tool',
              url: getCanonicalUrl('/tools/query-fan-out-tool'),
              description:
                'Simulate related sub-queries, intent clusters, and content gaps.',
            },
            {
              name: 'LLMs.txt Checker',
              url: getCanonicalUrl('/tools/llms-txt-checker'),
              description:
                'Validate LLMs.txt, LLMs-full.txt, sitemap, and AI crawler access.',
            },
            {
              name: 'LLMs.txt Generator',
              url: getCanonicalUrl('/tools/llms-txt-generator'),
              description: 'Generate a clean AI-readable LLMs.txt file.',
            },
            {
              name: 'AI Crawler Checker',
              url: getCanonicalUrl('/tools/ai-crawler-checker'),
              description:
                'Check GPTBot, ClaudeBot, PerplexityBot, robots.txt, sitemap, and LLMs.txt access.',
            },
            {
              name: 'GEO Audit Tool',
              url: getCanonicalUrl('/tools/geo-audit'),
              description:
                'Audit generative engine optimization readiness signals.',
            },
            {
              name: 'AI Overview Readiness Checker',
              url: getCanonicalUrl('/tools/ai-overview-readiness-checker'),
              description:
                'Check technical and content readiness for AI-assisted search summaries.',
            },
            {
              name: 'ChatGPT Citation Readiness Checker',
              url: getCanonicalUrl('/tools/chatgpt-citation-readiness-checker'),
              description:
                'Review public citation-readiness signals for AI retrieval systems.',
            },
            {
              name: 'Sample AI Visibility Report',
              url: getCanonicalUrl('/sample-aeo-report'),
              description:
                'Preview the $19 AI Visibility Fix Pack and its copy-ready implementation plan.',
            },
          ])
        ),
        jsonLd(
          faqSchema([
            {
              q: 'What is AI search readiness?',
              a: 'AI search readiness is the repair layer behind AI visibility. It means your website is technically easy for search engines, answer engines, and AI-assisted retrieval systems to crawl, parse, and understand. It includes crawlability, robots.txt rules, AI crawler access, structured data, sitemap discovery, optional LLMs.txt files, answer-ready content formatting, clear entity signals, and trust indicators.',
            },
            {
              q: 'Are these tools free?',
              a: 'The first page audit and focused tools are free to use. AEOCheck also offers an optional $19 Fix Pack with a repair plan and copy-ready assets, a $29/mo Monitor path for important pages after publishing, and a $99 manual audit when you want human judgment.',
            },
            {
              q: 'Do these tools guarantee AI search visibility?',
              a: 'No. These tools check technical readiness signals. They do not guarantee rankings, citations, traffic, or visibility in ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, or any other AI search product.',
            },
          ])
        ),
      ],
    };
  },
  component: AIHomePage,
});

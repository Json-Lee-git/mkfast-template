import { AIHomePage } from '@/components/blocks/ai-home';
import {
  faqSchema,
  itemListSchema,
  jsonLd,
  organizationSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => {
    const pageSeo = seo('/', {
      title: 'AEOCheck - Free Technical AI Search Readiness Checker',
      description:
        'Check crawler access, robots.txt, LLMs.txt, schema, sitemap, and answer-ready content before chasing AI citations. Free technical AI search readiness tools.',
    });
    return {
      ...pageSeo,
      meta: [
        ...pageSeo.meta,
        { name: 'author', content: 'AEOCheck' },
        { property: 'article:published_time', content: '2026-02-15T00:00:00Z' },
        {
          property: 'article:modified_time',
          content: '2026-06-26T00:00:00Z',
        },
      ],
      scripts: [
        jsonLd(websiteSchema()),
        jsonLd(organizationSchema()),
        jsonLd(
          itemListSchema('/', [
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
              name: 'AEO Checker',
              url: getCanonicalUrl('/tools/aeo-checker'),
              description:
                'Run a technical AEO audit for your website or page.',
            },
            {
              name: 'Query Fan-Out Tool',
              url: getCanonicalUrl('/tools/query-fan-out-tool'),
              description:
                'Simulate related sub-queries, intent clusters, and content gaps.',
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
              name: 'Sample AEO Report',
              url: getCanonicalUrl('/sample-aeo-report'),
              description: 'Preview the paid AI Search Readiness Fix Pack.',
            },
          ])
        ),
        jsonLd(
          faqSchema([
            {
              q: 'What is AI search readiness?',
              a: 'AI search readiness means your website is technically easy for search engines, answer engines, and AI-assisted retrieval systems to crawl, parse, and understand. It includes crawlability, robots.txt rules, AI crawler access, structured data, sitemap discovery, optional LLMs.txt files, answer-ready content formatting, clear entity signals, and trust indicators.',
            },
            {
              q: 'Are these tools free?',
              a: 'The scan and focused tools are free to use. AEOCheck also offers an optional $19 Fix Pack with implementation assets and a $99 manual audit when you want a human-reviewed fix plan.',
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

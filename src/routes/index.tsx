import { AIHomePage } from '@/components/blocks/ai-home';
import {
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
      title:
        'Free AI Search Readiness Tools - LLMs.txt Checker, AEO Audit & Query Fan-Out',
      description:
        "Free tools to check your website's AI search readiness. Validate LLMs.txt, audit technical AEO signals, check AI crawler access for ChatGPT and Perplexity, and simulate AI query fan-out. No sign-up required.",
    });
    return {
      ...pageSeo,
      meta: [
        ...pageSeo.meta,
        { name: 'author', content: 'AI Search Readiness Tools' },
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
          ])
        ),
      ],
    };
  },
  component: AIHomePage,
});

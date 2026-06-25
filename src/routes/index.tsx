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
  head: () => ({
    ...seo('/', {
      title:
        'AI Search Readiness Tools - LLMs.txt, AEO Checker & Query Fan-Out',
      description:
        "Free tools to check your website's AI search readiness. Validate LLMs.txt, audit technical AEO signals, check AI crawler access, and simulate query fan-out.",
    }),
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
            description: 'Run a technical AEO audit for your website or page.',
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
  }),
  component: AIHomePage,
});

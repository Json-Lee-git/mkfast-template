import { AIHomePage } from '@/components/blocks/ai-home';
import {
  jsonLd,
  websiteSchema,
  organizationSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo('/', {
      title: 'AI Search Readiness Tools - LLMs.txt Checker & Generator',
      description:
        "Check your website's LLMs.txt, LLMs-full.txt, sitemap, and AI crawler access. Generate AI-readable files and get a technical AI Search Readiness report.",
    }),
    scripts: [jsonLd(websiteSchema()), jsonLd(organizationSchema())],
  }),
  component: AIHomePage,
});

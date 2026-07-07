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
  kicker: 'Generative engine optimization audit',
  title: 'GEO Audit Tool for AI Search Readiness',
  description:
    'Audit the technical and content signals that help generative search systems understand your pages: crawl access, structured data, answer-ready formatting, entity clarity, trust signals, and query coverage.',
  primaryLabel: 'Run free GEO audit',
  primaryHref: '/tools/aeo-checker',
  checks: [
    'Whether pages are crawlable and internally discoverable.',
    'Whether JSON-LD schema explains the entity, page type, and content.',
    'Whether headings, FAQs, and concise answers support extraction.',
    'Whether trust pages and references make the site easier to cite.',
  ],
  signals: [
    'GEO',
    'AEO',
    'schema',
    'FAQPage',
    'entity clarity',
    'trust signals',
    'query fan-out',
  ],
  deliverables: [
    'Full issue list across technical AEO and GEO readiness signals.',
    'Prioritized fixes for crawlability, schema, content, and trust.',
    'Query fan-out gaps that suggest what supporting pages to publish.',
    'Downloadable implementation handoff.',
  ],
  related: [
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    {
      label: 'AI Overview Readiness Checker',
      href: '/tools/ai-overview-readiness-checker',
    },
    {
      label: 'ChatGPT Citation Readiness Checker',
      href: '/tools/chatgpt-citation-readiness-checker',
    },
    { label: 'Query Fan-Out Tool', href: '/tools/query-fan-out-tool' },
  ],
};

const faqItems = [
  {
    q: 'What is a GEO audit?',
    a: 'A GEO audit reviews whether a page is easy for generative search and answer systems to crawl, understand, extract, and potentially cite. It overlaps with SEO and AEO but focuses on AI-assisted answers.',
  },
  {
    q: 'Is GEO different from AEO?',
    a: 'They overlap heavily. AEO focuses on answer extraction and answer engines, while GEO is often used for visibility in generative search experiences. The technical foundation is similar.',
  },
];

export const Route = createFileRoute('/tools/geo-audit')({
  head: () => ({
    ...seo('/tools/geo-audit', {
      title: 'Free GEO Audit Tool - Generative Engine Optimization Checker',
      description:
        'Run a free GEO audit for generative engine optimization readiness. Check crawlability, schema, answer-ready content, entity clarity, trust signals, and query coverage.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'GEO Audit Tool',
          websiteUrl: getCanonicalUrl('/tools/geo-audit'),
          longDescription: page.description,
          startingPrice: '$0',
          keyFeatures: page.checks,
        })
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          { name: 'GEO Audit Tool', url: getCanonicalUrl('/tools/geo-audit') },
        ])
      ),
    ],
  }),
  component: () => <HighIntentToolPage {...page} />,
});

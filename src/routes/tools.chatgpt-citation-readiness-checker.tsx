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
  kicker: 'ChatGPT citation readiness',
  title: 'ChatGPT Citation Readiness Checker',
  description:
    'Review the public signals that can make your page easier for AI retrieval systems to understand: crawl access, entity clarity, structured data, sources, concise answers, and supporting pages.',
  primaryLabel: 'Run citation readiness audit',
  primaryHref: '/tools/aeo-checker',
  checks: [
    'Whether crawler access and metadata make the page discoverable.',
    'Whether entity, author, and trust signals are clear enough to parse.',
    'Whether the page provides direct answers with supporting evidence.',
    'Whether internal links and related guides cover adjacent user questions.',
  ],
  signals: [
    'ChatGPT',
    'citation readiness',
    'entity clarity',
    'references',
    'author',
    'schema',
    'LLMs.txt',
  ],
  deliverables: [
    'Citation-readiness findings across technical and content signals.',
    'Schema, trust, and answer-format recommendations.',
    'Query fan-out gaps for pages that should support the main topic.',
    'Downloadable Fix Pack after checkout.',
  ],
  related: [
    { label: 'GEO Audit Tool', href: '/tools/geo-audit' },
    {
      label: 'AI Overview Readiness Checker',
      href: '/tools/ai-overview-readiness-checker',
    },
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    {
      label: 'How to Get Cited by ChatGPT',
      href: '/blog/how-to-get-cited-by-chatgpt',
    },
  ],
};

const faqItems = [
  {
    q: 'Can this checker prove my site will be cited by ChatGPT?',
    a: 'No. It checks public readiness signals only. ChatGPT citation behavior depends on retrieval, product design, query context, and many factors outside this tool.',
  },
  {
    q: 'What is citation readiness?',
    a: 'Citation readiness means your page is technically accessible, clearly structured, attributable, evidence-backed, and easy for retrieval systems to understand.',
  },
];

export const Route = createFileRoute(
  '/tools/chatgpt-citation-readiness-checker'
)({
  head: () => ({
    ...seo('/tools/chatgpt-citation-readiness-checker', {
      title: 'ChatGPT Citation Readiness Checker - Free Citation Signal Audit',
      description:
        'Check ChatGPT citation readiness signals including crawl access, entity clarity, structured data, references, answer-ready content, and LLMs.txt. A technical citation signal layer, not a full visibility audit.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'ChatGPT Citation Readiness Checker',
          websiteUrl: getCanonicalUrl(
            '/tools/chatgpt-citation-readiness-checker'
          ),
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
            name: 'ChatGPT Citation Readiness Checker',
            url: getCanonicalUrl('/tools/chatgpt-citation-readiness-checker'),
          },
        ])
      ),
    ],
  }),
  component: () => <HighIntentToolPage {...page} />,
});

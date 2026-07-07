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
  kicker: 'Google AI Overview readiness',
  title: 'AI Overview Readiness Checker',
  description:
    'Check whether a page has the crawlability, structured data, concise answer formatting, and trust signals that can support eligibility for AI-assisted search summaries.',
  primaryLabel: 'Run AI Overview readiness audit',
  primaryHref: '/tools/aeo-checker',
  checks: [
    'Whether title, meta description, canonical, and robots tags are clear.',
    'Whether the page has extractable answer sections and question headings.',
    'Whether schema, authorship, dates, and trust pages are visible.',
    'Whether supporting content gaps can be found with query fan-out.',
  ],
  signals: [
    'AI Overviews',
    'answer-ready content',
    'canonical',
    'schema',
    'FAQ',
    'E-E-A-T signals',
    'references',
  ],
  deliverables: [
    'A technical readiness score for AI-assisted answer extraction.',
    'Fix priorities for metadata, schema, answer formatting, and trust.',
    'Suggested FAQs and content sections for clearer topical coverage.',
    'Downloadable Fix Pack for the page you audited.',
  ],
  related: [
    { label: 'GEO Audit Tool', href: '/tools/geo-audit' },
    { label: 'AEO Checker', href: '/tools/aeo-checker' },
    {
      label: 'ChatGPT Citation Readiness Checker',
      href: '/tools/chatgpt-citation-readiness-checker',
    },
    { label: 'Query Fan-Out Tool', href: '/tools/query-fan-out-tool' },
  ],
};

const faqItems = [
  {
    q: 'Can this tool tell me if I will appear in Google AI Overviews?',
    a: 'No. It checks technical readiness signals only. Google AI Overview inclusion is controlled by Google and cannot be guaranteed by any third-party checker.',
  },
  {
    q: 'What helps AI Overview readiness?',
    a: 'Clear crawlability, concise answers, useful headings, structured data, trustworthy sourcing, and strong topical coverage can all make a page easier to understand.',
  },
];

export const Route = createFileRoute('/tools/ai-overview-readiness-checker')({
  head: () => ({
    ...seo('/tools/ai-overview-readiness-checker', {
      title: 'AI Overview Readiness Checker - Free AEO and GEO Audit',
      description:
        'Check AI Overview readiness signals: crawlability, schema, answer-ready sections, trust indicators, and query coverage for AI-assisted search summaries.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'AI Overview Readiness Checker',
          websiteUrl: getCanonicalUrl('/tools/ai-overview-readiness-checker'),
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
            name: 'AI Overview Readiness Checker',
            url: getCanonicalUrl('/tools/ai-overview-readiness-checker'),
          },
        ])
      ),
    ],
  }),
  component: () => <HighIntentToolPage {...page} />,
});

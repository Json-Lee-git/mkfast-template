import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { trackConversionEvent } from '@/lib/conversion-events';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import {
  IconArrowRight,
  IconCheck,
  IconDownload,
  IconFileAnalytics,
} from '@tabler/icons-react';

const summaryItems = [
  ['Overall readiness score', '72 / 100'],
  ['Top priority', 'Add clearer answer sections and FAQPage schema'],
  ['Crawler access', 'Robots.txt found, major AI crawlers not blocked'],
  ['AI-readable files', 'LLMs.txt missing, LLMs-full.txt missing'],
];

const fixPlan = [
  {
    priority: 'P1',
    title: 'Add answer-ready sections above the fold',
    detail:
      'Create short, direct answer blocks for the main query and related follow-up questions before long-form explanation.',
  },
  {
    priority: 'P1',
    title: 'Publish a curated /llms.txt file',
    detail:
      'List the most important tools, guides, methodology, and contact pages with one-line descriptions.',
  },
  {
    priority: 'P2',
    title: 'Add FAQPage and Organization JSON-LD',
    detail:
      'Use structured data to clarify publisher identity, topical scope, and common questions on the audited page.',
  },
  {
    priority: 'P2',
    title: 'Close query fan-out gaps',
    detail:
      'Create supporting sections for pricing, methodology, alternatives, crawler access, and implementation steps.',
  },
];

const includedSections = [
  'Executive summary',
  'Technical AEO score',
  'Crawler access and AI files audit',
  'Copy-ready JSON-LD schema',
  'Answer-ready content blocks',
  'Entity and trust signal review',
  'Query fan-out content gaps',
  'Copy-ready LLMs.txt files',
  'Downloadable Markdown handoff',
];

const beforeAfterRows = [
  {
    area: 'Hero answer',
    before: 'AI platform for modern teams.',
    after:
      'AI search readiness checker for founders who need crawl, schema, and citation-readiness fixes before publishing.',
  },
  {
    area: 'FAQ schema',
    before: 'FAQ section exists visually, but no FAQPage JSON-LD is present.',
    after:
      'Add copy-ready FAQPage JSON-LD with 3 to 5 buyer and implementation questions.',
  },
  {
    area: 'LLMs.txt',
    before:
      'No curated AI-readable index for tools, methodology, reports, or contact pages.',
    after:
      'Publish a concise /llms.txt that points AI crawlers to core tools, guides, references, and support paths.',
  },
];

const copyReadyExamples = [
  {
    label: 'JSON-LD',
    value:
      '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does this tool check?","acceptedAnswer":{"@type":"Answer","text":"It checks crawlability, AI crawler access, schema, answer-ready content, entity clarity, and trust signals."}}]}',
  },
  {
    label: 'Answer block',
    value:
      'Short answer: this page is ready for AI search when crawlers can access it, schema is valid, the main question is answered directly, and trust signals are visible.',
  },
  {
    label: 'LLMs.txt entry',
    value:
      '- [AEO Checker](https://example.com/tools/aeo-checker): Audit crawlability, AI crawler access, schema, answer-ready content, and trust signals.',
  },
];

const fitRows = [
  {
    label: 'Good fit',
    items: [
      'You have one important landing page to fix before publishing.',
      'You need copy-ready schema, content blocks, and LLMs.txt entries.',
      'You want a lightweight implementation handoff, not a monthly dashboard.',
    ],
  },
  {
    label: 'Not a fit',
    items: [
      'You need guaranteed rankings, citations, or traffic.',
      'You need backlink research, keyword tracking, or a full agency audit.',
      'You need someone to implement every fix inside your CMS.',
    ],
  },
];

const sampleFaqItems = [
  {
    q: 'What do I get after paying $19?',
    a: 'You get a full AI Search Readiness Fix Pack with prioritized fixes, copy-ready JSON-LD, answer-ready content blocks, AI file recommendations, query fan-out gaps, and a downloadable Markdown handoff.',
  },
  {
    q: 'Is the report useful if I am not technical?',
    a: 'Yes. The report separates business-readable priorities from developer-ready snippets, so a founder can understand what matters and a developer or SEO operator can implement the fixes.',
  },
  {
    q: 'Does the report guarantee AI citations?',
    a: 'No. It improves technical and content readiness, but it cannot guarantee rankings, traffic, AI Overview inclusion, or citations in ChatGPT, Claude, Gemini, or Perplexity.',
  },
];

function SampleAeoReportPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-gray-200 bg-white py-20 dark:border-zinc-800/50 dark:bg-zinc-950 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Sample $19 AI-answer SEO audit
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Sample Fix Pack for ChatGPT and AI answers
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Preview what customers get after checkout: the first page fixes to
              do, copy-ready schema, LLMs.txt files, answer-ready content
              blocks, query fan-out gaps, and a Markdown handoff for
              implementation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/tools/aeo-checker"
                onClick={() =>
                  trackConversionEvent('sample_report_run_audit_clicked')
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                Run audit for your site <IconArrowRight size={16} />
              </a>
              <a
                href="#sample-report"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-200 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
              >
                See sample sections
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section id="sample-report" className="py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800/60 dark:bg-zinc-900/30 md:p-8">
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Example domain
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                    acme-saas.example
                  </h2>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 dark:bg-zinc-950 dark:text-zinc-300">
                  <IconFileAnalytics size={18} className="text-blue-500" />
                  Fix Pack preview
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-zinc-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                    Prioritized fix plan
                  </h3>
                  <div className="mt-4 space-y-3">
                    {fixPlan.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                            {item.priority}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                            {item.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-800 dark:bg-blue-950/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                    Included in the $19 Fix Pack
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                    {includedSections.map((section) => (
                      <li key={section} className="flex gap-2">
                        <IconCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-blue-500"
                        />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/tools/aeo-checker"
                    onClick={() =>
                      trackConversionEvent('sample_report_bottom_cta_clicked')
                    }
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Generate my Fix Pack <IconArrowRight size={16} />
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                  Before and after examples
                </h3>
                <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600 dark:bg-zinc-900 dark:text-zinc-400">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Area</th>
                        <th className="px-4 py-3 font-semibold">Before</th>
                        <th className="px-4 py-3 font-semibold">After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                      {beforeAfterRows.map((row) => (
                        <tr key={row.area}>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-zinc-100">
                            {row.area}
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-zinc-400">
                            {row.before}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                            {row.after}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {copyReadyExamples.map((example) => (
                  <div
                    key={example.label}
                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                      Copy-ready {example.label}
                    </p>
                    <code className="mt-3 block overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs leading-relaxed text-gray-600 dark:bg-zinc-900 dark:text-zinc-400">
                      {example.value}
                    </code>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {fitRows.map((group) => (
                  <div
                    key={group.label}
                    className="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                      {group.label}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <IconCheck
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-zinc-100">
                  <IconDownload size={16} className="text-emerald-500" />
                  Export preview
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  The real Fix Pack can be downloaded as Markdown after
                  checkout. It is written for implementation: clear enough for a
                  founder, specific enough for a developer or SEO operator.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/sample-aeo-report')({
  head: () => ({
    ...seo('/sample-aeo-report', {
      title: 'Sample AI Search Readiness Fix Pack - $19 AEO Report Preview',
      description:
        'Preview the $19 AI Search Readiness Fix Pack with prioritized fixes, copy-ready schema, answer-ready content blocks, query fan-out gaps, and LLMs.txt files.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'AI Search Readiness Fix Pack',
          websiteUrl: getCanonicalUrl('/sample-aeo-report'),
          longDescription:
            'A paid AEO fix pack with prioritized technical, content, schema, trust, query fan-out, and AI-readable file recommendations.',
          startingPrice: '$19',
          keyFeatures: includedSections,
        })
      ),
      jsonLd(faqSchema(sampleFaqItems)),
      jsonLd(
        itemListSchema('/sample-aeo-report', [
          {
            name: 'Run AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
          },
          {
            name: 'GEO Audit Tool',
            url: getCanonicalUrl('/tools/geo-audit'),
          },
          {
            name: 'AI Overview Readiness Checker',
            url: getCanonicalUrl('/tools/ai-overview-readiness-checker'),
          },
        ])
      ),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Sample AEO Report',
            url: getCanonicalUrl('/sample-aeo-report'),
          },
        ])
      ),
    ],
  }),
  component: SampleAeoReportPage,
});

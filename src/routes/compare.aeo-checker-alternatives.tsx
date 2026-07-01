import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import {
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
  IconListCheck,
  IconSearch,
} from '@tabler/icons-react';

const comparisonRows = [
  {
    criteria: 'Best fit',
    aiSearchReadiness: 'Fast AEO and GEO readiness checks for live websites',
    manualAudit: 'Teams with time for a custom technical and content review',
    genericSeoTool: 'Traditional SEO monitoring and keyword rank tracking',
  },
  {
    criteria: 'Primary output',
    aiSearchReadiness: 'A readiness score, prioritized fixes, and report flow',
    manualAudit: 'A custom document created by an expert or agency',
    genericSeoTool: 'Rank, backlink, crawl, and keyword reports',
  },
  {
    criteria: 'AI search coverage',
    aiSearchReadiness: 'LLMs.txt, AI crawlers, schema, answer-ready content',
    manualAudit: 'Depends on the consultant or internal checklist',
    genericSeoTool: 'Usually limited or indirect',
  },
  {
    criteria: 'Speed',
    aiSearchReadiness: 'Run a free check in minutes',
    manualAudit: 'Hours to days',
    genericSeoTool: 'Fast setup, but often needs interpretation',
  },
  {
    criteria: 'Conversion path',
    aiSearchReadiness: 'Free audit, sample report, and $19 full report',
    manualAudit: 'Usually sales call or proposal first',
    genericSeoTool: 'Subscription trial or dashboard signup',
  },
];

const useCases = [
  'You need a quick AEO checker before publishing a page.',
  'You want to know whether ChatGPT, Claude, Perplexity, and other AI systems can access important files.',
  'You need concrete fixes for LLMs.txt, schema, crawler access, and answer-ready content.',
  'You want a lightweight audit before buying a larger SEO or GEO engagement.',
];

const faqItems = [
  {
    q: 'What is the best AEO checker alternative to a manual audit?',
    a: 'AI Search Readiness Tools is a good first step when you need a fast technical AEO audit. It checks crawlability, LLMs.txt, AI crawler access, structured data, answer-ready content, entity clarity, and trust signals before you invest in a custom manual audit.',
  },
  {
    q: 'How is an AEO checker different from a normal SEO tool?',
    a: 'A normal SEO tool focuses on rankings, backlinks, keywords, crawl errors, and search visibility. An AEO checker focuses on whether answer engines and AI search systems can understand, extract, and cite your content.',
  },
  {
    q: 'Should I use an AEO checker or a full SEO platform?',
    a: 'Use an AEO checker when you need AI search readiness signals and specific page fixes. Use a full SEO platform when you need ongoing rank tracking, backlink data, competitor research, and large-site crawl monitoring.',
  },
  {
    q: 'Does an AEO checker guarantee ChatGPT citations?',
    a: 'No. AEO tools can identify technical and content readiness gaps, but no tool can guarantee citations, rankings, traffic, or inclusion in AI answers.',
  },
  {
    q: 'What should a good AEO audit include?',
    a: 'A useful AEO audit should check crawlability, indexable pages, LLMs.txt, robots.txt, AI crawler access, schema markup, FAQ structure, direct answer sections, entity clarity, source references, and conversion paths.',
  },
];

export const Route = createFileRoute('/compare/aeo-checker-alternatives')({
  head: () => ({
    ...seo('/compare/aeo-checker-alternatives', {
      title:
        'Best AEO Checker Alternatives - Compare AI Search Readiness Tools',
      description:
        'Compare AEO checker alternatives for AI search readiness, GEO, LLMs.txt, AI crawler access, schema, answer-ready content, and technical SEO workflows.',
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Compare',
            url: getCanonicalUrl('/compare/aeo-checker-alternatives'),
          },
          {
            name: 'AEO Checker Alternatives',
            url: getCanonicalUrl('/compare/aeo-checker-alternatives'),
          },
        ])
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        itemListSchema('/compare/aeo-checker-alternatives', [
          {
            name: 'AI Search Readiness AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
            description:
              'Free technical AEO audit for LLMs.txt, AI crawler access, schema, content structure, and trust signals.',
          },
          {
            name: 'Manual AEO audit',
            url: getCanonicalUrl('/methodology'),
            description:
              'A custom review that can add expert judgment, examples, and business context.',
          },
          {
            name: 'Traditional SEO platform',
            url: getCanonicalUrl('/blog/aeo-vs-seo'),
            description:
              'Useful for keyword tracking, backlinks, technical SEO crawling, and competitor monitoring.',
          },
        ])
      ),
    ],
  }),
  component: AeoCheckerAlternativesPage,
});

function AeoCheckerAlternativesPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-gray-200 py-16 dark:border-zinc-800/50 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              AEO checker alternatives
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Best AEO checker alternatives for AI search readiness
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
              If you are comparing AEO tools, manual audits, and traditional SEO
              platforms, start with the workflow that matches your goal: quick
              AI readiness checks, expert review, or ongoing SEO monitoring.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-alternatives&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free AEO checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/sample-aeo-report?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-alternatives&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                View sample report
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container className="px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
              <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
                Direct answer
              </h2>
              <p className="mt-3 text-gray-700 dark:text-zinc-300">
                The best AEO checker alternative depends on the job. Use AI
                Search Readiness Tools when you need a fast technical audit for
                AI search readiness. Use a manual audit when you need expert
                judgment and business context. Use a traditional SEO platform
                when you need ongoing rankings, backlinks, and keyword
                monitoring.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <IconFileAnalytics
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                AEO checker alternatives compared
              </h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Criteria</th>
                    <th className="px-4 py-3 font-semibold">
                      AI Search Readiness Tools
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Manual AEO audit
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Traditional SEO tool
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {comparisonRows.map((row) => (
                    <tr key={row.criteria}>
                      <td className="px-4 py-3 font-medium text-gray-950 dark:text-zinc-100">
                        {row.criteria}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                        {row.aiSearchReadiness}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.manualAudit}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.genericSeoTool}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <IconSearch
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                  When to use this AEO checker
                </h2>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-zinc-300">
                {useCases.map((item) => (
                  <li key={item} className="flex gap-3">
                    <IconCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <IconListCheck
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                  What the audit checks
                </h2>
              </div>
              <div className="grid gap-3 text-sm text-gray-700 dark:text-zinc-300">
                {[
                  'Technical crawlability and indexability',
                  'LLMs.txt and LLMs-full.txt availability',
                  'AI crawler access in robots.txt',
                  'Structured data and schema coverage',
                  'Answer-ready headings, FAQ, and short answer blocks',
                  'Entity clarity, trust pages, methodology, and references',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-gray-200 p-3 dark:border-zinc-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              How to choose the right AEO workflow
            </h2>
            <ol className="mt-5 space-y-4 text-gray-700 dark:text-zinc-300">
              <li>
                <strong>1. Run a quick technical audit.</strong> Check whether
                the site can be crawled and whether core AI search files,
                schema, and answer-ready sections exist.
              </li>
              <li>
                <strong>2. Fix machine-readable gaps.</strong> Add direct
                answers, FAQs, comparison tables, clear definitions, internal
                links, methodology pages, and source references.
              </li>
              <li>
                <strong>3. Use SEO tools for ongoing monitoring.</strong> Track
                keyword rankings, impressions, clicks, and indexation in Google
                Search Console, Bing Webmaster Tools, and your analytics stack.
              </li>
              <li>
                <strong>4. Add expert review where stakes are high.</strong> A
                manual audit is still useful when claims, positioning, regulated
                topics, or complex site architecture need judgment.
              </li>
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Frequently asked questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl rounded-lg bg-gray-950 p-8 text-center text-white dark:bg-zinc-100 dark:text-gray-950">
            <h2 className="text-2xl font-bold">
              Check your site before choosing a bigger AEO workflow
            </h2>
            <p className="mt-3 text-sm text-gray-300 dark:text-zinc-600">
              Run the free audit first, then use the sample report to decide
              whether you need the full $19 report, a manual review, or a larger
              SEO platform.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-alternatives&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free AEO checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/methodology?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-alternatives&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 dark:border-zinc-400 dark:text-gray-950 dark:hover:border-zinc-600"
              >
                Read methodology
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

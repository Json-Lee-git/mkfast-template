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
  IconSearch,
} from '@tabler/icons-react';

const comparisonRows = [
  {
    criteria: 'Primary focus',
    aiSearchReadiness:
      'AI search visibility: LLMs.txt, AI crawler access, schema, answer-ready content, entity clarity, trust signals',
    ahrefs:
      'Backlink analysis, keyword research, rank tracking, site audit, content explorer',
    semrush:
      'Keyword research, competitor analysis, rank tracking, site audit, content marketing, PPC',
    sitechecker:
      'Technical SEO audit, on-page SEO, rank tracking, backlink monitoring, uptime monitoring',
  },
  {
    criteria: 'AI search coverage',
    aiSearchReadiness:
      'Built for it — checks 7 AI-readiness dimensions with targeted fixes',
    ahrefs: 'Indirect — SEO data can inform AI strategy, but no AI-specific checks',
    semrush: 'Indirect — SEO data informs AI strategy, no AI-specific checks',
    sitechecker:
      'Limited — technical SEO audit covers crawlability but not AI-specific signals',
  },
  {
    criteria: 'LLMs.txt / AI crawler check',
    aiSearchReadiness:
      'Dedicated checkers for LLMs.txt validity, AI crawler access, robots.txt AI directives',
    ahrefs: 'No',
    semrush: 'No',
    sitechecker: 'No',
  },
  {
    criteria: 'Schema / structured data check',
    aiSearchReadiness:
      'Checks for JSON-LD presence, FAQPage, HowTo, Article, BreadcrumbList, Organization schema',
    ahrefs: 'Site Audit flags missing schema but no AI-specific schema guidance',
    semrush: 'Site Audit flags schema issues but no AI citation optimization',
    sitechecker: 'Checks basic schema presence — no AI-specific schema types',
  },
  {
    criteria: 'Answer-ready content check',
    aiSearchReadiness:
      'Checks for direct answers, key stats tables, FAQ sections, cite-worthy claims',
    ahrefs: 'No',
    semrush: 'No',
    sitechecker: 'No',
  },
  {
    criteria: 'Setup time',
    aiSearchReadiness: 'Enter a URL, run in seconds, get a score + fix list',
    ahrefs: 'Add domain, verify ownership, configure project (~5-10 min)',
    semrush: 'Add domain, verify ownership, configure project (~5-10 min)',
    sitechecker: 'Add domain, verify ownership (~2-3 min)',
  },
  {
    criteria: 'Pricing for individuals',
    aiSearchReadiness: 'Free tools + optional $19 full report',
    ahrefs: 'From $129/month',
    semrush: 'From $139.95/month',
    sitechecker: 'From $49/month',
  },
  {
    criteria: 'Best for',
    aiSearchReadiness:
      'Quick AI search readiness audit before publishing or after major site changes',
    ahrefs:
      'Ongoing backlink monitoring, keyword research, competitive analysis',
    semrush:
      'Full-suite digital marketing: SEO, PPC, content, social, competitive',
    sitechecker: 'Technical SEO monitoring, on-page checks, rank tracking',
  },
];

const whenToUseAEO = [
  'You need a quick AI readiness check before publishing a new page',
  'You want to know if ChatGPT/Claude/Perplexity can access your content',
  'You need specific fixes for LLMs.txt, schema, AI crawler access',
  'You want a lightweight audit before investing in a larger SEO platform',
  'You publish content regularly and want to verify AI search compatibility',
];

const whenToUseSEO = [
  'You need ongoing keyword rank tracking across hundreds or thousands of keywords',
  'You need deep backlink analysis and link-building opportunities',
  'You run PPC campaigns and need keyword data for ad targeting',
  'You manage a large site and need weekly technical SEO crawl reports',
  'You need competitor traffic estimation and content gap analysis',
];

const faqItems = [
  {
    q: 'Should I use an AEO checker instead of Ahrefs or Semrush?',
    a: 'Not instead of — in addition to. AEO checkers and traditional SEO tools solve different problems. Use an AEO checker for AI-specific readiness signals (LLMs.txt, AI crawler access, schema for AI citation). Use Ahrefs or Semrush for ongoing keyword tracking, backlink analysis, and competitive research. Most teams benefit from both.',
  },
  {
    q: 'Does the AEO checker replace a technical SEO audit?',
    a: 'No. The AEO checker complements a technical SEO audit by adding AI-specific checks (AI crawler access, LLMs.txt validity, cite-worthy content structure). A traditional SEO tool like Sitechecker or Ahrefs Site Audit covers broader technical issues like broken links, duplicate content, page speed, and crawl budget.',
  },
  {
    q: 'What does the AEO checker check that SEO tools miss?',
    a: 'The AEO checker checks: (1) LLMs.txt and LLMs-full.txt file validity and completeness, (2) AI crawler access permissions in robots.txt, (3) whether your content has direct answers and key stats tables that AI models can extract, (4) entity clarity signals, (5) trust pages that boost AI citation confidence. Traditional SEO tools do not check these AI-specific signals.',
  },
  {
    q: 'Can I use the free AEO checker without paying for an SEO tool?',
    a: 'Yes. The free AEO checker gives you an AI readiness score and a prioritized fix list without any cost. The optional $19 full report adds detailed recommendations and a second round of scoring. But for ongoing keyword tracking and competitive analysis, you will still want an SEO tool.',
  },
  {
    q: 'How do SEO tools and AEO tools work together?',
    a: 'SEO tools tell you how you rank and who links to you. AEO tools tell you whether AI models can understand and cite you. Together they cover both search surfaces: traditional search (SEO tools monitor rankings) and AI search (AEO tools verify readiness for AI citation). The $19 report bridges them by connecting AI readiness gaps to SEO impact.',
  },
];

export const Route = createFileRoute('/compare/aeo-checker-vs-seo-tools')({
  head: () => ({
    ...seo('/compare/aeo-checker-vs-seo-tools', {
      title:
        'AEO Checker vs SEO Tools — Which One Do You Actually Need?',
      description:
        'Compare AEO checkers and traditional SEO tools (Ahrefs, Semrush, Sitechecker) side by side. Learn which tool fits your workflow: AI search readiness, SEO monitoring, or both.',
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          { name: 'Compare', url: getCanonicalUrl('/compare/aeo-checker-vs-seo-tools') },
          { name: 'AEO Checker vs SEO Tools', url: getCanonicalUrl('/compare/aeo-checker-vs-seo-tools') },
        ])
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        itemListSchema('/compare/aeo-checker-vs-seo-tools', [
          {
            name: 'AI Search Readiness AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
            description:
              'Free AI search readiness audit checking LLMs.txt, AI crawler access, schema, content structure, entity clarity, and trust signals.',
          },
          {
            name: 'Ahrefs',
            url: 'https://ahrefs.com',
            description:
              'Backlink analysis, keyword research, rank tracking, and site audit platform.',
          },
          {
            name: 'Semrush',
            url: 'https://www.semrush.com',
            description:
              'Full-suite digital marketing platform: SEO, PPC, content, social media, and competitive research.',
          },
          {
            name: 'Sitechecker',
            url: 'https://sitechecker.pro',
            description:
              'Technical SEO audit, on-page SEO checker, rank tracking, and backlink monitoring.',
          },
        ])
      ),
    ],
  }),
  component: AeoCheckerVsSeoToolsPage,
});

function AeoCheckerVsSeoToolsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-200 py-16 dark:border-zinc-800/50 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              AEO checker vs SEO tools
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              AEO Checker vs SEO tools — which one do you actually need?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
              AEO checkers verify AI search readiness. SEO tools monitor
              rankings, backlinks, and keywords. They solve different problems —
              and most teams need both. Here is how to decide what comes first.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-vs-seo-tools&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free AEO checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/sample-aeo-report?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-vs-seo-tools&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                View sample report
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Direct answer */}
      <section className="py-14">
        <Container className="px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
              <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
                Direct answer
              </h2>
              <p className="mt-3 text-gray-700 dark:text-zinc-300">
                An AEO checker verifies that your site is technically ready for
                AI search engines (ChatGPT, Perplexity, Claude, Google AI
                Overviews) to understand and cite your content. Traditional SEO
                tools (Ahrefs, Semrush, Sitechecker) monitor your Google
                rankings, backlinks, and keyword performance. Use the AEO
                checker for AI-specific readiness signals. Use SEO tools for
                ongoing rank tracking, keyword research, backlink analysis, and
                competitive intelligence. For most sites, the two are
                complementary — not replacements.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Key stats */}
      <section className="py-14">
        <Container className="px-4">
          <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-lg font-bold text-gray-950 dark:text-zinc-50">
              Key stats: AEO checker vs SEO tools at a glance
            </h2>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'AEO Checker price', value: 'Free + $19 report' },
                { label: 'Ahrefs starting price', value: '$129/month' },
                { label: 'Semrush starting price', value: '$139.95/month' },
                { label: 'Sitechecker starting price', value: '$49/month' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <p className="text-gray-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-950 dark:text-zinc-50">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Comparison table */}
      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <IconFileAnalytics
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                AEO checker vs SEO tools compared
              </h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Criteria</th>
                    <th className="px-4 py-3 font-semibold">
                      AI Search Readiness (AEO Checker)
                    </th>
                    <th className="px-4 py-3 font-semibold">Ahrefs</th>
                    <th className="px-4 py-3 font-semibold">Semrush</th>
                    <th className="px-4 py-3 font-semibold">Sitechecker</th>
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
                        {row.ahrefs}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.semrush}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.sitechecker}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* When to use each */}
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
                  When to use the AEO checker
                </h2>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-zinc-300">
                {whenToUseAEO.map((item) => (
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
                <IconSearch
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                  When to use traditional SEO tools
                </h2>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-zinc-300">
                {whenToUseSEO.map((item) => (
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
          </div>
        </Container>
      </section>

      {/* How to choose */}
      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              How to combine AEO and SEO tools in one workflow
            </h2>
            <ol className="mt-5 space-y-4 text-gray-700 dark:text-zinc-300">
              <li>
                <strong>1. Start with the free AEO checker.</strong> Enter your
                URL and get an AI readiness score. Fix the flagged issues first —
                they are usually quick wins (add LLMs.txt, update robots.txt for
                AI crawlers, add schema).
              </li>
              <li>
                <strong>2. Set up Google Search Console and Bing Webmaster Tools.</strong>{' '}
                Both are free. Submit your sitemap. These give you real ranking
                and indexing data — the foundation before paying for any SEO
                tool.
              </li>
              <li>
                <strong>3. Add an SEO tool when you need ongoing monitoring.</strong>{' '}
                Once you have more than a handful of pages and want keyword rank
                tracking, backlink data, and competitor analysis, pick an SEO
                platform that fits your budget and scale.
              </li>
              <li>
                <strong>4. Re-run the AEO checker after major changes.</strong>{' '}
                New pages, redesigns, or content overhauls can break AI
                readiness. Re-check to catch regressions.
              </li>
            </ol>
          </div>
        </Container>
      </section>

      {/* FAQ */}
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

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl rounded-lg bg-gray-950 p-8 text-center text-white dark:bg-zinc-100 dark:text-gray-950">
            <h2 className="text-2xl font-bold">
              See where your site stands before paying for an SEO tool
            </h2>
            <p className="mt-3 text-sm text-gray-300 dark:text-zinc-600">
              Run the free AEO audit to check AI search readiness. Then use GSC
              for traditional SEO data. Add paid SEO tools when you need ongoing
              monitoring at scale.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-vs-seo-tools&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free AEO checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/blog/aeo-vs-seo?utm_source=compare&utm_medium=organic&utm_campaign=seo-aeo-checker-vs-seo-tools&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 dark:border-zinc-400 dark:text-gray-950 dark:hover:border-zinc-600"
              >
                Read: AEO vs SEO explained
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

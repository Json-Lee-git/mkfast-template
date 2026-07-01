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
} from '@tabler/icons-react';

const comparisonRows = [
  {
    criteria: 'Best fit',
    aiSearchReadiness:
      'Fast LLMs.txt format validation, link checking, content type verification, and AI crawler audit in one scan',
    manualCheck:
      'When you want to read the raw file and visually verify formatting and links',
    genericValidator:
      'When you need markdownlint or generic Markdown validation without AI-specific checks',
  },
  {
    criteria: 'What it checks',
    aiSearchReadiness:
      'LLMs.txt format, content type header, all link validity, LLMs-full.txt presence, companion file consistency, AI crawler access in robots.txt',
    manualCheck:
      'Visual inspection of Markdown syntax, link destinations, file accessibility',
    genericValidator:
      'Markdown syntax errors, line length, heading structure — no AI-specific awareness',
  },
  {
    criteria: 'Link validation',
    aiSearchReadiness:
      'Tests every link in LLMs.txt and LLMs-full.txt — reports HTTP status codes for broken links',
    manualCheck:
      'Manual click-through of each link — fast for small files, tedious for large ones',
    genericValidator:
      'Checks link syntax (Markdown format) but not whether the URL actually resolves',
  },
  {
    criteria: 'AI crawler check',
    aiSearchReadiness:
      'Scans robots.txt for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended',
    manualCheck: 'Requires reading robots.txt line by line and cross-referencing docs',
    genericValidator: 'No AI crawler awareness',
  },
  {
    criteria: 'Content type verification',
    aiSearchReadiness:
      'Confirms LLMs.txt is served as text/plain or text/markdown, not text/html',
    manualCheck:
      'Requires curl or browser dev tools to inspect response headers',
    genericValidator: 'No — validates file content, not HTTP headers',
  },
  {
    criteria: 'Companion file check',
    aiSearchReadiness:
      'Verifies LLMs-full.txt accessibility and cross-references with LLMs.txt links',
    manualCheck: 'Manual verification of each companion file',
    genericValidator: 'No',
  },
  {
    criteria: 'Speed',
    aiSearchReadiness:
      'Enter URL, get results in seconds — includes link checking and header inspection',
    manualCheck:
      '5-15 minutes depending on file size and number of links to verify',
    genericValidator: 'Seconds for syntax only; no link resolution',
  },
  {
    criteria: 'Cost',
    aiSearchReadiness: 'Free',
    manualCheck: 'Free (your time)',
    genericValidator: 'Free to paid (depends on tool)',
  },
];

const whenToUseChecker = [
  'You just created an LLMs.txt file and want to validate it before publishing',
  'You need to verify all links in your LLMs.txt resolve correctly',
  'You want to confirm the content type header is correct (not text/html)',
  'You need to check AI crawler access alongside LLMs.txt validation',
  'You want a one-click audit of your entire AI search file readiness',
];

const whenToUseManual = [
  'Your file has fewer than 5 links and can be checked visually',
  'You want to read the descriptions and verify human-facing copy quality',
  'You are iterating on a draft and don\'t need a full audit yet',
];

const faqItems = [
  {
    q: 'What is the best LLMs.txt checker?',
    a: 'The best LLMs.txt checker depends on what you need. Use our free LLMs.txt Checker when you want fast format validation, link checking, content type verification, and AI crawler audit in one tool. Use manual inspection for small files or copy review. Use generic Markdown linters only when you need basic syntax checking without AI-specific awareness.',
  },
  {
    q: 'Can I validate my LLMs.txt file manually?',
    a: 'Yes. For a small LLMs.txt file with 5-10 links, manual validation takes about 5 minutes: check each link resolves, confirm the content type header, and verify the Markdown renders correctly. For larger files or when you need AI crawler checks alongside LLMs.txt validation, an automated checker saves significant time.',
  },
  {
    q: 'What should an LLMs.txt checker validate?',
    a: 'A good LLMs.txt checker should validate: (1) the file is accessible at /llms.txt and returns 200, (2) the content type is text/plain or text/markdown, (3) all links resolve correctly, (4) the Markdown format follows the proposal conventions, (5) the companion LLMs-full.txt is accessible if referenced, and (6) related AI crawler access rules in robots.txt are correct.',
  },
  {
    q: 'Does my LLMs.txt file need to pass every check?',
    a: 'Not necessarily. The LLMs.txt format is a community convention, not a strict standard. The most important checks are: the file is accessible (200 status), the content type is correct (not HTML), and links resolve. Minor formatting variations are usually fine as long as the file is readable by both humans and AI models.',
  },
  {
    q: 'How often should I check my LLMs.txt file?',
    a: 'Check whenever you add or remove pages from your LLMs.txt, after site restructures, or when you notice broken links. For most sites, a monthly re-check is sufficient. If your site changes frequently (weekly blog posts, new documentation), schedule a check after every major content update.',
  },
  {
    q: 'What is the difference between an LLMs.txt checker and an LLMs.txt generator?',
    a: 'A checker validates an existing LLMs.txt file — format, links, headers, and AI crawler access. A generator creates a new LLMs.txt file from scratch, usually by scanning your sitemap. Use the checker when you already have a file and want to verify it. Use the generator when you need to create one from scratch. We offer both tools for free.',
  },
];

export const Route = createFileRoute('/compare/llms-txt-checker-alternatives')({
  head: () => ({
    ...seo('/compare/llms-txt-checker-alternatives', {
      title:
        'Best LLMs.txt Checker Alternatives — Compare Free Validation Tools',
      description:
        'Compare LLMs.txt checker alternatives for format validation, link checking, AI crawler access, and file readiness. Find the right tool for your AI search workflow.',
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          { name: 'Compare', url: getCanonicalUrl('/compare/llms-txt-checker-alternatives') },
          { name: 'LLMs.txt Checker Alternatives', url: getCanonicalUrl('/compare/llms-txt-checker-alternatives') },
        ])
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        itemListSchema('/compare/llms-txt-checker-alternatives', [
          {
            name: 'AI Search Readiness LLMs.txt Checker',
            url: getCanonicalUrl('/tools/llms-txt-checker'),
            description:
              'Free LLMs.txt validator that checks format, links, content type, and AI crawler access in one scan.',
          },
          {
            name: 'Manual LLMs.txt validation',
            url: getCanonicalUrl('/guides/llms-txt-file'),
            description:
              'Manual inspection of LLMs.txt format, links, and content type using browser developer tools.',
          },
          {
            name: 'Generic Markdown validator',
            url: getCanonicalUrl('/tools/llms-txt-generator'),
            description:
              'Standard Markdown linting tools that check syntax but lack AI-specific file awareness.',
          },
        ])
      ),
    ],
  }),
  component: LLMsTxtCheckerAlternativesPage,
});

function LLMsTxtCheckerAlternativesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-200 py-16 dark:border-zinc-800/50 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              LLMs.txt checker alternatives
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Best LLMs.txt checker alternatives for AI search readiness
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
              Compare free LLMs.txt validation tools, manual checking workflows,
              and automated audits. Find the approach that matches your file
              complexity and update frequency.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/llms-txt-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-llms-txt-checker-alternatives&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free LLMs.txt Checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/llms-txt-generator?utm_source=compare&utm_medium=organic&utm_campaign=seo-llms-txt-checker-alternatives&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                Try LLMs.txt Generator
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
                The best LLMs.txt checker alternative depends on your file size
                and update frequency. Use our free LLMs.txt Checker when you need
                automated format validation, link checking, and AI crawler audit
                in one scan. Use manual inspection for small files with fewer
                than 5 links. Use a generic Markdown validator only when you need
                basic syntax checking and already have a separate AI crawler
                audit workflow.
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
              Key stats: LLMs.txt checker comparison at a glance
            </h2>
            <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Our checker', value: 'Free, 7 checks in one scan' },
                { label: 'Checks per scan', value: 'Format + links + headers + AI crawlers' },
                { label: 'Manual check time', value: '5-15 min per file' },
                { label: 'Sites with working LLMs.txt', value: '~2 out of 13 we tested' },
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
                LLMs.txt checker alternatives compared
              </h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Criteria</th>
                    <th className="px-4 py-3 font-semibold">
                      AI Search Readiness (LLMs.txt Checker)
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Manual validation
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Generic Markdown validator
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
                        {row.manualCheck}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.genericValidator}
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
                <IconCheck
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                  When to use the LLMs.txt Checker
                </h2>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-zinc-300">
                {whenToUseChecker.map((item) => (
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
                <IconCheck
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
                <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                  When manual checking is enough
                </h2>
              </div>
              <ul className="space-y-3 text-gray-700 dark:text-zinc-300">
                {whenToUseManual.map((item) => (
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
              Validate your LLMs.txt before your next deploy
            </h2>
            <p className="mt-3 text-sm text-gray-300 dark:text-zinc-600">
              Run the free checker to validate format, test links, verify content
              type headers, and audit AI crawler access — all in one scan.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/llms-txt-checker?utm_source=compare&utm_medium=organic&utm_campaign=seo-llms-txt-checker-alternatives&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free LLMs.txt Checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/guides/llms-txt-file?utm_source=compare&utm_medium=organic&utm_campaign=seo-llms-txt-checker-alternatives&utm_content=cta-bottom"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 dark:border-zinc-400 dark:text-gray-950 dark:hover:border-zinc-600"
              >
                Read: LLMs.txt guide
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

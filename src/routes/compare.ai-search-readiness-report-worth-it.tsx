import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import {
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
  IconX,
} from '@tabler/icons-react';

const valueRows = [
  {
    question: 'Do I know what to fix first?',
    freeTool: 'Basic score and top issues',
    fullReport: 'Prioritized P1/P2 fix plan with implementation order',
  },
  {
    question: 'Can I hand this to a developer?',
    freeTool: 'Needs interpretation',
    fullReport: 'Implementation handoff with copy-ready snippets',
  },
  {
    question: 'Do I get schema I can paste?',
    freeTool: 'Schema presence check',
    fullReport: 'Copy-ready JSON-LD examples for the page',
  },
  {
    question: 'Do I get content improvements?',
    freeTool: 'Answer-ready content signals',
    fullReport: 'Direct answer blocks, FAQ ideas, and query fan-out gaps',
  },
  {
    question: 'Does it guarantee results?',
    freeTool: 'No',
    fullReport: 'No. It improves readiness, not rankings or citations.',
  },
];

const goodFit = [
  'You have one important page that needs to be fixed now.',
  'You need a clear handoff for schema, LLMs.txt, FAQs, and answer blocks.',
  'You want to avoid a monthly SEO subscription for a one-page problem.',
  'You are deciding whether a larger SEO or GEO audit is worth it.',
];

const notFit = [
  'You need guaranteed rankings, traffic, or AI citations.',
  'You need backlink research, keyword volume, or rank tracking.',
  'You need an agency to implement changes directly in your CMS.',
  'You already have an expert SEO operator doing a full manual audit.',
];

const faqItems = [
  {
    q: 'Is the $19 AI Visibility Fix Pack worth it?',
    a: 'It is worth it when you need a concrete one-page repair plan: prioritized fixes, copy-ready schema, answer-ready content blocks, LLMs.txt recommendations, and query coverage gaps. It is not a replacement for rank tracking, backlink research, or a full agency audit.',
  },
  {
    q: 'What is the difference between the free scan and the $19 Fix Pack?',
    a: 'The free scan gives a quick score and readiness signals. The Fix Pack expands that into a prioritized repair plan, copy-ready JSON-LD, content blocks, AI file recommendations, and a handoff you can give to a developer or SEO operator.',
  },
  {
    q: 'Will the Fix Pack get my site cited by ChatGPT?',
    a: 'No. No Fix Pack can guarantee citations in ChatGPT, Claude, Gemini, Perplexity, or Google AI Overviews. It helps remove technical and content blockers that make citation less likely.',
  },
  {
    q: 'Should I buy this before using Google Search Console?',
    a: 'No. Set up Google Search Console and submit your sitemap first. Use the Fix Pack when a specific page matters and you need implementation-ready fixes.',
  },
];

function WorthItPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-gray-200 py-16 dark:border-zinc-800/50 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              $19 Fix Pack decision guide
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Is the AI Visibility Fix Pack worth it?
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
              Use this page to decide whether the free scan is enough, or
              whether the $19 Fix Pack gives you a useful implementation handoff
              for one important page.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/sample-aeo-report"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Preview sample Fix Pack
                <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                Run free scan first
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mx-auto max-w-4xl rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
            <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
              Short answer
            </h2>
            <p className="mt-3 text-gray-700 dark:text-zinc-300">
              The $19 Fix Pack is worth it if you need specific fixes you can
              paste into a page or hand to a developer. It is not worth it if
              you expect guaranteed rankings, citations, or a full SEO platform.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center gap-3">
              <IconFileAnalytics
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                Free scan vs $19 Fix Pack
              </h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Question</th>
                    <th className="px-4 py-3 font-semibold">Free scan</th>
                    <th className="px-4 py-3 font-semibold">$19 Fix Pack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                  {valueRows.map((row) => (
                    <tr key={row.question}>
                      <td className="px-4 py-3 font-medium text-gray-950 dark:text-zinc-100">
                        {row.question}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">
                        {row.freeTool}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                        {row.fullReport}
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
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
                Buy it when
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-zinc-300">
                {goodFit.map((item) => (
                  <li key={item} className="flex gap-2">
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
              <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
                Skip it when
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                {notFit.map((item) => (
                  <li key={item} className="flex gap-2">
                    <IconX
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              The practical decision rule
            </h2>
            <p className="mt-4 text-gray-700 dark:text-zinc-300">
              If the page can make or save more than $19 and you do not already
              know the next implementation steps, the Fix Pack is a reasonable
              purchase. If you only want to learn the concept, use the free
              checklist and free scan first.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Frequently asked questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>
    </main>
  );
}

export const Route = createFileRoute(
  '/compare/ai-search-readiness-report-worth-it'
)({
  head: () => ({
    ...seo('/compare/ai-search-readiness-report-worth-it', {
      title: 'Is the AI Visibility Fix Pack Worth It? $19 Guide',
      description:
        'Decide whether the $19 AI Visibility Fix Pack is worth it. Compare the free scan with the repair plan, deliverables, limits, and best-fit use cases.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'AI Visibility Fix Pack',
          websiteUrl: getCanonicalUrl(
            '/compare/ai-search-readiness-report-worth-it'
          ),
          longDescription:
            'A one-page AI search readiness Fix Pack with a prioritized repair plan, copy-ready schema, answer-ready content blocks, LLMs.txt recommendations, and implementation handoff.',
          startingPrice: '$19',
          keyFeatures: [
            'Prioritized AI visibility fixes',
            'Copy-ready JSON-LD',
            'Answer-ready content blocks',
            'Query coverage gaps',
            'LLMs.txt recommendations',
            'Implementation handoff',
          ],
        })
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        itemListSchema('/compare/ai-search-readiness-report-worth-it', [
          {
            name: 'Sample AI Visibility Report',
            url: getCanonicalUrl('/sample-aeo-report'),
          },
          {
            name: 'AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
          },
          {
            name: 'AI Search Readiness Checklist',
            url: getCanonicalUrl('/guides/ai-search-readiness-checklist'),
          },
        ])
      ),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Report Value Guide',
            url: getCanonicalUrl(
              '/compare/ai-search-readiness-report-worth-it'
            ),
          },
        ])
      ),
    ],
  }),
  component: WorthItPage,
});

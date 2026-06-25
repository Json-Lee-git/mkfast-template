import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

const faqItems = [
  {
    q: 'What is query fan-out?',
    a: 'Query fan-out is the idea that an AI search system may expand one user query into multiple related sub-queries, intents, entities, and content checks before producing an answer.',
  },
  {
    q: 'Is query fan-out the same as keyword research?',
    a: 'No. Keyword research studies terms people search for. Query fan-out models how an AI system may decompose a query into related questions, tasks, comparisons, and gaps.',
  },
  {
    q: 'Does this site show real Google AI Mode fan-out queries?',
    a: 'No. The tool is a simulation for planning answer-ready content. It does not extract live Google AI Mode data, private search data, or real AI search platform results.',
  },
  {
    q: 'How should SEOs use query fan-out?',
    a: 'Use it to identify missing subtopics, question headings, FAQ sections, comparison angles, internal links, and content gaps that a single keyword list may miss.',
  },
  {
    q: 'Can query fan-out guarantee AI citations?',
    a: 'No. Query fan-out can help plan broader coverage, but it does not guarantee rankings, citations, traffic, or visibility in any AI search product.',
  },
];

const workflow = [
  'Start with the main query or topic your page should answer',
  'Generate related sub-queries and intent clusters',
  'Turn important sub-queries into H2 and H3 sections',
  'Add short, direct answer paragraphs near each question heading',
  'Use FAQ questions to cover follow-up intent',
  'Run the AEO Checker to audit structured data, crawlability, and trust signals',
];

function articleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Query Fan-Out Guide',
    description:
      'Learn how query fan-out helps plan answer-ready content for AI search and AEO workflows.',
    url: getCanonicalUrl('/guides/query-fan-out'),
    mainEntityOfPage: getCanonicalUrl('/guides/query-fan-out'),
    publisher: {
      '@type': 'Organization',
      name: 'AI Search Readiness Tools',
      url: getCanonicalUrl('/'),
    },
  };
}

function QueryFanOutGuidePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Query Fan-Out Guide
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Learn how AI search systems may expand a query into related
              sub-queries, intents, entities, and content gaps.
            </p>
            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              Last updated: June 25, 2026
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <article className="mx-auto max-w-3xl prose prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-zinc-100 prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>Short answer</h2>
            <p>
              <strong>
                Query fan-out is a planning model for how AI search systems may
                expand one query into related sub-queries, intents, and content
                checks before forming an answer.
              </strong>
            </p>
            <p>
              It helps SEOs and content teams find missing sections, FAQ
              questions, comparison angles, and internal link opportunities.
            </p>

            <h2>What is query fan-out?</h2>
            <p>
              In traditional SEO, a page often starts with a primary keyword and
              a set of related keywords. In AI search, a system may interpret
              the user request, break it into smaller information needs, fetch
              supporting context, and synthesize a direct answer. Query fan-out
              is a way to model that expansion.
            </p>

            <h2>Example</h2>
            <p>
              A user may search for "AEO audit". An AI search system may also
              need answers to related questions:
            </p>
            <ul>
              <li>What does AEO mean?</li>
              <li>How is AEO different from SEO?</li>
              <li>What technical signals does an AEO audit check?</li>
              <li>Does structured data help answer engines?</li>
              <li>What should be fixed first?</li>
            </ul>

            <h2>Query fan-out workflow</h2>
            <div className="not-prose mt-6 space-y-3">
              {workflow.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <IconCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <h2>How it supports AEO</h2>
            <p>
              Query fan-out helps with the content side of AEO. It can reveal
              missing definitions, question headings, comparison sections,
              examples, caveats, and follow-up answers. After you add those
              sections, a technical AEO audit can check whether the page is
              crawlable, structured, and trustworthy.
            </p>

            <h2>What not to expect</h2>
            <p>
              Query fan-out is not live AI visibility tracking and it is not a
              citation checker. A simulated fan-out list is useful for content
              planning, but it does not prove that any AI product uses the exact
              same sub-queries.
            </p>
          </article>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Generate fan-out ideas
            </h2>
            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Use the free tool to simulate sub-queries, intent clusters,
              recommended headings, FAQ questions, and content gaps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/query-fan-out-tool"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Generate Fan-Out Queries <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300"
              >
                Run AEO Checker
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Real-world example */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Real-world example: "best time tracking software for freelancers"
            </h2>
            <p className="mt-6 text-gray-500 dark:text-zinc-400">
              When a freelancer searches this phrase, an AI system does not just
              find pages with those keywords. It fans out into sub-queries:
              "time tracking apps with invoicing," "free vs paid time trackers,"
              "Toggl vs Clockify comparison," "project-based vs hourly billing
              tools." A site covering only the main keyword without the
              sub-topics leaves content gaps. Run this query through the{' '}
              <a
                href="/tools/query-fan-out-tool"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Query Fan-Out Tool
              </a>{' '}
              to see what a full coverage plan looks like.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

export const Route = createFileRoute('/guides/query-fan-out')({
  head: () => ({
    ...seo('/guides/query-fan-out', {
      title: 'Query Fan-Out Guide - Plan AI Search Content Coverage',
      description:
        'Learn what query fan-out means, how AI search may expand queries, and how to use fan-out ideas for answer-ready content planning.',
      type: 'article',
    }),
    scripts: [
      jsonLd(articleSchema()),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Query Fan-Out Guide',
            url: getCanonicalUrl('/guides/query-fan-out'),
          },
        ])
      ),
    ],
  }),
  component: QueryFanOutGuidePage,
});

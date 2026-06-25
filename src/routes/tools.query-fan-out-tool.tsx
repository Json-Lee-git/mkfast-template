import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import {
  runQueryFanOut,
  type FanOutResult,
} from '@/api/ai-readiness/query-fan-out';
import { useState } from 'react';
import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import { IconArrowRight, IconLoader2 } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

const faqItems = [
  {
    q: 'What is a query fan-out tool?',
    a: 'A query fan-out tool simulates how AI search engines may break a single user query into multiple related sub-queries. It helps content creators and SEOs identify related questions, content angles, and topic gaps to cover.',
  },
  {
    q: 'Does this tool use real Google AI Mode data?',
    a: 'No. This is a simulated tool. It does not extract live Google AI Mode queries, private search data, or any real AI search platform results.',
  },
  {
    q: 'How should I use the fan-out results?',
    a: 'Use the sub-queries to plan blog posts, guide sections, and FAQ pages. Use the recommended headings to structure your content. Use the content gaps to find topics you are missing.',
  },
  {
    q: 'Is query fan-out the same as keyword research?',
    a: 'They are related but not the same. Keyword research finds search terms people actually type. Query fan-out simulates how AI systems might expand a query conceptually, which can surface angles that keyword tools miss.',
  },
];

function QueryFanOutPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FanOutResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = query.trim();
    if (!t) {
      setError('Please enter a query or topic.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await runQueryFanOut({ data: { query: t } });
      setResult(r);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const r = result;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Query Fan-Out Tool
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Simulate how AI search engines may break a query into related
              sub-queries, search intents, and content gaps.
            </p>
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="py-12">
        <Container>
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter a topic or query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />{' '}
                    Generating...
                  </>
                ) : (
                  'Generate Fan-Out Queries'
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              This is a simulated query fan-out tool. It does not extract live
              Google AI Mode queries or private search data.
            </p>
          </form>
        </Container>
      </section>

      {error && (
        <section className="pb-8">
          <Container>
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-4 text-center">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </Container>
        </section>
      )}

      {loading && (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 text-center">
              <IconLoader2
                size={48}
                className="mx-auto animate-spin text-blue-500"
              />
              <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
                Generating fan-out queries for "{query}".
              </p>
            </div>
          </Container>
        </section>
      )}

      {r && (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Main intent
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                  {r.mainIntent}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Fan-out queries
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {r.fanOutQueries.map((q) => (
                    <li
                      key={q}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400"
                    >
                      <span className="text-blue-500">-</span> {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Intent clusters
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.intentClusters.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-blue-50 dark:bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Recommended headings
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {r.recommendedHeadings.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400"
                    >
                      <span className="text-emerald-500 text-xs font-mono">
                        H{i + 1}
                      </span>{' '}
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  FAQ questions
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {r.faqQuestions.map((q) => (
                    <li
                      key={q}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400"
                    >
                      <span className="text-amber-500">Q:</span> {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Content gaps
                </h2>
                <ul className="mt-3 space-y-1.5">
                  {r.contentGaps.map((g) => (
                    <li
                      key={g}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <span className="text-red-500">-</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
                <h2 className="font-semibold text-gray-800 dark:text-zinc-200">
                  Suggested internal link targets
                </h2>
                <ul className="mt-3 space-y-3">
                  {r.suggestedInternalLinks.map((link) => (
                    <li key={link.href} className="text-sm">
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {link.label} <IconArrowRight size={14} />
                      </a>
                      <p className="mt-1 text-gray-500 dark:text-zinc-400">
                        {link.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center pt-4">
                <a
                  href="/tools/aeo-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                >
                  Run AEO Checker on your page <IconArrowRight size={16} />
                </a>
                <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                  Use the headings and FAQ questions above to improve your
                  content, then audit your page with the AEO Checker.
                </p>
                <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                  The AEO Checker also includes the $19 Full Report early access
                  CTA.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Related tools:{' '}
              <a
                href="/tools/aeo-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                AEO Checker
              </a>
              ,{' '}
              <a
                href="/tools/llms-txt-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt Checker
              </a>
              , and{' '}
              <a
                href="/tools/llms-txt-generator"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt Generator
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              These tools provide technical readiness checks. They do not
              guarantee rankings, citations, traffic, or visibility in ChatGPT,
              Perplexity, Gemini, Claude, Google AI Overviews, or other AI
              search products.
            </p>
          </div>
        </Container>
      </section>
      <div className="h-8" />
    </div>
  );
}

export const Route = createFileRoute('/tools/query-fan-out-tool')({
  head: () => ({
    ...seo('/tools/query-fan-out-tool', {
      title: 'Free Query Fan-Out Tool for AI Search SEO',
      description:
        'Simulate how ChatGPT, Perplexity, and other AI search engines expand a query into sub-queries, intent clusters, and content gaps. Use query fan-out to plan comprehensive, answer-ready content for AI search visibility.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'Query Fan-Out Tool',
          websiteUrl: getCanonicalUrl('/tools/query-fan-out-tool'),
          longDescription:
            'Simulate how AI search engines may expand a query into sub-queries, intents, content gaps, headings, and FAQ questions.',
          startingPrice: '$0',
          keyFeatures: [
            'Fan-out sub-query simulation',
            'Intent clusters',
            'Content gap ideas',
            'Recommended headings',
            'FAQ questions',
            'Suggested internal links',
          ],
        })
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Query Fan-Out Tool',
            url: getCanonicalUrl('/tools/query-fan-out-tool'),
          },
        ])
      ),
    ],
  }),
  component: QueryFanOutPage,
});

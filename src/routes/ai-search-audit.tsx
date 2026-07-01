import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { createManualAuditCheckout } from '@/api/ai-readiness/service-checkout';
import { trackConversionEvent } from '@/lib/conversion-events';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import {
  IconArrowRight,
  IconCheck,
  IconCreditCard,
  IconFileAnalytics,
  IconLoader2,
  IconMail,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useState } from 'react';

const includedItems = [
  'AI search readiness score for one important page',
  'Top 5 technical and content blockers',
  'AI crawler, robots.txt, sitemap, and LLMs.txt review',
  'Schema and answer-ready content recommendations',
  'Competitor visibility notes for up to 3 sites',
  'Prioritized implementation checklist',
];

const processSteps = [
  {
    title: 'Submit one important URL',
    desc: 'Use your homepage, product page, landing page, or comparison page.',
  },
  {
    title: 'Pay through Creem',
    desc: 'No sales call required. The order goes straight into the audit queue.',
  },
  {
    title: 'Get the report in 48 hours',
    desc: 'You receive a concise Markdown report with the first fixes to make.',
  },
];

const faqItems = [
  {
    q: 'Is this a software report or a human audit?',
    a: 'It is a human-reviewed AI Search Readiness Audit. The free tools provide the starting scan; the manual audit turns that into a specific fix plan for your page.',
  },
  {
    q: 'Do I need to join a sales call?',
    a: 'No. Submit the URL, pay through checkout, and receive the report by email. If clarification is needed, it can be handled asynchronously.',
  },
  {
    q: 'Does this guarantee ChatGPT or Google AI Overview citations?',
    a: 'No. The audit identifies readiness gaps and implementation priorities. It does not guarantee rankings, citations, traffic, or AI search visibility.',
  },
];

function AuditServicePage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      trackConversionEvent('manual_audit_checkout_started', {
        url: websiteUrl,
      });
      const res = await createManualAuditCheckout({
        data: {
          websiteUrl,
          email,
          competitors,
          notes,
        },
      });

      if (!res.url) {
        throw new Error('Checkout URL was not returned');
      }

      window.location.href = res.url;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Checkout failed. Please try again or email support.'
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <section className="border-b border-gray-200 bg-white py-16 dark:border-zinc-800/60 dark:bg-zinc-950">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300">
                <IconFileAnalytics size={15} />
                Done-for-you AI Search Readiness Audit
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-5xl">
                Get a human fix plan for ChatGPT and AI search visibility
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
                Send one important page. I review its crawlability, answer
                structure, schema, LLMs.txt readiness, trust signals, and
                competitor context, then send a prioritized report you can act
                on.
              </p>
              <div className="mt-7 grid gap-3 text-sm text-gray-600 dark:text-zinc-400 sm:grid-cols-3">
                {[
                  '$99 intro price',
                  '48-hour delivery',
                  'No Zoom required',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    <IconCheck
                      size={15}
                      className="shrink-0 text-emerald-500"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                    Manual audit
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-zinc-50">
                    $99
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <IconCreditCard size={20} />
                </div>
              </div>

              <label className="mt-6 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Website URL
                <input
                  required
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Competitors, optional
                <textarea
                  value={competitors}
                  onChange={(event) => setCompetitors(event.target.value)}
                  placeholder="Up to 3 competitor URLs"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Notes, optional
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Main market, product, or page goal"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              {error ? (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    Order $99 audit <IconArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500 dark:text-zinc-500">
                <IconShieldCheck size={14} className="mt-0.5 shrink-0" />
                Secure checkout is handled by Creem. You receive the report by
                email after payment.
              </p>
            </form>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                What you receive
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
                This is built for founders and small SaaS teams who do not want
                another dashboard. The output is a short, prioritized fix list.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300"
                >
                  <IconCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/60">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-gray-950 dark:text-zinc-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/60">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Important limits
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
              AI search is not a controllable ad channel. The audit focuses on
              page readiness, crawl access, clarity, structured data, and
              content gaps. It can improve the quality of your page and reduce
              obvious blockers, but it cannot guarantee citations or traffic.
            </p>
            <a
              href="mailto:support@aeocheck.xyz"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <IconMail size={16} />
              Questions before ordering?
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/ai-search-audit')({
  head: () => ({
    ...seo('/ai-search-audit', {
      title: 'Manual AI Search Readiness Audit - Human Fix Plan in 48 Hours',
      description:
        'Order a $99 human AI Search Readiness Audit for one important SaaS page. Get crawlability, schema, LLMs.txt, answer-ready content, and competitor visibility fixes.',
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Manual AI Search Readiness Audit',
            url: getCanonicalUrl('/ai-search-audit'),
          },
        ])
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Manual AI Search Readiness Audit',
        description:
          'Human-reviewed AI search readiness audit for SaaS pages, including technical blockers, schema, LLMs.txt readiness, answer-ready content, and prioritized fixes.',
        provider: {
          '@type': 'Organization',
          name: 'AEO Check',
          url: getCanonicalUrl('/'),
        },
        areaServed: 'Worldwide',
        offers: {
          '@type': 'Offer',
          price: '99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: getCanonicalUrl('/ai-search-audit'),
        },
      }),
    ],
  }),
  component: AuditServicePage,
});

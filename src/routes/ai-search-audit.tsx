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
import { useEffect, useState } from 'react';
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

const includedItems = [
  'AI Search Readiness Score for one important page',
  'Top 5 technical and content blockers',
  'AI crawler, robots.txt, sitemap, and LLMs.txt review',
  'Schema and answer-ready content recommendations',
  'Competitor visibility notes for up to 3 sites',
  'Prioritized implementation checklist',
];

const proofItems = [
  '$99 one-time review',
  'Use after the free scan',
  '48-hour email delivery',
];

const checkoutSummaryItems = [
  'One public page reviewed by a human',
  'Markdown report delivered by email',
  'Priority fixes for AI crawlers, schema, and answer-ready content',
];

const bestFitItems = [
  'A SaaS homepage, product page, comparison page, or launch page matters commercially.',
  'The free scan found issues, but you need a human fix order before editing.',
  'You want copy-ready recommendations for schema, FAQs, answer blocks, and LLMs.txt.',
  'You need a concise handoff instead of an ongoing SEO retainer or dashboard.',
];

const notFitItems = [
  'You need guaranteed rankings, traffic, ChatGPT citations, or Google AI Overview inclusion.',
  'You need backlink research, keyword volume research, or enterprise rank tracking.',
  'You want someone to implement the changes directly in your CMS or codebase.',
];

const relatedResources = [
  { label: 'Run the free AEO checker first', href: '/tools/aeo-checker' },
  { label: 'Preview a sample AEO report', href: '/sample-aeo-report' },
  {
    label: 'Read the AI search readiness audit framework',
    href: '/blog/ai-search-readiness-audit',
  },
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
  {
    q: 'Which page should I submit?',
    a: 'Submit one commercially important public page: a homepage, SaaS product page, comparison page, launch page, documentation hub, or guide that you want AI search systems to understand clearly.',
  },
  {
    q: 'How is this different from the free AEO checker?',
    a: 'The free checker gives a fast technical scan. The manual audit adds human prioritization, competitor context, copy-ready recommendations, and a concise implementation handoff for one page.',
  },
];

function AuditServicePage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [email, setEmail] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    trackConversionEvent('manual_audit_page_viewed');
  }, []);

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

      trackConversionEvent('manual_audit_checkout_redirected', {
        url: websiteUrl,
      });
      window.location.href = res.url;
    } catch (err) {
      console.error(err);
      trackConversionEvent('manual_audit_checkout_failed', {
        url: websiteUrl,
        reason: err instanceof Error ? err.message : 'unknown',
      });
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
              <div className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <IconFileAnalytics size={15} />
                Human review for high-value pages
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-5xl">
                When the free scan needs a human fix order
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
                Use this for one commercial page where the next edits matter.
                You get a human-reviewed priority order across crawl access,
                answer structure, schema, LLMs.txt readiness, trust signals, and
                competitor context.
              </p>
              <div className="mt-7 grid gap-3 text-sm text-gray-600 dark:text-zinc-400 sm:grid-cols-3">
                {proofItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    <IconCheck
                      size={15}
                      className="shrink-0 text-emerald-500"
                    />
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="#manual-audit-order"
                onClick={() =>
                  trackConversionEvent('manual_audit_primary_cta_clicked')
                }
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Go to order form <IconArrowRight size={16} />
              </a>
            </div>

            <form
              id="manual-audit-order"
              onSubmit={handleSubmit}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                    Human review
                  </p>
                  <p className="mt-1 text-3xl font-bold text-gray-950 dark:text-zinc-50">
                    $99
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                    One-time, no subscription. One page, one priority order,
                    delivered by email.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <IconCreditCard size={20} />
                </div>
              </div>

              <ul className="mt-5 space-y-2 border-y border-gray-200 py-4 text-sm text-gray-700 dark:border-zinc-800 dark:text-zinc-300">
                {checkoutSummaryItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <IconCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <label className="mt-6 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Website URL
                <input
                  required
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <span className="mt-1.5 block text-xs font-normal text-gray-500 dark:text-zinc-500">
                  Use the page that would matter most if AI systems understood
                  it better.
                </span>
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Email
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <span className="mt-1.5 block text-xs font-normal text-gray-500 dark:text-zinc-500">
                  Used only to deliver your report. Not shared, not added to any
                  list.
                </span>
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Competitors, optional
                <textarea
                  value={competitors}
                  onChange={(event) => setCompetitors(event.target.value)}
                  placeholder="Up to 3 competitor URLs"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-gray-800 dark:text-zinc-200">
                Notes, optional
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Main market, product, or page goal"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>

              {error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    Order human review - $99 <IconArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-gray-500 dark:text-zinc-500">
                <IconShieldCheck size={14} className="mt-0.5 shrink-0" />
                Secure checkout is handled by Creem. You receive the report by
                email after payment.{' '}
                <a
                  href="/sample-aeo-report"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Preview a sample report.
                </a>
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
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                Best fit for this audit
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-700 dark:text-zinc-300">
                {bestFitItems.map((item) => (
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
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
              <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
                Not the right fit when
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                {notFitItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <IconShieldCheck
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
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Useful before you order
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {relatedResources.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-24 items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200 dark:hover:border-blue-900 dark:hover:text-blue-300"
                >
                  <span>{item.label}</span>
                  <IconArrowRight size={16} className="mt-0.5 shrink-0" />
                </a>
              ))}
            </div>
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
      title: 'Manual AI Visibility Audit - Human Fix Order in 48 Hours',
      description:
        'Order a $99 human AI Visibility Audit after the free scan. Get a priority order for crawlability, schema, LLMs.txt, answer-ready content, and competitor context.',
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Manual AI Visibility Audit',
            url: getCanonicalUrl('/ai-search-audit'),
          },
        ])
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Manual AI Visibility Audit',
        description:
          'Human-reviewed AI search readiness audit for SaaS pages, including technical blockers, schema, LLMs.txt readiness, answer-ready content, and prioritized fixes.',
        provider: {
          '@type': 'Organization',
          name: 'AEOCheck',
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

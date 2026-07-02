import { trackConversionEvent } from '@/lib/conversion-events';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import Container from '@/components/layout/container';
import {
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
  IconMail,
} from '@tabler/icons-react';

function AuditThanksPage() {
  const { site } = Route.useSearch();

  useEffect(() => {
    trackConversionEvent('manual_audit_thanks_viewed', { site });
  }, [site]);

  return (
    <div className="min-h-screen">
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <IconCheck size={24} />
            </div>
            <h1 className="mt-5 text-3xl font-bold text-gray-950 dark:text-zinc-50">
              Payment received
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
              Your manual AI Search Readiness Audit is now in the queue. The
              report will be sent to your checkout email within 48 hours.
            </p>
            {site ? (
              <p className="mt-4 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                Audit site: {site}
              </p>
            ) : null}
            <div className="mt-7 grid gap-3 text-left sm:grid-cols-3">
              {[
                'URL and crawl access review',
                'Top AI-search blockers',
                'Prioritized fix checklist',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                >
                  <IconFileAnalytics
                    size={15}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run another free scan <IconArrowRight size={16} />
              </a>
              <a
                href="mailto:support@aeocheck.xyz"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <IconMail size={16} />
                Email support
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/ai-search-audit/thanks')({
  validateSearch: (search: Record<string, unknown>) => ({
    site: typeof search.site === 'string' ? search.site : '',
  }),
  head: () =>
    seo('/ai-search-audit/thanks', {
      title: 'AI Search Readiness Audit Order Received',
      description:
        'Your manual AI Search Readiness Audit order has been received.',
      noIndex: true,
    }),
  component: AuditThanksPage,
});

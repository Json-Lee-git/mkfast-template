import Container from '@/components/layout/container';
import { trackConversionEvent } from '@/lib/conversion-events';
import {
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
} from '@tabler/icons-react';

type RelatedLink = {
  label: string;
  href: string;
};

export type HighIntentToolPageProps = {
  kicker: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  checks: string[];
  signals: string[];
  deliverables: string[];
  related: RelatedLink[];
};

export function HighIntentToolPage({
  kicker,
  title,
  description,
  primaryLabel,
  primaryHref,
  checks,
  signals,
  deliverables,
  related,
}: HighIntentToolPageProps) {
  return (
    <div className="min-h-screen">
      <section className="border-b border-gray-200 bg-white py-20 dark:border-zinc-800/50 dark:bg-zinc-950 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {kicker}
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={primaryHref}
                onClick={() =>
                  trackConversionEvent('high_intent_primary_cta_clicked', {
                    page: title,
                    target: primaryHref,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                {primaryLabel} <IconArrowRight size={16} />
              </a>
              <a
                href="/sample-aeo-report"
                onClick={() =>
                  trackConversionEvent('sample_report_cta_clicked', {
                    source: title,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-200 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
              >
                Preview sample Fix Pack
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800/60 dark:bg-zinc-900/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400">
                <IconFileAnalytics size={20} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">
                What this page helps you check
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                {checks.map((check) => (
                  <li key={check} className="flex gap-2">
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-800/60 dark:bg-zinc-900/30">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                Readiness signals
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {signals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                  >
                    {signal}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                These are technical and content-readiness signals. They do not
                guarantee rankings, AI Overview inclusion, ChatGPT citations, or
                revenue, but they make the page easier for search and answer
                systems to parse.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                What the Fix Pack adds
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                {deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex gap-2">
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/tools/chatgpt-visibility-checker"
                onClick={() =>
                  trackConversionEvent('full_report_path_clicked', {
                    source: title,
                  })
                }
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
              >
                Start with AI visibility audit <IconArrowRight size={14} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Related AI visibility audit tools
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 dark:hover:border-zinc-700"
                >
                  {link.label}
                  <IconArrowRight size={14} />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

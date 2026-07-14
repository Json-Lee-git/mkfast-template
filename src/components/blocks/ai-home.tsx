import { AuditPreview } from '@/components/ai-visibility/audit-preview';
import { FAQ } from '@/components/ai-visibility/faq';
import { AIAnswerFramework } from '@/components/ai-visibility/ai-answer-framework';
import Container from '@/components/layout/container';
import { trackConversionEvent } from '@/lib/conversion-events';
import {
  IconArrowRight,
  IconCheck,
  IconSearch,
  IconScan,
  IconFileText,
  IconFileAnalytics,
} from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';

const signalLayers = [
  {
    label: 'Access',
    desc: 'Can AI crawlers reach the page?',
    status: 'pass' as const,
  },
  {
    label: 'Parse',
    desc: 'Is the page structure clean?',
    status: 'pass' as const,
  },
  {
    label: 'Extract',
    desc: 'Are answers easy to pull out?',
    status: 'warn' as const,
  },
  {
    label: 'Verify',
    desc: 'Are entity signals consistent?',
    status: 'warn' as const,
  },
  {
    label: 'Prioritize',
    desc: 'Which fixes matter first?',
    status: 'fail' as const,
  },
];

const previewCards = [
  {
    label: 'AI Visibility Score',
    value: '64/100',
    detail: 'Readiness-based. Not a ranking.',
    status: 'warn' as const,
  },
  {
    label: 'Top issue',
    value: 'No answer-ready summary',
    detail:
      'AI engines fall back to vague page signals without a clear definition block.',
    status: 'fail' as const,
  },
  {
    label: 'Fix this first',
    value: '3 prioritized repairs',
    detail: 'Schema, answer blocks, LLMs.txt — ordered by impact, copy-ready.',
    status: 'pass' as const,
  },
];

const toolShortcuts = [
  {
    icon: IconSearch,
    label: 'ChatGPT Visibility Checker',
    href: '/tools/chatgpt-visibility-checker',
  },
  { icon: IconScan, label: 'Free AEO checker', href: '/tools/aeo-checker' },
  {
    icon: IconFileText,
    label: 'llms.txt validator',
    href: '/tools/llms-txt-checker',
  },
  {
    icon: IconFileAnalytics,
    label: 'Sample Report',
    href: '/sample-aeo-report',
  },
];

const pricingTiers = [
  {
    label: 'Free scan',
    price: '$0',
    href: '/tools/chatgpt-visibility-checker',
  },
  {
    label: 'Fix Pack',
    price: '$19',
    href: '/tools/aeo-checker',
    note: 'one-time',
  },
  {
    label: 'Monitor',
    price: '$29',
    href: '/contact?intent=monitor',
    note: '/mo',
  },
  {
    label: 'Manual audit',
    price: '$99',
    href: '/ai-search-audit',
    note: 'one-time',
  },
];

const homeFAQ = [
  {
    q: 'What is AI search readiness?',
    a: 'AI search readiness is the repair layer behind AI visibility. It means your website is technically easy for search engines, answer engines, and AI-assisted retrieval systems to understand. It includes crawlability, structured data, LLMs.txt files, answer-ready content formatting, clear entity signals, and trust indicators.',
  },
  {
    q: 'Are these tools free?',
    a: 'The focused checkers and first page audit are free. The $19 Fix Pack adds a repair plan and copy-ready assets. Monitor is for ongoing checks after publishing, and the manual audit is for pages that need human judgment.',
  },
  {
    q: 'Do these tools guarantee AI search visibility?',
    a: 'No. These tools check technical readiness signals. They do not guarantee rankings, citations, traffic, or visibility in ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, or any other AI search product.',
  },
];

export function AIHomePage() {
  const [auditUrl, setAuditUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const url = auditUrl.trim();
      setScanning(true);
      const target = url
        ? `/tools/chatgpt-visibility-checker?url=${encodeURIComponent(url)}`
        : '/tools/chatgpt-visibility-checker';
      setTimeout(() => {
        window.location.href = target;
      }, 500);
    },
    [auditUrl]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero — form-first diagnostic entry */}
      <section className="border-b border-border/60 bg-background pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              AI Visibility Audit
            </p>
            <h1 className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              See what AI search engines see when they read your page.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              One URL. One score. One prioritized fix list — crawl access,
              schema, answer blocks, LLMs.txt, entity signals, and trust.
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`mx-auto mt-9 max-w-md rounded-lg border border-border/70 bg-card p-4 shadow-[0_18px_60px_oklch(0.20_0.03_245_/_0.14)] scan-input ${scanning ? 'scanning' : ''}`}
            >
              <label
                htmlFor="home-audit-url"
                className="mb-2 block font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Page URL
              </label>
              <div className="flex min-h-12 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-primary/50">
                <IconSearch
                  size={17}
                  className="shrink-0 text-muted-foreground"
                />
                <input
                  id="home-audit-url"
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="example.com/pricing"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
                />
              </div>
              <button
                type="submit"
                className="mt-3 inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
              >
                Run free scan
                <IconArrowRight size={16} />
              </button>
              <p className="mt-2.5 text-center font-mono text-xs leading-5 text-muted-foreground">
                Readiness-based audit. Not a live ChatGPT ranking tracker.
              </p>
            </form>
          </div>

          {/* Preview below the form — the "live readout" */}
          <div className="mx-auto mt-12 max-w-lg">
            <AuditPreview />
          </div>
        </Container>
      </section>

      {/* 2. "What the audit checks" — 5 signal layers */}
      <section className="border-b border-border/60 py-14 sm:py-18">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              What the audit checks
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Five signal layers, one fix order
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Each layer is a controllable signal. Earlier fixes make later ones
              easier.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-5">
            {signalLayers.map((layer) => (
              <div
                key={layer.label}
                className={`rounded-lg border border-border bg-card p-4 ${
                  layer.status === 'pass'
                    ? 'signal-pass'
                    : layer.status === 'warn'
                      ? 'signal-warn'
                      : 'signal-fail'
                }`}
              >
                <p className="font-display text-sm font-semibold text-foreground">
                  {layer.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. "What you'll see" — 3 preview cards */}
      <section className="border-b border-border/60 bg-muted/20 py-14 sm:py-18">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              What you'll see
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              One scan produces three artefacts
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Every audit starts with the same output: a score, a top issue, and
              a fix priority.
            </p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {previewCards.map((card) => (
              <div
                key={card.label}
                className={`rounded-lg border border-border bg-card p-5 ${
                  card.status === 'pass'
                    ? 'signal-pass'
                    : card.status === 'warn'
                      ? 'signal-warn'
                      : 'signal-fail'
                }`}
              >
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-foreground">
                  {card.value}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Tool shortcuts */}
      <section className="border-b border-border/60 py-14 sm:py-18">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Go deeper
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Focused diagnostics for specific questions
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Each checker answers one precise question about your page. Use the
              full audit when you need the complete picture.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {toolShortcuts.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  onClick={() =>
                    trackConversionEvent('home_tool_shortcut_clicked', {
                      target: tool.href,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-muted/20 active:scale-[0.98]"
                >
                  <Icon size={16} className="shrink-0 text-muted-foreground" />
                  {tool.label}
                </a>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Inline pricing */}
      <section className="border-b border-border/60 bg-muted/20 py-14 sm:py-18">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Start free, fix once, monitor the important pages
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              One scan, one Fix Pack, one monitor path. No subscriptions unless
              you want ongoing checks.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-4">
            {pricingTiers.map((tier) => (
              <a
                key={tier.label}
                href={tier.href}
                className="group rounded-lg border border-border bg-card p-5 transition hover:border-primary/40"
              >
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {tier.label}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.note && (
                    <span className="text-xs text-muted-foreground">
                      {tier.note}
                    </span>
                  )}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                  Learn more <IconArrowRight size={12} />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. FAQ */}
      <section className="border-b border-border/60 py-14 sm:py-18">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <FAQ items={homeFAQ} className="mt-9" />
          </div>
        </Container>
      </section>

      {/* 7. Disclaimer */}
      <section className="py-12">
        <Container className="px-4">
          <p className="mx-auto max-w-2xl text-center font-mono text-xs leading-6 text-muted-foreground">
            We do not guarantee citations. We help you catch the technical and
            content signals that make AI answers more likely to understand,
            extract, and trust your page. These tools do not guarantee rankings,
            traffic, or visibility in ChatGPT, Perplexity, Gemini, Claude,
            Google AI Overviews, or other AI search products.
          </p>
        </Container>
      </section>
    </div>
  );
}

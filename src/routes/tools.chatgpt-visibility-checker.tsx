import { AuditPreview } from '@/components/ai-visibility/audit-preview';
import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { trackConversionEvent } from '@/lib/conversion-events';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import {
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';

const checks = [
  'Brand and offer clarity for AI answers',
  'Crawl access and AI crawler readiness',
  'Answer-ready page structure',
  'Schema, entity, and trust signals',
  'Query coverage gaps for recommendation-style prompts',
];

const modules = [
  {
    title: 'AI Search Readiness Score',
    desc: 'A 0-100 estimate based on observable technical, content, entity, and trust signals. It does not measure rankings, citations, traffic, or actual visibility.',
  },
  {
    title: 'Competitor gaps',
    desc: 'Optional competitors help frame what AI answers may compare you against.',
  },
  {
    title: 'Fix list',
    desc: 'The audit hands off to the full AEO diagnosis when the page needs concrete repairs.',
  },
];

const faqItems = [
  {
    q: 'Does this checker run a live ChatGPT ranking test?',
    a: 'No. This first version checks ChatGPT visibility readiness signals and routes the page into a full AEO diagnosis. It is not live platform monitoring and does not measure rankings, citations, traffic, actual visibility, or prompt-level ChatGPT results.',
  },
  {
    q: 'Why use a ChatGPT visibility checker if it is readiness-based?',
    a: 'Most missing AI recommendations come from inspectable gaps: unclear entities, weak answer structure, blocked crawlers, missing schema, thin trust signals, and poor query coverage. This checker starts there before any monitoring workflow.',
  },
  {
    q: 'What happens after I submit a URL?',
    a: 'You get routed into the free page audit with the URL attached. The audit checks the technical and content signals behind AI visibility, then shows the top issues to fix first.',
  },
];

export const Route = createFileRoute('/tools/chatgpt-visibility-checker')({
  head: () => ({
    ...seo('/tools/chatgpt-visibility-checker', {
      title: 'ChatGPT Visibility Checker - Free AI Visibility Audit',
      description:
        'Check whether your brand page is ready to be recommended by ChatGPT-style AI answers. Run a free AI visibility audit and get a prioritized fix path.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'ChatGPT Visibility Checker',
          websiteUrl: getCanonicalUrl('/tools/chatgpt-visibility-checker'),
          longDescription:
            'A free readiness-based ChatGPT visibility checker that audits crawl access, AI crawler readiness, answer-ready content, schema, entity clarity, trust signals, and query coverage gaps before routing into a full fix list.',
          startingPrice: '$0',
          keyFeatures: checks,
        })
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'ChatGPT Visibility Checker',
            url: getCanonicalUrl('/tools/chatgpt-visibility-checker'),
          },
        ])
      ),
    ],
  }),
  component: ChatGptVisibilityCheckerPage,
});

function ChatGptVisibilityCheckerPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [competitors, setCompetitors] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    if (url) setWebsiteUrl(url);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams({
      source: 'chatgpt-visibility-checker',
    });
    const trimmedUrl = websiteUrl.trim();
    const trimmedIndustry = industry.trim();
    const trimmedCompetitors = competitors.trim();

    if (trimmedUrl) params.set('url', trimmedUrl);
    if (trimmedIndustry) params.set('industry', trimmedIndustry);
    if (trimmedCompetitors) params.set('competitors', trimmedCompetitors);

    trackConversionEvent('chatgpt_visibility_checker_started', {
      has_url: String(Boolean(trimmedUrl)),
      has_industry: String(Boolean(trimmedIndustry)),
      has_competitors: String(Boolean(trimmedCompetitors)),
    });

    window.location.href = `/tools/aeo-checker?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60 bg-background py-16 lg:py-24">
        <Container className="px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                ChatGPT Visibility Checker
              </p>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-5xl">
                Does ChatGPT have enough signal to understand and cite your
                brand?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Paste a URL. Get an AI Search Readiness Score, top issue,
                ChatGPT citation readiness, competitor gaps, and a fix list —
                all on one screen. This is not live platform monitoring.
              </p>
              <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {checks.slice(0, 4).map((check) => (
                  <div key={check} className="flex items-start gap-2">
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{check}</span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-lg border border-border bg-card p-4 shadow-[0_18px_60px_oklch(0.20_0.03_245_/_0.14)] sm:p-5"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block sm:col-span-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                      Website URL
                    </span>
                    <input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="example.com"
                      className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm outline-none transition focus:border-primary/50"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                      Industry
                    </span>
                    <input
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="local dentist, B2B SaaS"
                      className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50"
                    />
                  </label>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label className="block">
                    <span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                      Competitors
                    </span>
                    <input
                      value={competitors}
                      onChange={(e) => setCompetitors(e.target.value)}
                      placeholder="competitor1.com, competitor2.com"
                      className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50"
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Run audit <IconArrowRight size={16} />
                  </button>
                </div>
                <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
                  Routes into the free AI Visibility Audit. Not a live ChatGPT
                  ranking tracker.
                </p>
              </form>
            </div>

            <AuditPreview trackingEvent="chatgpt_visibility_sample_report_clicked" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="px-4">
          <div className="grid gap-5 md:grid-cols-3">
            {modules.map((module, index) => {
              const Icon =
                index === 0
                  ? IconFileAnalytics
                  : index === 1
                    ? IconSparkles
                    : IconShieldCheck;

              return (
                <article
                  key={module.title}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {module.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {module.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-16">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Built as the entry point to the full AI Visibility Audit
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              The ChatGPT checker is the front door. The full audit explains the
              fix order across crawler access, AI-readable files, structured
              data, answer blocks, entity clarity, and trust signals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/sample-aeo-report"
                onClick={() =>
                  trackConversionEvent(
                    'chatgpt_visibility_sample_report_clicked'
                  )
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40 active:scale-[0.98]"
              >
                View sample report <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/query-fan-out-tool"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition hover:bg-muted/40 active:scale-[0.98]"
              >
                Explore query gaps <IconArrowRight size={16} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>
    </div>
  );
}

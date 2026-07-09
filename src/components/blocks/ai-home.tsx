import { FAQ } from '@/components/ai-visibility/faq';
import { AIAnswerFramework } from '@/components/ai-visibility/ai-answer-framework';
import Container from '@/components/layout/container';
import { trackConversionEvent } from '@/lib/conversion-events';
import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconFileAnalytics,
  IconFileText,
  IconScan,
  IconSearch,
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';

const tools = [
  {
    icon: IconFileText,
    title: 'LLMs.txt Checker & Generator',
    desc: 'Validate LLMs.txt, LLMs-full.txt, sitemap links, and AI crawler access. Generate a cleaner file when the current one is missing or thin.',
    primaryHref: '/tools/llms-txt-checker',
    secondaryHref: '/tools/llms-txt-generator',
    primaryLabel: 'Check LLMs.txt',
    secondaryLabel: 'Generate file',
  },
  {
    icon: IconScan,
    title: 'AEO Checker',
    desc: 'Audit crawlability, structured data, answer-ready content, entity clarity, trust signals, and AI crawler access for one page.',
    primaryHref: '/tools/aeo-checker',
    primaryLabel: 'Audit page free',
  },
  {
    icon: IconBrain,
    title: 'Query Fan-Out Tool',
    desc: 'Simulate related sub-queries and intent clusters so a page can answer the questions AI systems may expand toward.',
    primaryHref: '/tools/query-fan-out-tool',
    primaryLabel: 'Generate queries',
  },
];

const growthPages = [
  {
    title: 'AI Crawler Checker',
    href: '/tools/ai-crawler-checker',
    desc: 'Check GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, robots.txt, sitemap, and AI-readable file access.',
  },
  {
    title: 'Robots.txt AI Crawler Checker',
    href: '/tools/robots-txt-ai-crawler-checker',
    desc: 'Review robots.txt rules that may block AI crawlers from public content.',
  },
  {
    title: 'GEO Audit Tool',
    href: '/tools/geo-audit',
    desc: 'Audit generative engine optimization signals across crawlability, schema, content, and trust.',
  },
  {
    title: 'AI Overview Readiness Checker',
    href: '/tools/ai-overview-readiness-checker',
    desc: 'Review technical and content signals for AI-assisted search summaries.',
  },
  {
    title: 'ChatGPT Citation Readiness Checker',
    href: '/tools/chatgpt-citation-readiness-checker',
    desc: 'Check public citation-readiness signals for AI retrieval systems.',
  },
  {
    title: 'AI Search Readiness Checklist',
    href: '/guides/ai-search-readiness-checklist',
    desc: 'Use a page-level checklist for crawl access, AI crawler access, LLMs.txt, schema, answer-ready content, and trust signals.',
  },
];

const workflowSteps = [
  {
    title: 'Scan free',
    desc: 'Find what is broken before you edit the page: crawl access, AI crawler rules, LLMs.txt, schema, answer structure, and trust signals.',
  },
  {
    title: 'Fix once',
    desc: 'Use the $19 Fix Pack when you need copy-ready JSON-LD, answer blocks, LLMs.txt guidance, and a clear repair order.',
  },
  {
    title: 'Monitor monthly',
    desc: 'After the page is repaired, watch important URLs for silent readiness regressions in crawler access, schema, LLMs.txt, and answer blocks.',
  },
  {
    title: 'Escalate carefully',
    desc: 'Use the $99 manual audit when a high-stakes page needs human judgment on priorities, competitor context, and tradeoffs.',
  },
];

const trustPoints = [
  'Audit one page first',
  'No sign-up for the first audit',
  'Fix once or monitor monthly',
  'No ranking or citation promises',
];

const previewModules = [
  ['Crawler access', 'Ready'],
  ['Structured data', 'Needs repair'],
  ['LLMs.txt readiness', 'Missing'],
  ['Answer blocks', 'Thin'],
];

const fixOrder = [
  'Add Organization and WebSite schema.',
  'Rewrite the first answer block for extraction.',
  'Publish a short methodology note for trust.',
];

const readinessPoints = [
  'Crawlable pages',
  'Clear site structure',
  'Accessible AI crawler rules',
  'LLMs.txt and LLMs-full.txt where useful',
  'Structured data',
  'Answer-ready content',
  'Clear entities and trust signals',
];

const comparisonPoints = [
  {
    title: 'Search suites monitor the market',
    desc: 'Large SEO platforms are useful for ongoing rankings, mentions, and account workflows.',
  },
  {
    title: 'Search Console reports performance',
    desc: 'Official data helps you understand traffic, but it does not pick the next page edit.',
  },
  {
    title: 'AEOCheck keeps the page inspectable',
    desc: 'Use it when one page needs a free scan, copy-ready fixes, then monitoring for readiness drift after publishing.',
  },
];

const manualAuditItems = [
  'Top blockers for AI answers',
  'Crawler, schema, and LLMs.txt review',
  'Competitor notes for up to 3 sites',
  'Prioritized implementation checklist',
];

const homeFAQ = [
  {
    q: 'What is AI search readiness?',
    a: 'AI search readiness means your website is technically easy for search engines, answer engines, and AI-assisted retrieval systems to understand. It includes crawlability, structured data, LLMs.txt files, answer-ready content formatting, clear entity signals, and trust indicators.',
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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const url = auditUrl.trim();
      const target = url
        ? `/tools/aeo-checker?url=${encodeURIComponent(url)}`
        : '/tools/aeo-checker';
      window.location.href = target;
    },
    [auditUrl]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_right,oklch(0.93_0.08_255),transparent_34%),linear-gradient(180deg,oklch(0.99_0.004_255),oklch(0.965_0.01_255))] pt-12 pb-8 dark:bg-[radial-gradient(circle_at_top_right,oklch(0.28_0.08_255),transparent_34%),linear-gradient(180deg,oklch(0.145_0.012_255),oklch(0.115_0.01_255))] sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16">
        <Container className="px-4">
          <div className="grid gap-7 sm:gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-primary">
                AI search readiness checker and monitor
              </p>
              <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.06] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
                Check if your page is ready for AI search. Keep it monitored
                after you fix it.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                AEOCheck audits crawlability, AI crawler access, LLMs.txt,
                schema, answer-ready content, and trust signals. Run a free
                scan, unlock copy-ready fixes, then monitor important pages for
                silent regressions.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 max-w-xl rounded-lg border border-border/70 bg-background/90 p-3 shadow-[0_18px_60px_oklch(0.32_0.04_255_/_0.12)] backdrop-blur"
              >
                <label
                  htmlFor="home-audit-url"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Page URL
                </label>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
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
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
                  >
                    Run free scan
                    <IconArrowRight size={16} />
                  </button>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Start with one URL. Scan free, fix once, then monitor the
                  pages that should not silently break.
                </p>
              </form>
            </div>

            <AuditPreview />
          </div>
        </Container>
      </section>

      <section className="border-b border-border/60 bg-background py-5">
        <Container className="px-4">
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <IconCheck size={16} className="shrink-0 text-primary" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="px-4">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                Scan, fix, monitor, then escalate when it matters
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                AI visibility is not a one-time score. AEOCheck narrows the page
                into inspectable signals, repair assets, and the next check
                after publishing.
              </p>
            </div>
            <div className="divide-y divide-border rounded-lg border border-border bg-muted/20">
              {workflowSteps.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-3 p-5 sm:grid-cols-[180px_1fr] sm:p-6"
                >
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-16 lg:py-20">
        <Container className="px-4">
          <AIAnswerFramework />
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="px-4">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-lg border border-border bg-muted/20 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {manualAuditItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg bg-background p-4 text-sm text-muted-foreground"
                  >
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground">
                <IconFileAnalytics size={16} />
                Escalation path
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground text-balance">
                Use human review after software checks find the hard calls
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                The workflow starts with a free scan, moves through a $19 Fix
                Pack, and can be monitored monthly after the edit. If the page
                affects revenue, launch positioning, or a comparison query, use
                the $99 manual audit for a human-reviewed fix order.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/ai-search-audit"
                  onClick={() =>
                    trackConversionEvent('home_service_section_clicked')
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
                >
                  Review manual audit
                  <IconArrowRight size={16} />
                </a>
                <a
                  href="/sample-aeo-report"
                  onClick={() =>
                    trackConversionEvent('home_sample_report_cta_clicked')
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition hover:bg-muted/40 active:scale-[0.98]"
                >
                  View sample Fix Pack
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-16 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Start with the question you already have
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Use a focused checker for a quick answer, then run the full audit
              when you need one prioritized fix plan.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <ToolCard tool={tools[1]} featured />
            <div className="grid gap-5">
              {tools
                .filter((tool) => tool.title !== tools[1].title)
                .map((tool) => (
                  <ToolCard key={tool.title} tool={tool} />
                ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Targeted AI search checks
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Pick the page that matches your current SEO or GEO question.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {growthPages.map((page, index) => (
              <a
                key={page.href}
                href={page.href}
                onClick={() =>
                  trackConversionEvent('home_growth_page_clicked', {
                    target: page.href,
                  })
                }
                className={
                  index === 0
                    ? 'rounded-lg border border-primary/30 bg-primary/10 p-5 transition hover:border-primary/50 md:col-span-2 lg:col-span-1'
                    : 'rounded-lg border border-border bg-muted/20 p-5 transition hover:border-primary/40 hover:bg-muted/30'
                }
              >
                <h3 className="font-semibold text-foreground">{page.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {page.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool <IconArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-16 lg:py-20">
        <Container className="px-4">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                Not another AI visibility dashboard
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                The product is intentionally narrow: one page, one readiness
                read, one implementation path.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {comparisonPoints.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-border bg-background p-5"
                >
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
              What is AI Search Readiness?
            </h2>
            <p className="mt-6 text-center text-base leading-7 text-muted-foreground">
              AI Search Readiness means your website is technically easy for
              search engines, answer engines, and AI-assisted retrieval systems
              to crawl, parse, and understand.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {readinessPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-4 py-3"
                >
                  <IconCheck size={16} className="shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-16 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Start free, fix once, monitor important pages
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Diagnose the page, unlock the $19 Fix Pack when you need
              copy-ready assets, then use Monitor for pages that should not
              silently lose readiness after publishing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/tools/aeo-checker"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
              >
                Run free scan <IconArrowRight size={16} />
              </a>
              <a
                href="/pricing"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-foreground transition hover:bg-muted/40 active:scale-[0.98]"
              >
                Compare plans
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <FAQ items={homeFAQ} className="mt-8" />
          </div>
        </Container>
      </section>

      <section className="border-t border-border/60 py-12">
        <Container className="px-4">
          <p className="mx-auto max-w-2xl text-center text-sm leading-6 text-muted-foreground">
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

function AuditPreview() {
  return (
    <div className="relative rounded-lg border border-border/70 bg-background p-3 shadow-[0_24px_90px_oklch(0.28_0.04_255_/_0.18)] sm:p-4 lg:justify-self-end">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[170px_1fr]">
        <aside className="hidden rounded-lg border border-border bg-muted/30 p-4 lg:block">
          <p className="text-xs font-semibold text-muted-foreground">
            Sample audit
          </p>
          <div className="mt-5">
            <p className="text-sm font-medium text-muted-foreground">
              Readiness score
            </p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                64
              </span>
              <span className="pb-1 text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {['Crawl', 'Schema', 'Answers', 'Trust'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="rounded-lg border border-border bg-muted/20 p-3 sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3 rounded-lg border border-border bg-background p-3 lg:hidden">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Readiness score
              </p>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  64
                </span>
                <span className="pb-1 text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
              Scan complete
            </span>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                aeocheck.xyz/pricing
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                One page, controllable signals only
              </p>
            </div>
            <span className="hidden rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary lg:inline-flex">
              Scan complete
            </span>
          </div>

          <div className="mt-5 hidden grid-cols-2 gap-3 sm:grid">
            {previewModules.map(([label, status]) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-background p-3 sm:p-4"
              >
                <p className="text-xs font-medium text-foreground sm:text-sm">
                  {label}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{status}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden rounded-lg border border-border bg-background p-4 sm:block">
            <p className="text-sm font-semibold text-foreground">Fix order</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {fixOrder.map((item) => (
                <li key={item} className="flex gap-2">
                  <IconCheck size={15} className="mt-1 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </main>
      </div>
    </div>
  );
}

function ToolCard({
  tool,
  featured = false,
}: {
  tool: (typeof tools)[number];
  featured?: boolean;
}) {
  const Icon = tool.icon;
  return (
    <article
      className={
        featured
          ? 'rounded-lg border border-primary/30 bg-background p-6 shadow-[0_18px_60px_oklch(0.32_0.04_255_/_0.10)]'
          : 'rounded-lg border border-border bg-background p-6'
      }
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        {tool.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {tool.desc}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={tool.primaryHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          {tool.primaryLabel} <IconArrowRight size={14} />
        </a>
        {tool.secondaryHref && tool.secondaryLabel ? (
          <a
            href={tool.secondaryHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            {tool.secondaryLabel} <IconArrowRight size={14} />
          </a>
        ) : null}
      </div>
    </article>
  );
}

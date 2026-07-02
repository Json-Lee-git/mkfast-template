import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import { trackConversionEvent } from '@/lib/conversion-events';
import {
  IconFileText,
  IconScan,
  IconBrain,
  IconArrowRight,
  IconCheck,
  IconFileAnalytics,
} from '@tabler/icons-react';

const tools = [
  {
    icon: IconFileText,
    title: 'LLMs.txt Checker & Generator',
    desc: 'Check whether your site has a valid LLMs.txt file, accessible AI-readable links, LLMs-full.txt, sitemap, and AI crawler access. Then generate a clean LLMs.txt file.',
    primaryHref: '/tools/llms-txt-checker',
    secondaryHref: '/tools/llms-txt-generator',
    primaryLabel: 'Check LLMs.txt',
    secondaryLabel: 'Generate LLMs.txt',
  },
  {
    icon: IconScan,
    title: 'AEO Checker',
    desc: 'Like a page SEO audit, but for AI answers. Check crawlability, structured data, answer-ready content, entity clarity, trust signals, and AI crawler access.',
    primaryHref: '/tools/aeo-checker',
    primaryLabel: 'Audit Page Free',
  },
  {
    icon: IconBrain,
    title: 'Query Fan-Out Tool',
    desc: 'Simulate how AI search engines may expand a query into sub-queries, intents, and content gaps. Use it to plan answer-ready content.',
    primaryHref: '/tools/query-fan-out-tool',
    primaryLabel: 'Generate Fan-Out Queries',
  },
];

const growthPages = [
  {
    title: 'AI Crawler Checker',
    href: '/tools/ai-crawler-checker',
    desc: 'Check GPTBot, ClaudeBot, PerplexityBot, robots.txt, sitemap, and AI-readable file access.',
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
  {
    title: 'Sample AEO Report',
    href: '/sample-aeo-report',
    desc: 'Preview the paid fix pack before running your own AEO audit.',
  },
  {
    title: '$19 Report Value Guide',
    href: '/compare/ai-search-readiness-report-worth-it',
    desc: 'Compare the free scan with the paid Fix Pack so buyers can decide whether the $19 report is useful for their page.',
  },
];

const useCases = [
  {
    title: 'Before publishing a new SEO page',
    desc: 'Check whether the page has crawl access, schema, direct answers, and trust signals before you ask Google or AI systems to find it.',
  },
  {
    title: 'When a page gets traffic but no AI mentions',
    desc: 'Find the missing AI-search signals that normal keyword tools often skip: LLMs.txt, AI crawler access, answer-ready structure, and entity clarity.',
  },
  {
    title: 'When you need an implementation handoff',
    desc: 'Use the $19 Fix Pack for copy-ready assets, or order the $99 manual audit when you want a human-reviewed fix plan.',
  },
];

const trustPoints = [
  'Free scan before checkout',
  'One-time $19 fix pack',
  '$99 manual audit available',
  'Copy-ready schema and LLMs.txt',
];

const howItWorks = [
  'Use the LLMs.txt Checker to validate AI-readable site files.',
  'Use the AEO Checker to audit technical answer engine readiness.',
  'Use the Query Fan-Out Tool to find content gaps and related sub-queries.',
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

const homeFAQ = [
  {
    q: 'What is AI search readiness?',
    a: 'AI search readiness means your website is technically easy for search engines, answer engines, and AI-assisted retrieval systems to understand. It includes crawlability, structured data, LLMs.txt files, answer-ready content formatting, clear entity signals, and trust indicators.',
  },
  {
    q: 'Are these tools free?',
    a: 'The scan and focused tools are free to use. AEOCheck also offers an optional $19 Fix Pack with implementation assets and a $99 manual audit when you want a human-reviewed fix plan.',
  },
  {
    q: 'Do these tools guarantee AI search visibility?',
    a: 'No. These tools check technical readiness signals. They do not guarantee rankings, citations, traffic, or visibility in ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, or any other AI search product.',
  },
];

export function AIHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-indigo-950/40 dark:via-zinc-950 dark:to-blue-950/20" />
        <Container className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-zinc-700/50 bg-gray-100 dark:bg-zinc-900/50 px-4 py-1.5 text-sm text-gray-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Free AI search readiness audit before checkout
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Free audit for{' '}
              <span className="gradient-text">AI search readiness</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Check whether a landing page can be crawled, understood, and cited
              by ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews.
              Start with a free scan, unlock a $19 copy-ready Fix Pack when you
              need implementation assets, or order a $99 manual audit when you
              need a human fix plan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/aeo-checker"
                onClick={() =>
                  trackConversionEvent('home_primary_cta_clicked', {
                    target: '/tools/aeo-checker',
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
              >
                Audit page free <IconArrowRight size={16} />
              </a>
              <a
                href="/ai-search-audit"
                onClick={() =>
                  trackConversionEvent('home_manual_audit_cta_clicked')
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-800/50 active:scale-[0.98]"
              >
                Order $99 manual audit
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-zinc-400">
              {trustPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5">
                  <IconCheck size={13} className="text-emerald-500" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      </section>

      {/* Use cases */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Use it when AI search visibility depends on one page
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              The free tools are for quick diagnosis. The paid Fix Pack is for
              the moment you need a concrete repair list, not another dashboard.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800/60 dark:bg-zinc-900/30"
              >
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Manual audit service */}
      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300">
                <IconFileAnalytics size={15} />
                Service option
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-zinc-100">
                Want a human to turn the scan into a fix plan?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                Order a $99 manual AI Search Readiness Audit for one important
                SaaS page. No Zoom call required. Submit the URL, pay through
                Creem, and receive a prioritized report within 48 hours.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/ai-search-audit"
                  onClick={() =>
                    trackConversionEvent('home_service_section_clicked')
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  Order manual audit <IconArrowRight size={16} />
                </a>
                <a
                  href="/sample-aeo-report"
                  onClick={() =>
                    trackConversionEvent('home_sample_report_cta_clicked')
                  }
                  className="inline-flex items-center justify-center text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                >
                  View sample Fix Pack
                </a>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Top 5 blockers for AI answers',
                'Crawler, schema, and LLMs.txt review',
                'Competitor notes for up to 3 sites',
                'Prioritized implementation checklist',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400"
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

      {/* Tool Cards */}
      <section className="border-t border-gray-200 py-20 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Start with the question you already have
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Use a focused checker for a quick answer, then run the full AEO
              audit when you need one prioritized fix plan.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {tools.map(
              ({
                icon: Icon,
                title,
                desc,
                primaryHref,
                primaryLabel,
                secondaryHref,
                secondaryLabel,
              }) => (
                <div
                  key={title}
                  className="card-lift rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 transition-all hover:border-gray-300 hover:bg-gray-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-800 dark:text-zinc-200">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                    {desc}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={primaryHref}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {primaryLabel} <IconArrowRight size={14} />
                    </a>
                    {secondaryHref && secondaryLabel && (
                      <a
                        href={secondaryHref}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {secondaryLabel} <IconArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </section>

      {/* High-intent entry points */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Targeted AI search checks
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Start with the page that matches your current SEO or GEO question,
              then run the full AEO audit when you need a prioritized fix plan.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {growthPages.map((page) => (
              <a
                key={page.href}
                href={page.href}
                onClick={() =>
                  trackConversionEvent('home_growth_page_clicked', {
                    target: page.href,
                  })
                }
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all hover:border-gray-300 hover:bg-gray-100 dark:border-zinc-800/60 dark:bg-zinc-900/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
              >
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
                  {page.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                  {page.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Open tool <IconArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* What is AI Search Readiness */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              What is AI Search Readiness?
            </h2>
            <p className="mt-6 text-center text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              AI Search Readiness means your website is technically easy for
              search engines, answer engines, and AI-assisted retrieval systems
              to understand, as defined by the{' '}
              <a
                href="https://llmstxt.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                llms.txt proposal
              </a>{' '}
              and{' '}
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Schema.org
              </a>{' '}
              structured data standards.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {readinessPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30 px-4 py-3"
                >
                  <IconCheck size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-zinc-400">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How the tools work together */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              How these tools work together
            </h2>
            <div className="mt-8 space-y-4">
              {howItWorks.map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30 px-6 py-4 text-left"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-600/10 text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 dark:text-zinc-400 text-sm">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Free diagnosis, then choose the help level
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30 p-8">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Free Tools
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-zinc-100">
                  $0
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    LLMs.txt Checker
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    LLMs.txt Generator
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    Technical AEO summary
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    Query Fan-Out Tool
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-8">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  AI Search Readiness Fix Pack
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-zinc-100">
                  $19
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  one-time
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Top 3 fixes to do first
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Prioritized fixes
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Copy-ready JSON-LD schema
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Answer-ready content blocks
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Query fan-out content gaps
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Downloadable Markdown handoff
                  </li>
                </ul>
                <div className="mt-6 flex flex-col gap-2">
                  <a
                    href="/tools/aeo-checker"
                    onClick={() =>
                      trackConversionEvent('pricing_run_audit_clicked')
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Run audit first <IconArrowRight size={16} />
                  </a>
                  <a
                    href="/sample-aeo-report"
                    onClick={() =>
                      trackConversionEvent('pricing_sample_report_clicked')
                    }
                    className="inline-flex items-center justify-center text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
                  >
                    View sample report
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Manual Audit
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-zinc-100">
                  $99
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  intro price
                </p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    Human-reviewed fix plan
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    One important page
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    Competitor notes
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-emerald-500 shrink-0"
                    />{' '}
                    48-hour delivery
                  </li>
                </ul>
                <a
                  href="/ai-search-audit"
                  onClick={() =>
                    trackConversionEvent('pricing_manual_audit_clicked')
                  }
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                >
                  Order manual audit <IconArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <FAQ items={homeFAQ} className="mt-8" />
          </div>
        </Container>
      </section>

      {/* Trust disclaimer */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
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

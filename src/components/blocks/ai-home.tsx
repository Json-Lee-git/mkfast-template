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
  {
    title: 'AI Search Readiness Playbooks',
    href: '/playbooks',
    desc: 'Follow practical workflows for AEO fixes, LLMs.txt, AI crawler access, comparison pages, and AI referral measurement.',
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
    title: 'Before changing one revenue page',
    desc: 'Check the crawl, schema, answer structure, and trust gaps before you rewrite a homepage, product page, or comparison page.',
  },
  {
    title: 'When a score is not enough',
    desc: 'Use the Fix Pack when you need copy-ready JSON-LD, answer blocks, and a repair order instead of another dashboard.',
  },
  {
    title: 'When the edit needs judgment',
    desc: 'Order the manual audit when a human should check priorities, competitor context, and limits before you ship changes.',
  },
];

const trustPoints = [
  'Audit one page first',
  'No sign-up for the first audit',
  'See the sample before paying',
  'No ranking or citation promises',
];

const howItWorks = [
  'Run the free audit on the page you are about to edit.',
  'Preview the sample handoff before unlocking copy-ready fixes.',
  'Use manual review only when the page is commercially important enough.',
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
    a: 'The focused checkers and first diagnosis are free. The paid Fix Pack is for implementation assets, and the manual audit is for pages that need human prioritization.',
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
      <section className="relative overflow-hidden border-b border-gray-200 bg-stone-50 dark:border-zinc-800/50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(68,64,60,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(68,64,60,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60 dark:bg-[linear-gradient(to_right,rgba(244,244,245,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,244,245,0.06)_1px,transparent_1px)]" />
        <Container className="relative py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                Page audit before AI search edits
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 text-balance dark:text-zinc-50 sm:text-5xl lg:text-6xl">
                Audit one important page before you edit it
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
                See the crawl, schema, answer-block, LLMs.txt, and trust gaps
                that can block AI search understanding. Start with a free scan,
                then unlock a copy-ready Fix Pack only when the page needs
                implementation help.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/tools/aeo-checker"
                  onClick={() =>
                    trackConversionEvent('home_primary_cta_clicked', {
                      target: '/tools/aeo-checker',
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-0 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Audit one page free <IconArrowRight size={16} />
                </a>
                <a
                  href="/sample-aeo-report"
                  onClick={() =>
                    trackConversionEvent('home_sample_report_cta_clicked')
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-800 transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:bg-stone-100 active:translate-y-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  Preview the Fix Pack
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-zinc-400">
                {trustPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5"
                  >
                    <IconCheck size={13} className="text-emerald-500" />
                    {point}
                  </span>
                ))}
              </div>
            </div>

            <aside
              aria-label="Example audit output"
              className="rounded-lg border border-stone-300 bg-white/90 p-5 shadow-[0_24px_80px_rgba(41,37,36,0.12)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4 dark:border-zinc-800">
                <div>
                  <p className="text-sm font-semibold text-gray-950 dark:text-zinc-50">
                    Readiness audit
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-500">
                    One page, controllable signals only
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Free scan
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ['Crawler access', 'pass'],
                  ['Structured data', 'needs work'],
                  ['LLMs.txt readiness', 'missing'],
                  ['Answer blocks', 'thin'],
                  ['Trust signals', 'needs review'],
                ].map(([label, status]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm"
                  >
                    <span className="text-gray-700 dark:text-zinc-300">
                      {label}
                    </span>
                    <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md bg-stone-100 p-4 dark:bg-zinc-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-zinc-500">
                  Fix order
                </p>
                <ol className="mt-3 space-y-2 text-sm text-gray-700 dark:text-zinc-300">
                  <li>01. Add copy-ready Organization and WebSite schema.</li>
                  <li>02. Rewrite the first answer block for extraction.</li>
                  <li>03. Publish a short methodology note for trust.</li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Use cases */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Use it when one page is worth fixing carefully
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              The free scan is for quick diagnosis. The paid Fix Pack is for the
              moment you need concrete edits a founder, developer, or SEO
              operator can ship.
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
              <div className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <IconFileAnalytics size={15} />
                Upgrade path
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-zinc-100">
                Use human review when the page is worth editing carefully
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
                The free scan is the right first step. If the page affects
                revenue, launch positioning, or a comparison query, order a $99
                manual AI Search Readiness Audit for a human-reviewed fix order
                within 48 hours.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/ai-search-audit"
                  onClick={() =>
                    trackConversionEvent('home_service_section_clicked')
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Review manual audit option <IconArrowRight size={16} />
                </a>
                <a
                  href="/sample-aeo-report"
                  onClick={() =>
                    trackConversionEvent('home_sample_report_cta_clicked')
                  }
                  className="inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:underline dark:text-zinc-300"
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

      {/* Positioning */}
      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-stone-600 dark:text-zinc-400">
                Built for fix delivery
              </p>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-zinc-100">
                Not another AI visibility dashboard
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Search suites monitor',
                  desc: 'Large SEO platforms are useful for ongoing visibility, rankings, and broad account workflows.',
                },
                {
                  title: 'Search Console reports',
                  desc: 'Official data helps you understand performance, but it does not tell you which page edits to ship first.',
                },
                {
                  title: 'AEOCheck hands off fixes',
                  desc: 'Use it when one page needs crawl, schema, content, and trust recommendations a developer or operator can act on.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40"
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
              to crawl, parse, and understand. It starts with controllable
              technical signals: robots.txt, sitemap discovery, AI crawler
              access, structured data, crawlable content, and optional
              AI-readable files such as{' '}
              <a
                href="https://llmstxt.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                llms.txt
              </a>{' '}
              plus{' '}
              <a
                href="https://schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Schema.org
              </a>{' '}
              structured data.
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
              Start free, pay only when you need a handoff
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              The main path is intentionally narrow: diagnose the page, preview
              the output, then choose software-generated assets or human review.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
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
              <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-8 dark:border-amber-900/60 dark:bg-amber-950/20">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
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
                      className="mt-0.5 text-amber-600 shrink-0"
                    />{' '}
                    Top 3 fixes to do first
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-amber-600 shrink-0"
                    />{' '}
                    Prioritized fixes
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-amber-600 shrink-0"
                    />{' '}
                    Copy-ready JSON-LD schema
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-amber-600 shrink-0"
                    />{' '}
                    Answer-ready content blocks
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-amber-600 shrink-0"
                    />{' '}
                    Query fan-out content gaps
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-amber-600 shrink-0"
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
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Run audit first <IconArrowRight size={16} />
                  </a>
                  <a
                    href="/sample-aeo-report"
                    onClick={() =>
                      trackConversionEvent('pricing_sample_report_clicked')
                    }
                    className="inline-flex items-center justify-center text-sm font-medium text-amber-800 hover:underline dark:text-amber-300"
                  >
                    View sample report
                  </a>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
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
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                >
                  Review manual option <IconArrowRight size={16} />
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
              search products. Google says there are no special files or schema
              required for AI Overviews or AI Mode.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import {
  IconSearch,
  IconFileText,
  IconScan,
  IconBrain,
  IconArrowRight,
  IconCheck,
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
    desc: 'Run a technical AEO audit for your page. Check crawlability, structured data, answer-ready content, entity clarity, trust signals, and AI crawler access.',
    primaryHref: '/tools/aeo-checker',
    primaryLabel: 'Run AEO Audit',
  },
  {
    icon: IconBrain,
    title: 'Query Fan-Out Tool',
    desc: 'Simulate how AI search engines may expand a query into sub-queries, intents, and content gaps. Use it to plan answer-ready content.',
    primaryHref: '/tools/query-fan-out-tool',
    primaryLabel: 'Generate Fan-Out Queries',
  },
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
    a: 'All three tools are free to use. We also offer an optional Full AI Search Readiness Report for $19, with detailed findings, prioritized fixes, and downloadable reports.',
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <Container className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-zinc-700/50 bg-gray-100 dark:bg-zinc-900/50 px-4 py-1.5 text-sm text-gray-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Free technical readiness tools
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              AI Search Readiness Tools{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                for Your Website
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Check your LLMs.txt, AI crawler access, technical AEO signals,
              structured data, and query fan-out coverage in one lightweight
              toolkit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/llms-txt-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Check LLMs.txt <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-800/50 active:scale-[0.98]"
              >
                Run AEO Audit
              </a>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      </section>

      {/* Tool Cards */}
      <section className="py-20">
        <Container>
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
                  className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-zinc-900/60"
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
              to understand.
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
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Simple pricing
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
                    Basic AEO Score
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
                  Full Report
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
                    Full AI Search Readiness Report
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
                    Schema recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck
                      size={14}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />{' '}
                    Answer-ready content suggestions
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
                    Downloadable report
                  </li>
                </ul>
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

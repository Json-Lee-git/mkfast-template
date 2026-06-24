import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import {
  IconSearch,
  IconFileText,
  IconSpy,
  IconArrowRight,
} from '@tabler/icons-react';

const features = [
  {
    icon: IconSearch,
    title: 'LLMs.txt Checker & Validator',
    desc: 'Check whether your site has a valid LLMs.txt file. Validate structure, links, LLMs-full.txt presence, sitemap, and AI crawler access in one report.',
    href: '/tools/llms-txt-checker',
  },
  {
    icon: IconFileText,
    title: 'LLMs.txt Generator',
    desc: 'Generate a clean LLMs.txt file from your sitemap or manual inputs. Copy, edit, and download it in seconds.',
    href: '/tools/llms-txt-generator',
  },
  {
    icon: IconSpy,
    title: 'AI Crawlability Checker',
    desc: 'Check whether AI crawlers like GPTBot, ClaudeBot, and PerplexityBot can access your site. Part of the LLMs.txt checker.',
    href: '/tools/llms-txt-checker#crawlers',
  },
];

const whyItMatters = [
  'AI search readiness is technical, not magic.',
  'LLMs.txt is not a ranking guarantee.',
  'But clean AI-readable files, accessible crawlers, and structured site maps are low-cost technical preparation.',
];

const guideLinks = [
  {
    title: 'What is an LLMs.txt file?',
    href: '/guides/llms-txt-file',
  },
  {
    title: 'Does LLMs.txt help SEO?',
    href: '/guides/llms-txt-seo',
  },
  {
    title: 'What is LLMs-full.txt?',
    href: '/guides/llms-full-txt',
  },
];

const homeFAQ = [
  {
    q: 'What is LLMs.txt?',
    a: 'LLMs.txt is an emerging convention for providing AI-readable content summaries to large language models. It is a Markdown file placed at the root of your website that helps AI crawlers understand your site structure and key pages.',
  },
  {
    q: 'Does LLMs.txt help with SEO?',
    a: 'LLMs.txt is not a confirmed ranking factor and there is no guarantee it will increase AI citations. However, it may serve as a low-cost technical readiness step, especially for documentation sites, SaaS products, developer tools, and content-heavy sites.',
  },
  {
    q: 'How do I check if my site has an LLMs.txt file?',
    a: 'Use our free LLMs.txt Checker. Enter your website URL and it will check for LLMs.txt, LLMs-full.txt, sitemap, robots.txt, and AI crawler access - all in one technical report.',
  },
  {
    q: 'Can I generate an LLMs.txt file for my website?',
    a: 'Yes. Use the LLMs.txt Generator to create a draft from your sitemap or manual inputs, then validate it with the checker after publishing.',
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
              Check your LLMs.txt, LLMs-full.txt, sitemap, and AI crawler access
              in one technical report.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/llms-txt-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Check your website <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/llms-txt-generator"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-800/50 active:scale-[0.98]"
              >
                Generate LLMs.txt
              </a>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      </section>

      {/* Features / Tool Cards */}
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, href }) => (
              <a
                key={title}
                href={href}
                className="group rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-zinc-900/60"
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
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Why it matters */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Why It Matters
            </h2>
            <div className="mt-6 space-y-3 text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              {whyItMatters.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Guides */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Learn More
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {guideLinks.map((guide) => (
                <a
                  key={guide.title}
                  href={guide.href}
                  className="group rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 text-center transition-all hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <span className="font-medium text-gray-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust disclaimer */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              LLMs.txt is an emerging convention. This tool checks technical
              readiness signals and does not guarantee rankings, citations, or
              visibility in AI search products.
            </p>
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

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}

import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

const faqItems = [
  {
    q: 'What is an AEO audit?',
    a: 'An AEO audit checks whether a page is technically ready for answer engines and AI-assisted search systems. It reviews crawlability, structured data, AI crawler access, answer-ready content, entity clarity, and trust signals.',
  },
  {
    q: 'Is AEO the same as SEO?',
    a: 'No. SEO focuses on search visibility across traditional search engines. AEO focuses on making pages easier for answer engines to understand, extract, and summarize. The two overlap, but AEO is not a replacement for SEO.',
  },
  {
    q: 'What does a technical AEO audit check?',
    a: 'A technical AEO audit checks HTTP status, title, meta description, canonical tags, robots directives, LLMs.txt files, sitemap access, AI crawler rules, JSON-LD schema, headings, FAQ structure, entity signals, and trust indicators.',
  },
  {
    q: 'Does structured data help AEO?',
    a: 'Structured data can help machines understand the page type, organization, author, product, service, FAQ, or article context. It does not guarantee citations or rankings, but it is a useful technical readiness signal.',
  },
  {
    q: 'What is a good AEO score?',
    a: 'A score above 80 usually means strong technical readiness. Scores from 60 to 79 indicate a good foundation with gaps. Lower scores suggest important crawlability, schema, content, entity, or trust issues.',
  },
  {
    q: 'Can an AEO audit guarantee ChatGPT citations?',
    a: 'No. An AEO audit provides technical readiness checks. It does not guarantee rankings, citations, traffic, or visibility in ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, or other AI search products.',
  },
];

const checklist = [
  'Page returns a successful HTML response',
  'Title, meta description, canonical, and robots tags are clear',
  'LLMs.txt, LLMs-full.txt, sitemap, and robots.txt are accessible where useful',
  'GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Perplexity-User, and Google-Extended rules are understood',
  'JSON-LD schema uses relevant types such as Organization, WebSite, Article, FAQPage, Product, Service, or BreadcrumbList',
  'The page has one clear H1 and useful H2/H3 question sections',
  'Important answers are written in direct, short paragraphs',
  'Entity signals clarify the brand, product, service, author, or publisher',
  'Trust signals include author, date, about, contact, privacy, and source links where relevant',
];

function articleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AEO Audit Guide',
    description:
      'Learn what an AEO audit checks and how to prepare a website for answer engines and AI search readiness.',
    url: getCanonicalUrl('/guides/aeo-audit'),
    mainEntityOfPage: getCanonicalUrl('/guides/aeo-audit'),
    publisher: {
      '@type': 'Organization',
      name: 'AI Search Readiness Tools',
      url: getCanonicalUrl('/'),
    },
  };
}

function AeoAuditGuidePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              AEO Audit Guide
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Learn what a technical AEO audit checks, how to read an AEO score,
              and which fixes matter most for AI search readiness.
            </p>
            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              Last updated: June 25, 2026
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <article className="mx-auto max-w-3xl prose prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-zinc-100 prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>Short answer</h2>
            <p>
              <strong>
                An AEO audit checks whether your website is technically ready
                for answer engines to crawl, understand, and extract useful
                answers from your pages.
              </strong>
            </p>
            <p>
              It is a technical readiness audit. It does not guarantee rankings,
              citations, traffic, or visibility in any AI search product.
            </p>

            <h2>What is an AEO audit?</h2>
            <p>
              AEO stands for Answer Engine Optimization. An AEO audit reviews
              the technical and content signals that help search engines, answer
              engines, and AI-assisted retrieval systems understand a page. It
              looks beyond one file or one tag and checks the full readiness
              foundation.
            </p>

            <h2>What an AEO audit checks</h2>
            <ul>
              <li>
                <strong>Technical crawlability:</strong> status code, HTML
                response, title, meta description, canonical, and noindex rules.
              </li>
              <li>
                <strong>AI search files:</strong> LLMs.txt, LLMs-full.txt,
                sitemap.xml, robots.txt, and AI crawler access.
              </li>
              <li>
                <strong>Structured data:</strong> JSON-LD schema types, parse
                errors, and missing schema opportunities.
              </li>
              <li>
                <strong>Answer-ready content:</strong> H1/H2/H3 structure, FAQ
                sections, question headings, short answers, lists, and steps.
              </li>
              <li>
                <strong>Entity clarity:</strong> brand name, organization
                schema, og:site_name, and title/H1 consistency.
              </li>
              <li>
                <strong>Trust signals:</strong> author, published date, modified
                date, about, contact, privacy, and source links.
              </li>
            </ul>

            <h2>Technical AEO checklist</h2>
            <div className="not-prose mt-6 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <IconCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <p className="text-sm text-gray-600 dark:text-zinc-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <h2>How to prioritize AEO fixes</h2>
            <p>
              Start with blockers that prevent a page from being crawled or
              understood: failed HTTP responses, noindex rules, missing title
              tags, broken canonical tags, blocked crawlers, and invalid
              JSON-LD. Then improve answer-ready formatting, schema coverage,
              entity clarity, and trust signals.
            </p>

            <h2>What not to expect</h2>
            <p>
              AEO is not AI visibility tracking, citation tracking, or a ranking
              guarantee. A technical audit helps you find gaps that are worth
              fixing, but AI search products decide what to crawl, summarize,
              cite, or rank using systems outside your control.
            </p>
          </article>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Run a free AEO audit
            </h2>
            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Check crawlability, AI crawler access, structured data,
              answer-ready content, entity clarity, trust signals, and
              recommended fixes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Run AEO Audit <IconArrowRight size={16} />
              </a>
              <a
                href="/tools/query-fan-out-tool"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300"
              >
                Plan Answer-Ready Content
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Real-world example */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Real-world example: Tailscale
            </h2>
            <p className="mt-6 text-gray-500 dark:text-zinc-400">
              Tailscale's documentation site demonstrates strong AEO readiness
              in production. Every page has: a single H1, descriptive H2
              sections, structured FAQ blocks with question headings, JSON-LD
              Organization and WebSite schema, clear author and date metadata,
              an accessible LLMs.txt, and explicit AI crawler rules in
              robots.txt allowing GPTBot and ClaudeBot. Run{' '}
              <code>tailscale.com</code> through the AEO Checker to see how a
              well-optimized technical docs site scores.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-16 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

export const Route = createFileRoute('/guides/aeo-audit')({
  head: () => ({
    ...seo('/guides/aeo-audit', {
      title: 'AEO Audit Guide - Technical Answer Engine Optimization Checklist',
      description:
        'Learn what an AEO audit checks, including crawlability, LLMs.txt, AI crawler access, structured data, answer-ready content, entity clarity, and trust signals.',
      type: 'article',
    }),
    scripts: [
      jsonLd(articleSchema()),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'AEO Audit Guide',
            url: getCanonicalUrl('/guides/aeo-audit'),
          },
        ])
      ),
    ],
  }),
  component: AeoAuditGuidePage,
});

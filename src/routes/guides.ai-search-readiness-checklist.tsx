import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

const checklistSections = [
  {
    title: 'Crawl access',
    items: [
      'The page returns a 200 HTML response.',
      'Canonical points to the live URL you want indexed.',
      'Meta robots and robots.txt do not block the page.',
      'Sitemap includes the canonical URL.',
    ],
  },
  {
    title: 'AI crawler access',
    items: [
      'GPTBot, OAI-SearchBot, and ChatGPT-User can access public pages.',
      'ClaudeBot and Claude-SearchBot can access public pages.',
      'PerplexityBot and Perplexity-User can access public pages.',
      'Private pages such as dashboard, auth, and admin remain blocked.',
    ],
  },
  {
    title: 'Machine-readable files',
    items: [
      '/llms.txt lists important tools, guides, methodology, and contact pages.',
      '/llms-full.txt explains the site, product scope, and key concepts.',
      'RSS and sitemap files expose fresh crawl paths.',
      'Robots.txt references the sitemap.',
    ],
  },
  {
    title: 'Answer-ready content',
    items: [
      'The main question is answered in the first screen or first section.',
      'H2 headings are written as user questions or concrete tasks.',
      'FAQ sections answer objections, limits, pricing, and implementation.',
      'Tables, lists, and examples make extraction easy.',
    ],
  },
  {
    title: 'Trust and entity signals',
    items: [
      'Organization, WebSite, Article, FAQPage, or SoftwareApplication schema is present where relevant.',
      'About, methodology, references, privacy, terms, and contact pages are linked.',
      'Claims avoid guarantees and explain limits clearly.',
      'The brand name, product category, and use case are consistent across title, H1, schema, and llms.txt.',
    ],
  },
];

const faqItems = [
  {
    q: 'What is an AI search readiness checklist?',
    a: 'An AI search readiness checklist is a practical list of crawl, schema, content, entity, trust, and AI crawler access checks that make a page easier for search engines and AI answer systems to parse.',
  },
  {
    q: 'Does AI search readiness guarantee citations?',
    a: 'No. It improves technical and content readiness, but it does not guarantee rankings, traffic, AI Overview inclusion, or citations in ChatGPT, Claude, Gemini, Perplexity, or other AI systems.',
  },
  {
    q: 'What should I fix first?',
    a: 'Fix crawl blockers first: failed HTTP status, noindex, broken canonicals, blocked crawlers, missing sitemap entries, and invalid schema. Then improve answer-ready content and trust signals.',
  },
];

function articleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AI Search Readiness Checklist',
    description:
      'A practical checklist for crawl access, AI crawler access, LLMs.txt, schema, answer-ready content, trust signals, and GEO readiness.',
    url: getCanonicalUrl('/guides/ai-search-readiness-checklist'),
    mainEntityOfPage: getCanonicalUrl('/guides/ai-search-readiness-checklist'),
    publisher: {
      '@type': 'Organization',
      name: 'AI Search Readiness Tools',
      url: getCanonicalUrl('/'),
    },
  };
}

function AiSearchReadinessChecklistPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-gray-200 py-16 dark:border-zinc-800/50 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              AI search readiness checklist
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Check whether a page is ready for ChatGPT and AI answers
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-zinc-400">
              Use this checklist before publishing a landing page, comparison
              page, guide, or product page that you want Google and AI answer
              systems to understand.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/tools/aeo-checker?utm_source=guide&utm_medium=organic&utm_campaign=ai-search-readiness-checklist&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Run free AEO checker
                <IconArrowRight size={16} />
              </a>
              <a
                href="/sample-aeo-report?utm_source=guide&utm_medium=organic&utm_campaign=ai-search-readiness-checklist&utm_content=cta-top"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
              >
                Preview the $19 Fix Pack
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mx-auto max-w-4xl rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/60 dark:bg-blue-950/20">
            <h2 className="text-xl font-bold text-gray-950 dark:text-zinc-50">
              Short answer
            </h2>
            <p className="mt-3 text-gray-700 dark:text-zinc-300">
              A page is AI-search ready when it is crawlable, indexable,
              machine-readable, structured with direct answers, backed by trust
              signals, and accessible to the AI crawlers you want to allow.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2">
              {checklistSections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <h2 className="text-lg font-semibold text-gray-950 dark:text-zinc-50">
                    {section.title}
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-zinc-400">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <IconCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Recommended workflow
            </h2>
            <ol className="mt-5 space-y-4 text-gray-700 dark:text-zinc-300">
              <li>
                <strong>1. Check technical blockers.</strong> Confirm status,
                canonical, robots rules, sitemap, and schema before changing
                copy.
              </li>
              <li>
                <strong>2. Add direct answer blocks.</strong> Put the main
                answer, use case, limitation, pricing, and implementation notes
                in plain language.
              </li>
              <li>
                <strong>3. Publish machine-readable indexes.</strong> Keep
                sitemap, robots.txt, llms.txt, llms-full.txt, and RSS current.
              </li>
              <li>
                <strong>4. Re-run after changes.</strong> Use the AEO Checker
                after publishing to catch regressions before submitting URLs.
              </li>
            </ol>
            <p className="mt-5 text-sm text-gray-600 dark:text-zinc-400">
              Need the repair path by blocker? Use the{' '}
              <a
                href="/playbooks?utm_source=guide&utm_medium=organic&utm_campaign=ai-search-readiness-checklist&utm_content=workflow"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                AI Search Readiness Playbooks
              </a>{' '}
              to choose the next fix workflow.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 py-14 dark:border-zinc-800/50">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
              Frequently asked questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>
    </main>
  );
}

export const Route = createFileRoute('/guides/ai-search-readiness-checklist')({
  head: () => ({
    ...seo('/guides/ai-search-readiness-checklist', {
      title: 'AI Search Readiness Checklist - AEO and GEO Page Audit',
      description:
        'Use this AI search readiness checklist to audit crawl access, AI crawler access, LLMs.txt, schema, answer-ready content, trust signals, and GEO readiness.',
      type: 'article',
    }),
    scripts: [
      jsonLd(articleSchema()),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        itemListSchema('/guides/ai-search-readiness-checklist', [
          {
            name: 'Run AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
          },
          {
            name: 'Preview Sample AI Visibility Report',
            url: getCanonicalUrl('/sample-aeo-report'),
          },
          {
            name: 'AI Search Readiness Playbooks',
            url: getCanonicalUrl('/playbooks'),
          },
          {
            name: 'AEO Audit Guide',
            url: getCanonicalUrl('/guides/aeo-audit'),
          },
        ])
      ),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'AI Search Readiness Checklist',
            url: getCanonicalUrl('/guides/ai-search-readiness-checklist'),
          },
        ])
      ),
    ],
  }),
  component: AiSearchReadinessChecklistPage,
});

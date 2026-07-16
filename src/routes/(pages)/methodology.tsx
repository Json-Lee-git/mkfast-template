import { createFileRoute, notFound } from '@tanstack/react-router';
import { AIAnswerFramework } from '@/components/ai-visibility/ai-answer-framework';
import Container from '@/components/layout/container';
import { websiteConfig } from '@/config/website';
import {
  articleSchema,
  breadcrumbSchema,
  jsonLd,
  organizationSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { getAiReadinessCategoryWeight } from '@/lib/ai-readiness-score-model';
import { getPageBySlug } from '@/lib/pages';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import {
  IconSearch,
  IconFileText,
  IconCode,
  IconMessageCircle,
  IconUserCheck,
  IconShield,
  IconArrowRight,
  IconCheck,
  IconExternalLink,
} from '@tabler/icons-react';

const PAGE_DATE = '2026-07-16T00:00:00.000Z';

export const Route = createFileRoute('/(pages)/methodology')({
  loader: () => {
    const page = getPageBySlug('methodology');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    const metadata = seo('/methodology', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    const path = '/methodology';
    return {
      ...metadata,
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd(websiteSchema()),
        jsonLd(
          articleSchema({
            path,
            type: 'TechArticle',
            headline: p.title,
            description: p.description,
            datePublished: p.date ? new Date(p.date).toISOString() : PAGE_DATE,
            dateModified: PAGE_DATE,
            about: [
              'Answer engine optimization',
              'AI search readiness',
              'Structured data',
              'AI crawler access',
            ],
          })
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: 'Home', url: getCanonicalUrl('/') },
              { name: p.title, url: getCanonicalUrl(path) },
            ],
            path
          )
        ),
      ],
    };
  },
  component: MethodologyPage,
});

// ---------- Data ----------

const auditModules = [
  {
    id: 'crawl',
    icon: IconSearch,
    title: `Technical Crawlability · ${getAiReadinessCategoryWeight('technical')} points`,
    description:
      'HTTP status, title, meta description, canonical URL presence, and the meta robots noindex directive.',
    checks: [
      'Successful HTTP status',
      'Title tag presence',
      'Meta description presence',
      'Canonical URL presence',
      'Meta robots noindex detection',
    ],
  },
  {
    id: 'files',
    icon: IconFileText,
    title: `AI Files & Crawler Access · ${getAiReadinessCategoryWeight('files')} points`,
    description:
      'Availability of public AI-readable files and robots.txt rules for the AI crawler user agents listed in the scan.',
    checks: [
      'Robots.txt availability and reported crawler rules',
      '/sitemap.xml availability',
      'LLMs.txt and LLMs-full.txt availability',
      'AI crawler rules reported by the scan',
    ],
  },
  {
    id: 'schema',
    icon: IconCode,
    title: `Schema · ${getAiReadinessCategoryWeight('schema')} points`,
    description:
      'JSON-LD presence, parse errors, detected types, and selected entity or content schema type coverage.',
    checks: [
      'JSON-LD presence and parse validity',
      'Detected schema types',
      'Organization, WebSite, or WebPage type presence',
      'Article, BlogPosting, FAQPage, Product, or HowTo type presence',
    ],
  },
  {
    id: 'content',
    icon: IconMessageCircle,
    title: `Answer-ready Content · ${getAiReadinessCategoryWeight('content')} points`,
    description:
      'H1 and H2 counts, question-format headings, FAQ-section signals, and concise answer paragraphs.',
    checks: [
      'H1 count',
      'At least two H2 headings',
      'Question-format heading detection',
      'FAQ section detection',
      'At least two paragraphs containing 20-100 words each',
    ],
  },
  {
    id: 'entity',
    icon: IconUserCheck,
    title: `Entity Clarity · ${getAiReadinessCategoryWeight('entity')} points`,
    description:
      'An inferred brand name, og:site_name, Organization schema, and repeated brand mentions provide observable entity clarity signals.',
    checks: [
      'Inferred brand name from title/OG/H1',
      'og:site_name presence',
      'Organization schema presence',
      'Brand mention frequency',
    ],
  },
  {
    id: 'trust',
    icon: IconShield,
    title: `Trust Signals · ${getAiReadinessCategoryWeight('trust')} points`,
    description:
      'Author attribution, publication dates, about/contact pages, privacy information, and external references. Trust signals help AI systems assess content authority.',
    checks: [
      'Author attribution presence',
      'Published and modified dates',
      'About page link detection',
      'Contact page link detection',
      'Privacy policy link detection',
      'At least two external links',
    ],
  },
];

const scoringFramework = [
  {
    range: '80-100',
    label: 'Strong technical AEO readiness',
    meaning:
      'The page has most recommended technical signals in place. Crawlers can access it, structured data is present and valid, content is well-structured, and trust signals are clear.',
  },
  {
    range: '60-79',
    label: 'Good foundation with improvement opportunities',
    meaning:
      'The page has core fundamentals working but misses some recommended signals. A few targeted fixes could meaningfully improve AI search readiness.',
  },
  {
    range: '40-59',
    label: 'Partial readiness, several important gaps',
    meaning:
      'The page has basic crawlability but is missing several signals that answer engines typically look for. A structured repair plan is recommended.',
  },
  {
    range: '0-39',
    label: 'Weak technical AEO readiness',
    meaning:
      'The page is missing most recommended signals. AI systems may struggle to understand, extract, or cite the content reliably.',
  },
];

const externalStandards = [
  {
    name: 'Google Search Central',
    topics: 'Robots.txt, sitemaps, structured data, helpful content',
    url: 'https://developers.google.com/search/docs',
  },
  {
    name: 'Schema.org',
    topics: 'Structured data vocabulary',
    url: 'https://schema.org/',
  },
  {
    name: 'OpenAI Crawler Docs',
    topics: 'GPTBot, OAI-SearchBot, crawler controls',
    url: 'https://platform.openai.com/docs/bots',
  },
  {
    name: 'Perplexity Crawler Docs',
    topics: 'PerplexityBot, Perplexity-User, crawler controls',
    url: 'https://docs.perplexity.ai/guides/bots',
  },
  {
    name: 'Anthropic Crawler Guidance',
    topics: 'ClaudeBot and crawler controls',
    url: 'https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler',
  },
  {
    name: 'LLMs.txt Proposal',
    topics: 'Optional AI-readable site summaries',
    url: 'https://llmstxt.org/',
  },
];

// ---------- Page Component ----------

function MethodologyPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/50 py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              AEOCheck Methodology
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How we audit AI search readiness
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {page.description}
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Last reviewed: July 16, 2026
            </p>
          </div>
        </Container>
      </section>

      {/* AI answer framework */}
      <section className="border-b border-border/50 py-16">
        <Container>
          <AIAnswerFramework
            eyebrow="Methodology model"
            title="The six scored readiness categories"
            description="The score covers technical crawlability, AI files and crawler access, schema, answer-ready content, entity clarity, and trust signals."
          />
        </Container>
      </section>

      {/* What we audit */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              What we inspect
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              AEOCheck evaluates public, machine-readable signals that a search
              engine, answer engine, or crawler can reasonably inspect from a
              website. The tools are designed for technical readiness checks,
              not for ranking predictions.
            </p>

            <div className="mt-10 space-y-6">
              {auditModules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-border/60 bg-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <mod.icon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {mod.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {mod.description}
                      </p>
                      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                        {mod.checks.map((check) => (
                          <li
                            key={check}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <IconCheck
                              size={14}
                              className="mt-0.5 shrink-0 text-emerald-500"
                            />
                            {check}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Scoring model */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              How the AI Search Readiness Score is built
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The AI Search Readiness Score totals 100 points across exactly six
              categories: technical crawlability (15), AI files and crawler
              access (20), schema (20), answer-ready content (20), entity
              clarity (15), and trust signals (10). Recommendations and any
              AI-generated analysis do not add or subtract points.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              AEOCheck does not publish an explicit algorithm version
              identifier. The Last reviewed date is editorial metadata for this
              explanation, not an algorithm version or evidence of a scoring
              code change.
            </p>

            <div className="mt-8 space-y-4">
              {scoringFramework.map((tier) => (
                <div
                  key={tier.range}
                  className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 p-5"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {tier.range}
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {tier.label}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tier.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Current limitations */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              Current limitations and planned checks
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The current score does not test WAF, bot-management, or CDN
              behavior; run dedicated Googlebot or Bingbot access checks;
              compare canonical, redirect, and sitemap variants for consistency;
              judge every recommended schema property for completeness; or award
              points for tables and list markup. These may be considered for
              future versions and must not be treated as implemented checks.
            </p>
          </div>
        </Container>
      </section>

      {/* External standards */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              External standards we reference
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Our checks are informed by public documentation and open
              standards. We do not use private ranking factors or proprietary
              algorithms.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {externalStandards.map((standard) => (
                <a
                  key={standard.name}
                  href={standard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {standard.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {standard.topics}
                    </p>
                  </div>
                  <IconExternalLink
                    size={14}
                    className="mt-0.5 shrink-0 text-muted-foreground/50"
                  />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* What the Fix Pack adds */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              What the Fix Pack adds
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The free scan shows you what needs attention. The $19 Fix Pack
              turns the diagnosis into a prioritized implementation plan with
              copy-ready assets.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: 'Prioritized repair order',
                  desc: 'Issues ranked by impact on AI search readiness, so you fix the highest-value gaps first.',
                },
                {
                  title: 'Copy-ready JSON-LD schema',
                  desc: 'Schema snippets you can paste directly into your page, customized for your content type.',
                },
                {
                  title: 'Answer-ready content blocks',
                  desc: 'Suggested rewrites for key sections using question-answer format that AI systems extract well.',
                },
                {
                  title: 'Query fan-out content gaps',
                  desc: 'Queries your page could answer but does not, with suggested content additions.',
                },
                {
                  title: 'LLMs.txt improvement plan',
                  desc: 'Specific edits to your LLMs.txt and LLMs-full.txt files for better AI crawler guidance.',
                },
                {
                  title: 'Implementation handoff',
                  desc: 'A single Markdown file you can hand directly to a developer or content editor.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-muted/20 p-4"
                >
                  <h4 className="font-medium text-foreground">{item.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Run a free audit <IconArrowRight size={15} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* What we do not guarantee */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              What we do not guarantee
            </h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: 'No ranking or citation guarantees',
                  desc: 'We do not claim that a page will rank, be cited, appear in an AI Overview, or receive traffic from any search product. Google says there are no extra technical requirements, special schema, or AI-specific files required for AI Overviews or AI Mode.',
                },
                {
                  title: 'No private ranking factor knowledge',
                  desc: 'We do not claim to know private ranking factors, private retrieval indexes, model training data, citation algorithms, user-level personalization, or traffic forecasts.',
                },
                {
                  title: 'No AI visibility tracking',
                  desc: 'This tool does not monitor whether your brand appears in ChatGPT, Perplexity, Gemini, Claude, or Google AI Overviews. It checks readiness signals, not visibility outcomes.',
                },
                {
                  title: 'Readiness recommendations, not predictions',
                  desc: 'If a finding is based on a technical signal rather than a published platform rule, we describe it as a readiness recommendation.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-card p-5"
                >
                  <h4 className="font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Corrections */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground">
              Review cadence & corrections
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Core tool logic, guides, and glossary definitions are reviewed
              when major search or AI crawler documentation changes. Important
              methodology updates are reflected on this page and in the affected
              content metadata.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If you find an outdated crawler name, incorrect technical
              recommendation, or unclear limitation, use the{' '}
              <a
                href="/contact"
                className="text-primary hover:underline font-medium"
              >
                contact page
              </a>
              . Corrections are treated as product quality issues.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

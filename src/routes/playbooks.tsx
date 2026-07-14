import { FAQ } from '@/components/ai-visibility/faq';
import Container from '@/components/layout/container';
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { trackConversionEvent } from '@/lib/conversion-events';
import type { ConversionEventName } from '@/lib/conversion-event-names';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import {
  IconArrowRight,
  IconChartBar,
  IconChecks,
  IconFileText,
  IconRobot,
  IconSearch,
  IconShieldCheck,
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';

const playbooks = [
  {
    title: 'AEO page audit playbook',
    description:
      'Review one important page for answer clarity, evidence, crawlability, and citation readiness before you publish or refresh it.',
    href: '/guides/ai-search-readiness-checklist',
    cta: 'Open checklist',
    toolHref: '/tools/aeo-checker',
    toolLabel: 'Run AEO Checker',
    icon: IconSearch,
    steps: [
      'Confirm the page answers one specific search task.',
      'Check title, summary, headings, and factual support.',
      'Run the page through the AEO Checker and fix blockers first.',
    ],
  },
  {
    title: 'LLMs.txt implementation playbook',
    description:
      'Create, validate, and maintain an llms.txt file that points AI systems toward your best crawlable reference pages.',
    href: '/guides/llms-txt-file',
    cta: 'Read guide',
    toolHref: '/tools/llms-txt-checker',
    toolLabel: 'Check llms.txt',
    icon: IconFileText,
    steps: [
      'Choose only stable, useful, public URLs.',
      'Generate the file, then validate status codes and formatting.',
      'Recheck after major navigation or content changes.',
    ],
  },
  {
    title: 'AI crawler access playbook',
    description:
      'Find whether important AI crawlers can reach your site and whether robots.txt, redirects, or headers are blocking discovery.',
    href: '/tools/robots-txt-ai-crawler-checker',
    cta: 'Check robots.txt',
    toolHref: '/blog/gptbot-vs-oai-searchbot',
    toolLabel: 'Compare crawlers',
    icon: IconRobot,
    steps: [
      'Test robots.txt rules for key AI crawler user agents.',
      'Review blocked paths, sitemap links, redirects, and HTTP status.',
      'Keep intentional blocks documented so later fixes do not undo them.',
    ],
  },
  {
    title: 'ChatGPT citation readiness playbook',
    description:
      'Prepare a page to be easier to understand, verify, and reference in answer engines without making unsupported citation promises.',
    href: '/tools/chatgpt-citation-readiness-checker',
    cta: 'Check citation readiness',
    toolHref: '/methodology',
    toolLabel: 'View methodology',
    icon: IconShieldCheck,
    steps: [
      'State the answer, audience, limits, and source trail clearly.',
      'Add first-party proof, dates, definitions, and comparison context.',
      'Remove vague claims that cannot be verified from the page itself.',
    ],
  },
  {
    title: 'Comparison page readiness playbook',
    description:
      'Improve alternative, versus, and category pages so they answer real comparison questions instead of reading like thin SEO pages.',
    href: '/compare/aeo-checker-alternatives',
    cta: 'See example',
    toolHref: '/tools/query-fan-out-tool',
    toolLabel: 'Expand queries',
    icon: IconChecks,
    steps: [
      'Map the decision criteria users and AI systems need to compare.',
      'Show tradeoffs, exclusions, pricing context, and use cases.',
      'Use query fan-out to cover related follow-up questions naturally.',
    ],
  },
  {
    title: 'AI referral measurement playbook',
    description:
      'Separate meaningful search demand from bot traffic, self-testing, and analytics noise before making product or content decisions.',
    href: '/references',
    cta: 'Review references',
    toolHref: '/sample-aeo-report',
    toolLabel: 'Preview sample Fix Pack',
    icon: IconChartBar,
    steps: [
      'Filter internal tests, previews, uptime checks, and suspicious spikes.',
      'Compare GSC impressions with GA4 landing pages and referrers.',
      'Use directional trends rather than single-day AI referral counts.',
    ],
  },
];

const conversionPaths = [
  {
    title: 'Start with a free scan',
    description:
      'Use this when you have one URL and need to know which blockers are real before editing.',
    href: '/tools/aeo-checker?utm_source=playbooks&utm_medium=organic&utm_campaign=playbooks_conversion&utm_content=free-scan',
    label: 'Run AEO Checker',
    event: 'playbooks_free_scan_clicked',
  },
  {
    title: 'Preview the $19 Fix Pack',
    description:
      'Use this when the scan is useful, but you want to see the implementation handoff before unlocking it.',
    href: '/sample-aeo-report?utm_source=playbooks&utm_medium=organic&utm_campaign=playbooks_conversion&utm_content=sample-report',
    label: 'Preview sample Fix Pack',
    event: 'playbooks_sample_report_clicked',
  },
  {
    title: 'Get a human priority order',
    description:
      'Use this for one commercial page where the first fixes matter and you want a human-reviewed plan.',
    href: '/ai-search-audit?utm_source=playbooks&utm_medium=organic&utm_campaign=playbooks_conversion&utm_content=manual-audit',
    label: 'Order human audit',
    event: 'playbooks_manual_audit_clicked',
  },
] satisfies Array<{
  title: string;
  description: string;
  href: string;
  label: string;
  event: ConversionEventName;
}>;

const workflowSteps = [
  {
    title: 'Technical access',
    body: 'Start with robots.txt, sitemap coverage, redirects, status codes, and canonical signals. If crawlers cannot reach the page, copy improvements will not matter much.',
  },
  {
    title: 'Machine-readable context',
    body: 'Then make your best public references easy to discover through llms.txt, clean navigation, internal links, and stable canonical URLs.',
  },
  {
    title: 'Answer-ready content',
    body: 'Upgrade the page so it gives a direct answer, defines terms, shows evidence, explains tradeoffs, and links to deeper supporting material.',
  },
  {
    title: 'Evidence and measurement',
    body: 'Finally, watch GSC and analytics for directionally useful signals while filtering automation, internal testing, and one-off noise.',
  },
];

const faqItems = [
  {
    q: 'What is an AI search readiness playbook?',
    a: 'It is a repeatable workflow for improving one part of your AI search surface, such as crawler access, llms.txt, page structure, citation readiness, or measurement.',
  },
  {
    q: 'Do these playbooks guarantee AI citations?',
    a: 'No. They reduce avoidable blockers and improve the quality of signals available to search and answer systems, but no checklist can guarantee inclusion or citation.',
  },
  {
    q: 'Which playbook should I start with?',
    a: 'Start with crawler access and the AEO page audit. Those two reveal whether the page can be discovered and whether it is clear enough to be useful once discovered.',
  },
  {
    q: 'How often should I run these checks?',
    a: 'Run them after major content, navigation, robots.txt, sitemap, or template changes. For important pages, a monthly review is usually enough unless traffic changes sharply.',
  },
];

function collectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Search Readiness Playbooks',
    description:
      'Practical playbooks for AEO audits, llms.txt implementation, AI crawler access, ChatGPT citation readiness, comparison pages, and AI referral measurement.',
    url: getCanonicalUrl('/playbooks'),
    about: [
      'AI search optimization',
      'Answer engine optimization',
      'LLMs.txt',
      'AI crawler access',
      'AI referral measurement',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'AI Search Readiness Tools',
      url: getCanonicalUrl('/'),
    },
  };
}

function PlaybooksPage() {
  return (
    <main>
      <section className="border-border border-b bg-muted/30">
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 font-medium text-primary text-sm">
              AI search operations
            </p>
            <h1 className="text-balance font-bold text-4xl tracking-tight md:text-5xl">
              AI Search Readiness Playbooks
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-8">
              Practical workflows for turning audits into action: crawler
              access, llms.txt, page readiness, comparison content, and
              measurement cleanup.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                href="/tools/aeo-checker?utm_source=playbooks&utm_medium=organic&utm_campaign=playbooks_hero&utm_content=free-scan"
                onClick={() =>
                  trackConversionEvent('playbooks_hero_free_scan_clicked')
                }
              >
                Run free AEO Checker
                <IconArrowRight size={16} />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-5 py-3 font-medium text-sm transition-colors hover:bg-muted"
                href="/sample-aeo-report?utm_source=playbooks&utm_medium=organic&utm_campaign=playbooks_hero&utm_content=sample-report"
                onClick={() =>
                  trackConversionEvent('playbooks_hero_sample_report_clicked')
                }
              >
                Preview sample Fix Pack
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-border border-b">
        <Container className="py-10">
          <div className="max-w-4xl rounded-lg border border-border bg-card p-6">
            <p className="font-semibold text-sm">Short answer</p>
            <p className="mt-2 text-muted-foreground leading-7">
              Use these playbooks when an audit finds a problem but the next
              step is unclear. Each one starts with a concrete diagnostic, links
              to the relevant free tool or guide, and ends with a small set of
              fixes you can repeat across important pages.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14 md:py-16">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-bold text-2xl tracking-tight md:text-3xl">
              Choose the workflow that matches the blocker
            </h2>
            <p className="mt-3 text-muted-foreground leading-7">
              The goal is not to run every tool every day. Pick the weakest
              link, fix it, then move to the next constraint.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {playbooks.map((playbook) => {
              const Icon = playbook.icon;

              return (
                <article
                  className="flex min-h-full flex-col rounded-lg border border-border bg-card p-6"
                  key={playbook.title}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-semibold text-xl">{playbook.title}</h3>
                  <p className="mt-3 text-muted-foreground text-sm leading-6">
                    {playbook.description}
                  </p>
                  <ol className="mt-5 space-y-3 text-sm">
                    {playbook.steps.map((step, index) => (
                      <li className="flex gap-3" key={step}>
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-[11px]">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground leading-6">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-auto flex flex-col gap-2 pt-6">
                    <a
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
                      href={playbook.href}
                    >
                      {playbook.cta}
                      <IconArrowRight size={15} />
                    </a>
                    <a
                      className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 font-medium text-sm transition-colors hover:bg-muted"
                      href={playbook.toolHref}
                    >
                      {playbook.toolLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-border border-y bg-muted/30">
        <Container className="py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-medium text-primary text-sm">
                Operating order
              </p>
              <h2 className="mt-3 font-bold text-2xl tracking-tight md:text-3xl">
                Fix the constraint chain in order
              </h2>
              <p className="mt-4 text-muted-foreground leading-7">
                AI search readiness fails in layers. A strong page with blocked
                crawlers is invisible. A crawlable page with vague claims is
                weak evidence. Clean measurement keeps you from optimizing for
                noise.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workflowSteps.map((step, index) => (
                <div
                  className="rounded-lg border border-border bg-background p-5"
                  key={step.title}
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-6">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-border border-t">
        <Container className="py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="font-medium text-primary text-sm">Next action</p>
              <h2 className="mt-3 font-bold text-2xl tracking-tight md:text-3xl">
                Turn the playbook into a concrete next step
              </h2>
              <p className="mt-4 text-muted-foreground leading-7">
                Pick the path that matches your confidence level. Scan first if
                the problem is unclear, preview the paid handoff if you need
                implementation detail, or order a human review when the page is
                commercially important.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {conversionPaths.map((path) => (
                <a
                  className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:bg-muted/40"
                  href={path.href}
                  key={path.title}
                  onClick={() => trackConversionEvent(path.event)}
                >
                  <h3 className="font-semibold">{path.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-6">
                    {path.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-medium text-primary text-sm">
                    {path.label}
                    <IconArrowRight size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-border border-t py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-bold text-2xl tracking-tight">
              Frequently asked questions
            </h2>
            <FAQ className="mt-8" items={faqItems} />
          </div>
        </Container>
      </section>
    </main>
  );
}

export const Route = createFileRoute('/playbooks')({
  head: () => ({
    ...seo('/playbooks', {
      title:
        'AI Search Readiness Playbooks - AEO, LLMs.txt, and AI Crawler Workflows',
      description:
        'Use practical playbooks for AEO audits, llms.txt implementation, AI crawler access, ChatGPT citation readiness, comparison pages, and AI referral tracking.',
    }),
    scripts: [
      jsonLd(collectionPageSchema()),
      jsonLd(
        itemListSchema(
          '/playbooks',
          playbooks.map((playbook) => ({
            name: playbook.title,
            url: getCanonicalUrl(playbook.href),
            description: playbook.description,
          }))
        )
      ),
      jsonLd(faqSchema(faqItems)),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          { name: 'Playbooks', url: getCanonicalUrl('/playbooks') },
        ])
      ),
    ],
  }),
  component: PlaybooksPage,
});

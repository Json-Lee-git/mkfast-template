import { authClient } from '@/auth/client';
import FaqSection from '@/components/blocks/faqs';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { websiteConfig } from '@/config/website';
import { useCurrentPlan } from '@/hooks/use-payment';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import {
  IconArrowRight,
  IconChartBar,
  IconCheck,
  IconFileText,
  IconSearch,
  IconStar,
  IconUserCheck,
} from '@tabler/icons-react';

export const Route = createFileRoute('/(pages)/pricing')({
  validateSearch: (search: Record<string, unknown>) => ({
    intent: typeof search.intent === 'string' ? search.intent : '',
    url: typeof search.url === 'string' ? search.url : '',
  }),
  head: () =>
    seo('/pricing', {
      title: `Pricing - AI Search Readiness Workflow | ${websiteConfig.metadata?.name}`,
      description:
        'Start with a free page audit, unlock a $19 Fix Pack, monitor important pages for $29/mo, or request a $99 manual review.',
    }),
  component: PricingPage,
});

const tiers = [
  {
    name: 'Free Scan',
    price: '$0',
    period: '',
    description: 'Find out what is broken before you edit the page.',
    cta: 'Run free scan',
    href: '/tools/aeo-checker',
    highlight: false,
    badge: '',
    features: [
      'Technical AEO score (0-100)',
      'Crawl access check',
      'LLMs.txt and AI crawler check',
      'Structured data validation',
      'Answer-ready content analysis',
      'Entity clarity check',
      'Trust signals check',
      'Top issues summary',
      'Markdown report export',
    ],
  },
  {
    name: 'Fix Pack',
    price: '$19',
    period: 'one-time',
    description: 'Turn the scan into copy-ready repair assets.',
    cta: 'Unlock Fix Pack',
    href: '/tools/aeo-checker',
    highlight: false,
    badge: '',
    features: [
      'Everything in Free Scan',
      'Full prioritized issue list',
      'Copy-ready JSON-LD schema',
      'Answer-ready content blocks',
      'Query fan-out content gaps',
      'LLMs.txt improvement plan',
      'Implementation handoff',
      'Downloadable fix pack',
      'Entry point before monthly monitoring',
    ],
  },
  {
    name: 'Monitor',
    price: '$29',
    period: '/mo',
    description: 'Managed MVP monitoring for important published pages.',
    cta: 'Request managed monitor',
    href: '/contact?intent=monitor',
    highlight: true,
    badge: 'Best after publishing',
    features: [
      'Monitor one site',
      'Track important URLs',
      'Managed recurring readiness re-check',
      'Meaningful regression email summary',
      'Robots and AI crawler access review',
      'LLMs.txt missing or broken review',
      'Schema disappearance review',
      'Monitored manually during MVP',
    ],
  },
  {
    name: 'Manual Audit',
    price: '$99',
    period: 'one-time',
    description: 'Human review for high-stakes pages.',
    cta: 'Request manual audit',
    href: '/ai-search-audit',
    highlight: false,
    badge: '',
    features: [
      'Everything in Fix Pack',
      'Human review of one page',
      'Entity strategy assessment',
      'Trust architecture review',
      'Competitive positioning notes',
      'Written audit summary',
      'Priority implementation roadmap',
      'One revision round',
    ],
  },
];

const comparisonRows = [
  {
    feature: 'Page audit',
    free: '1 page',
    fix: '1 page',
    monitor: 'Important URLs',
    manual: '1 page',
  },
  {
    feature: 'Technical AEO score',
    free: 'Yes',
    fix: 'Yes',
    monitor: 'Recurring',
    manual: 'Yes',
  },
  {
    feature: 'Crawl and AI file checks',
    free: 'Yes',
    fix: 'Yes',
    monitor: 'Managed review',
    manual: 'Yes',
  },
  {
    feature: 'Structured data validation',
    free: 'Yes',
    fix: 'Yes',
    monitor: 'Managed review',
    manual: 'Yes',
  },
  {
    feature: 'Content structure analysis',
    free: 'Yes',
    fix: 'Yes',
    monitor: 'Managed review',
    manual: 'Yes',
  },
  {
    feature: 'Top issues summary',
    free: '3 issues',
    fix: 'Full list, prioritized',
    monitor: 'New critical issues',
    manual: 'Full list, prioritized',
  },
  {
    feature: 'Markdown export',
    free: 'Free summary',
    fix: 'Full fix pack',
    monitor: 'Email summary',
    manual: 'Full audit report',
  },
  {
    feature: 'Copy-ready schema',
    free: 'No',
    fix: 'Yes',
    monitor: 'Schema review',
    manual: 'Yes',
  },
  {
    feature: 'Answer-ready content blocks',
    free: 'No',
    fix: 'Yes',
    monitor: 'Structure review',
    manual: 'Yes',
  },
  {
    feature: 'Query fan-out gaps',
    free: 'No',
    fix: 'Yes',
    monitor: 'No',
    manual: 'Yes',
  },
  {
    feature: 'LLMs.txt plan',
    free: 'No',
    fix: 'Yes',
    monitor: 'Broken file review',
    manual: 'Yes',
  },
  {
    feature: 'Implementation handoff',
    free: 'No',
    fix: 'Yes',
    monitor: 'No',
    manual: 'Yes',
  },
  {
    feature: 'Ongoing re-scan',
    free: 'No',
    fix: 'No',
    monitor: 'Yes',
    manual: 'No',
  },
  {
    feature: 'Human review',
    free: 'No',
    fix: 'No',
    monitor: 'No',
    manual: 'Yes',
  },
  {
    feature: 'Entity strategy notes',
    free: 'No',
    fix: 'No',
    monitor: 'No',
    manual: 'Yes',
  },
  {
    feature: 'Competitive positioning',
    free: 'No',
    fix: 'No',
    monitor: 'No',
    manual: 'Yes',
  },
  {
    feature: 'Revision round',
    free: 'No',
    fix: 'No',
    monitor: 'No',
    manual: '1 round',
  },
  {
    feature: 'Subscription',
    free: 'No',
    fix: 'No, one-time',
    monitor: 'Yes',
    manual: 'No, one-time',
  },
];

function PricingPage() {
  const { intent, url } = Route.useSearch();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { data: planData } = useCurrentPlan(!!userId);
  const currentPlan = planData?.currentPlan ?? null;
  const monitorRequestHref = `/contact?intent=monitor${
    url ? `&url=${encodeURIComponent(url)}` : ''
  }`;
  const showMonitorIntent = intent === 'monitor';

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/50 py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Audit once. Fix the page. Keep AI visibility monitored.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with a free scan, unlock the $19 Fix Pack when you need
              copy-ready repair assets, then monitor important pages monthly.
              Use manual audit for high-stakes pages.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          {showMonitorIntent && (
            <div className="mx-auto mb-8 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
              <p className="text-sm font-semibold text-primary">
                Managed Monitor early access
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Monitor is currently offered as a managed MVP at $29/mo. We
                review the submitted URL, confirm setup, and send monitoring
                instructions before anything is considered active.
              </p>
            </div>
          )}
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
                  tier.highlight
                    ? 'border-primary/30 ring-1 ring-primary/20 shadow-lg shadow-primary/5'
                    : 'border-border/60'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <IconStar size={12} /> {tier.badge || 'Recommended'}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="ml-1.5 text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  )}
                </div>

                <a
                  href={
                    tier.name === 'Monitor' ? monitorRequestHref : tier.href
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    tier.highlight
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-foreground text-background hover:opacity-90'
                  }`}
                >
                  {tier.cta}
                  <IconArrowRight size={15} />
                </a>

                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <IconCheck
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-foreground">
              Compare plans
            </h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-left font-medium text-muted-foreground">
                      Feature
                    </th>
                    <th className="py-3 text-center font-medium text-muted-foreground">
                      Free Scan
                    </th>
                    <th className="py-3 text-center font-medium text-primary">
                      Fix Pack
                    </th>
                    <th className="py-3 text-center font-medium text-primary">
                      Monitor
                    </th>
                    <th className="py-3 text-center font-medium text-muted-foreground">
                      Manual Audit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b ${
                        i % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'
                      } border-border/50`}
                    >
                      <td className="py-2.5 text-foreground">{row.feature}</td>
                      <td className="py-2.5 text-center text-muted-foreground">
                        {row.free}
                      </td>
                      <td className="py-2.5 text-center font-medium text-primary">
                        {row.fix}
                      </td>
                      <td className="py-2.5 text-center font-medium text-primary">
                        {row.monitor}
                      </td>
                      <td className="py-2.5 text-center text-muted-foreground">
                        {row.manual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: IconSearch,
                  title: 'Free first',
                  desc: 'Audit one page before paying anything. No sign-up required.',
                },
                {
                  icon: IconFileText,
                  title: 'Fix once',
                  desc: 'Pay once for copy-ready assets before your team edits the page.',
                },
                {
                  icon: IconChartBar,
                  title: 'Monitor monthly',
                  desc: 'Use recurring checks for pages that should not silently lose readiness.',
                },
                {
                  icon: IconUserCheck,
                  title: 'No ranking guarantees',
                  desc: 'We do not guarantee citations. We help you catch the technical and content signals that make AI answers more likely to understand, extract, and trust your page.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-muted/20 p-5 text-center"
                >
                  <item.icon
                    size={24}
                    className="mx-auto text-muted-foreground"
                  />
                  <h3 className="mt-3 font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <FaqSection />
          </div>
        </Container>
      </section>

      {websiteConfig.payment?.enable && (
        <section className="border-t border-border/50 py-16">
          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  Account billing
                </h2>
                <p className="mt-2 text-muted-foreground">
                  For teams and agencies that need ongoing access to tools,
                  reports, and monitoring as billing is expanded.
                </p>
              </div>
              <PricingTable
                currentPlan={currentPlan}
                metadata={userId ? { userId } : undefined}
              />
            </div>
          </Container>
        </section>
      )}

      <div className="h-8" />
    </div>
  );
}

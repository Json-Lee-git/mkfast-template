import { authClient } from '@/auth/client';
import FaqSection from '@/components/blocks/faqs';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { websiteConfig } from '@/config/website';
import { useCurrentPlan } from '@/hooks/use-payment';
import { seo } from '@/lib/seo';
import { createFileRoute } from '@tanstack/react-router';
import {
  IconCheck,
  IconArrowRight,
  IconSearch,
  IconFileText,
  IconUserCheck,
  IconStar,
} from '@tabler/icons-react';

export const Route = createFileRoute('/(pages)/pricing')({
  head: () =>
    seo('/pricing', {
      title: `Pricing — AI Search Readiness Tools | ${websiteConfig.metadata?.name}`,
      description:
        'Free page audit, $19 Fix Pack with implementation handoff, or $99 manual human review for one important page.',
    }),
  component: PricingPage,
});

const tiers = [
  {
    name: 'Free Scan',
    price: '$0',
    period: '',
    description:
      'Audit one important page before you edit it. Get your score, find gaps, and see which issues matter first.',
    cta: 'Run free page audit',
    href: '/tools/aeo-checker',
    highlight: false,
    features: [
      'Technical AEO score (0-100)',
      'Crawl access check',
      'LLMs.txt & AI crawler check',
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
    description:
      'Turn the free diagnosis into copy-ready repair assets. Schema, LLMs.txt, content blocks, and a prioritized implementation handoff.',
    cta: 'Start with a free scan',
    href: '/tools/aeo-checker',
    highlight: true,
    features: [
      'Everything in Free Scan',
      'Full prioritized issue list',
      'Copy-ready JSON-LD schema',
      'Answer-ready content blocks',
      'Query fan-out content gaps',
      'LLMs.txt improvement plan',
      'Implementation handoff',
      'Downloadable fix pack',
      'No subscription, one-time purchase',
    ],
  },
  {
    name: 'Manual Audit',
    price: '$99',
    period: 'one-time',
    description:
      'Human review for one important page. Deeper judgment on entity strategy, trust architecture, and competitive AI visibility positioning.',
    cta: 'Request manual audit',
    href: '/ai-search-audit',
    highlight: false,
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
    manual: '1 page',
  },
  {
    feature: 'Technical AEO score',
    free: 'Yes',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Crawl & AI file checks',
    free: 'Yes',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Structured data validation',
    free: 'Yes',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Content structure analysis',
    free: 'Yes',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Top issues summary',
    free: '3 issues',
    fix: 'Full list, prioritized',
    manual: 'Full list, prioritized',
  },
  {
    feature: 'Markdown export',
    free: 'Free summary',
    fix: 'Full fix pack',
    manual: 'Full audit report',
  },
  {
    feature: 'Copy-ready schema',
    free: '—',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Answer-ready content blocks',
    free: '—',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Query fan-out gaps',
    free: '—',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'LLMs.txt plan',
    free: '—',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Implementation handoff',
    free: '—',
    fix: 'Yes',
    manual: 'Yes',
  },
  {
    feature: 'Human review',
    free: '—',
    fix: '—',
    manual: 'Yes',
  },
  {
    feature: 'Entity strategy notes',
    free: '—',
    fix: '—',
    manual: 'Yes',
  },
  {
    feature: 'Competitive positioning',
    free: '—',
    fix: '—',
    manual: 'Yes',
  },
  {
    feature: 'Revision round',
    free: '—',
    fix: '—',
    manual: '1 round',
  },
  {
    feature: 'Subscription',
    free: 'No',
    fix: 'No, one-time',
    manual: 'No, one-time',
  },
];

function PricingPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { data: planData } = useCurrentPlan(!!userId);
  const currentPlan = planData?.currentPlan ?? null;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/50 py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              One free scan. One repair plan. One manual review.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Audit one page free. If you need copy-ready fixes, unlock the $19
              Fix Pack. If you need human judgment, request a $99 manual audit.
            </p>
          </div>
        </Container>
      </section>

      {/* Tier cards */}
      <section className="py-16">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
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
                      <IconStar size={12} /> Recommended
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
                  href={tier.href}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    tier.highlight
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-foreground text-background hover:opacity-90'
                  }`}
                >
                  {tier.cta}
                  <IconArrowRight size={15} />
                </a>

                <ul className="mt-7 space-y-3 flex-1">
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

      {/* Compare table */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
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

      {/* Trust notes */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: IconSearch,
                  title: 'Free first',
                  desc: 'Audit one page before paying anything. No sign-up required.',
                },
                {
                  icon: IconFileText,
                  title: 'One-time purchase',
                  desc: 'No subscriptions. Pay once for the Fix Pack or manual audit.',
                },
                {
                  icon: IconUserCheck,
                  title: 'No ranking guarantees',
                  desc: 'We audit readiness signals, not rankings. Honest about what we measure.',
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

      {/* FAQ */}
      <section className="border-t border-border/50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <FaqSection className="mt-8" />
          </div>
        </Container>
      </section>

      {/* SaaS subscription section (if enabled) */}
      {websiteConfig.payment?.enable && (
        <section className="border-t border-border/50 py-16">
          <Container>
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                  Power-user plans
                </h2>
                <p className="mt-2 text-muted-foreground">
                  For teams and agencies that need ongoing access to all tools
                  and reports.
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

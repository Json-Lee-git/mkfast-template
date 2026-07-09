import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconCode,
  IconMessageCircle,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const readinessLayers = [
  {
    number: '01',
    title: 'Page Access',
    desc: 'Crawlers can reach the page, read the rendered content, and follow the right index rules.',
    icon: IconSearch,
    tone: 'bg-background border-border text-foreground',
  },
  {
    number: '02',
    title: 'Machine-readable Signals',
    desc: 'Schema, titles, canonical tags, entities, and file hints make the page parseable.',
    icon: IconCode,
    tone: 'bg-foreground border-foreground text-background',
  },
  {
    number: '03',
    title: 'Answer Extraction',
    desc: 'Definitions, steps, FAQs, and comparisons give AI systems clean answer blocks to lift.',
    icon: IconMessageCircle,
    tone: 'bg-primary border-primary text-primary-foreground',
  },
  {
    number: '04',
    title: 'Trust Evidence',
    desc: 'Authors, dates, references, brand consistency, and policies reduce ambiguity.',
    icon: IconShieldCheck,
    tone: 'bg-background border-border text-foreground',
  },
  {
    number: '05',
    title: 'AI Answer Fit',
    desc: 'The page has enough structure and evidence to support a generated answer.',
    icon: IconBrain,
    tone: 'bg-primary/10 border-primary/30 text-foreground',
  },
];

const unclearSignals = [
  {
    label: 'Thin signal',
    value: 'A product page with no clear answer block',
  },
  {
    label: 'Generic markup',
    value: 'Schema exists, but entities and intent are vague',
  },
  {
    label: 'Weak evidence',
    value: 'Claims are present, references are hard to verify',
  },
];

const readySignals = [
  'Clear entity and page purpose',
  'Crawler-readable answer blocks',
  'Schema, trust, and references aligned',
  'Prioritized fix order for implementation',
];

type AIAnswerFrameworkProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AIAnswerFramework({
  className,
  eyebrow = 'AI answer readiness framework',
  title = 'The 5 layers behind every AI search answer',
  description = 'AEOCheck turns a page audit into five controllable layers. The scan does not predict rankings. It shows whether crawlers and answer engines can access, parse, extract, and trust the page.',
}: AIAnswerFrameworkProps) {
  return (
    <div className={cn('mx-auto max-w-6xl', className)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold text-foreground text-balance sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.35fr_0.9fr] lg:items-center">
        <div>
          <PartLabel label="Part 1" title="Page Signal Input" />
          <div className="mt-4 rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="flex min-h-12 items-center gap-3 rounded-lg border border-primary/30 bg-background px-4 text-sm text-muted-foreground shadow-[0_10px_30px_oklch(0.32_0.04_255_/_0.10)]">
              <IconSearch size={18} className="shrink-0 text-primary" />
              <span className="truncate">https://example.com/pricing</span>
            </div>
            <div className="mt-5 space-y-3">
              {unclearSignals.map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-border bg-muted/30 p-3"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              The page exists, but answer systems must infer which signals are
              safe to use.
            </p>
          </div>
        </div>

        <div>
          <PartLabel label="Part 2" title="Architecture & Processing" />
          <div className="relative mt-4 min-h-[560px] overflow-hidden rounded-lg border border-border bg-muted/20 px-4 py-8 shadow-[0_24px_70px_oklch(0.32_0.04_255_/_0.10)] sm:px-8">
            <div className="absolute top-10 left-4 hidden items-center gap-2 text-xs font-medium text-muted-foreground lg:flex">
              <span className="h-px w-14 bg-primary/40" />
              Better page signals affect every layer
            </div>
            <div className="absolute top-1/2 -left-4 hidden h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-lg lg:flex">
              <IconArrowRight size={26} />
            </div>
            <div className="absolute top-1/2 -right-4 hidden h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-lg lg:flex">
              <IconArrowRight size={26} />
            </div>
            <div className="relative mx-auto flex max-w-[520px] flex-col-reverse items-center pt-8">
              {readinessLayers.map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <div
                    key={layer.title}
                    className={cn(
                      'relative -mt-1 grid min-h-[92px] w-full max-w-[430px] grid-cols-[54px_1fr_40px] items-center gap-3 border px-4 py-4 shadow-[0_18px_40px_oklch(0.32_0.04_255_/_0.10)] transition-transform hover:-translate-y-1 dark:shadow-none',
                      'rounded-lg lg:[transform:perspective(760px)_rotateX(55deg)_rotateZ(-45deg)] lg:hover:[transform:perspective(760px)_rotateX(55deg)_rotateZ(-45deg)_translateY(-8px)]',
                      layer.tone,
                      index === 0 && 'z-10',
                      index === 1 && 'z-20',
                      index === 2 && 'z-30',
                      index === 3 && 'z-40',
                      index === 4 && 'z-50'
                    )}
                  >
                    <span className="text-xl font-bold tabular-nums">
                      {layer.number}
                    </span>
                    <div className="lg:hidden">
                      <h3 className="text-sm font-semibold">{layer.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 opacity-75">
                        {layer.desc}
                      </p>
                    </div>
                    <span className="hidden lg:block" />
                    <Icon
                      size={24}
                      strokeWidth={1.7}
                      className="justify-self-end opacity-80"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <PartLabel label="Part 3" title="Final Output" />
          <div className="mt-4 rounded-lg border border-border bg-background p-5 shadow-sm">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              Based on: "best page to cite for..."
            </div>
            <div className="mt-3 rounded-lg border border-border bg-background p-4 shadow-[0_14px_35px_oklch(0.32_0.04_255_/_0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconSparkles size={17} />
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    AI-ready answer surface
                  </p>
                </div>
                <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  clearer
                </span>
              </div>
              <div className="mt-5 space-y-2">
                <span className="block h-2 rounded-lg bg-muted" />
                <span className="block h-2 w-10/12 rounded-lg bg-muted" />
                <span className="block h-2 w-8/12 rounded-lg bg-muted" />
              </div>
              <div className="mt-5 space-y-3">
                {readySignals.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <IconCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <a
              href="/tools/aeo-checker"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
            >
              Run a free page audit <IconArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-5">
        {readinessLayers.map((layer) => (
          <div
            key={layer.title}
            className="rounded-lg border border-border bg-background p-4"
          >
            <p className="text-xs font-semibold text-muted-foreground">
              {layer.number}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              {layer.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {layer.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartLabel({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center lg:text-left">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <h3 className="mt-1 text-lg font-bold text-foreground">{title}</h3>
    </div>
  );
}

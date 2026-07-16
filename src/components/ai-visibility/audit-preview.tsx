import { trackConversionEvent } from '@/lib/conversion-events';
import type { ConversionEventName } from '@/lib/conversion-event-names';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';

const fixItems = [
  'Add answer-ready summary near top of page',
  'Expose pricing facts in structured blocks',
  'Add Organization + WebSite JSON-LD schema',
];

type AuditPreviewProps = {
  url?: string;
  score?: number;
  scoreLabel?: string;
  topIssueTitle?: string;
  topIssueDesc?: string;
  citationStatus?: 'ready' | 'not-ready';
  competitorGap?: string;
  trackingEvent?: ConversionEventName;
};

export function AuditPreview({
  url = 'example.com/pricing',
  score = 64,
  scoreLabel = 'Needs structured repair',
  topIssueTitle = 'No answer-ready summary',
  topIssueDesc = 'AI answer engines extract the first clear definition they find. Without one, they fall back to vague page-level signals and may describe this page incorrectly.',
  citationStatus = 'not-ready',
  competitorGap = 'Missing comparison content',
  trackingEvent = 'home_hero_sample_report_clicked',
}: AuditPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_24px_80px_oklch(0.20_0.03_245_/_0.16)]">
      {/* Tool header */}
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_oklch(0.62_0.17_155)]" />
        <span className="font-mono text-xs text-muted-foreground">{url}</span>
        <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
          SCAN READY
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Score row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              AI Search Readiness Score
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-bold tracking-tight text-foreground">
                {score}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 pb-1">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-500">
              {scoreLabel}
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top issue */}
        <div className="mt-5 rounded-md border border-red-500/20 bg-red-500/5 p-3 signal-fail">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-red-600 dark:text-red-500">
              Top issue
            </p>
          </div>
          <p className="mt-1.5 text-sm font-semibold text-foreground">
            {topIssueTitle}
          </p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {topIssueDesc}
          </p>
        </div>

        {/* Status grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-muted/30 p-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              ChatGPT citation
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={
                  citationStatus === 'ready'
                    ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                    : 'h-1.5 w-1.5 rounded-full bg-red-500'
                }
              />
              <span
                className={
                  citationStatus === 'ready'
                    ? 'text-xs font-semibold text-emerald-600 dark:text-emerald-500'
                    : 'text-xs font-semibold text-red-600 dark:text-red-500'
                }
              >
                {citationStatus === 'ready' ? 'Ready' : 'Not ready'}
              </span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Competitor gap
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                {competitorGap}
              </span>
            </div>
          </div>
        </div>

        {/* Fix this first */}
        <div className="mt-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground">
            Fix this first
          </p>
          <div className="mt-2 space-y-1.5">
            {fixItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <IconCheck size={14} className="shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="/sample-aeo-report"
          onClick={() => trackConversionEvent(trackingEvent)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition hover:opacity-90 active:scale-[0.98]"
        >
          See full sample report
          <IconArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

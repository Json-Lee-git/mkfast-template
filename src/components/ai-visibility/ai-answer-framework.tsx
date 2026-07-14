import {
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
    title: 'Access',
    desc: 'Can AI crawlers reach the page and required files?',
    icon: IconSearch,
    status: 'pass' as const,
  },
  {
    number: '02',
    title: 'Parse',
    desc: 'Can the page structure be understood cleanly?',
    icon: IconCode,
    status: 'pass' as const,
  },
  {
    number: '03',
    title: 'Extract',
    desc: 'Is the answer and evidence easy to pull out?',
    icon: IconMessageCircle,
    status: 'warn' as const,
  },
  {
    number: '04',
    title: 'Verify',
    desc: 'Are entity, schema, and references consistent?',
    icon: IconShieldCheck,
    status: 'warn' as const,
  },
  {
    number: '05',
    title: 'Prioritize',
    desc: 'Which fixes matter first for AI visibility?',
    icon: IconSparkles,
    status: 'fail' as const,
  },
];

type AIAnswerFrameworkProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AIAnswerFramework({
  className,
  eyebrow = 'How the audit works',
  title = 'Five layers, one fix order',
  description = 'The audit checks each controllable signal layer and ranks fixes by impact. Earlier layers make later ones easier.',
}: AIAnswerFrameworkProps) {
  return (
    <div className={cn('mx-auto max-w-6xl', className)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-5">
        {readinessLayers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div
              key={layer.title}
              className={cn(
                'rounded-lg border border-border bg-card p-4',
                layer.status === 'pass'
                  ? 'signal-pass'
                  : layer.status === 'warn'
                    ? 'signal-warn'
                    : 'signal-fail'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {layer.number}
                </span>
                <Icon
                  size={18}
                  strokeWidth={1.7}
                  className="text-muted-foreground"
                />
              </div>
              <h3 className="mt-2 font-display text-sm font-semibold text-foreground">
                {layer.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {layer.desc}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
        Each layer is a controllable signal. Fixing earlier layers makes later
        ones easier to read, extract, and verify.
      </p>
    </div>
  );
}

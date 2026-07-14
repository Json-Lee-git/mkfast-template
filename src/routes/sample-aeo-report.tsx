import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  jsonLd,
  softwareApplicationSchema,
} from '@/lib/ai-visibility-schema';
import { trackConversionEvent } from '@/lib/conversion-events';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconCircleCheck,
  IconExclamationCircle,
  IconFileAnalytics,
  IconSparkles,
} from '@tabler/icons-react';

// ---------- Report data ----------

const scannedUrl = 'example.com/pricing';

const reportMeta = {
  url: scannedUrl,
  score: 64,
  status: 'Needs structured repair',
  scanType: 'Single page audit',
};

const moduleScores = [
  { label: 'Crawlability', score: 92, status: 'pass' },
  { label: 'Schema', score: 41, status: 'fail' },
  { label: 'Answer blocks', score: 46, status: 'fail' },
  { label: 'Entity clarity', score: 58, status: 'warn' },
  { label: 'Trust signals', score: 63, status: 'warn' },
  { label: 'AI crawler access', score: 85, status: 'pass' },
];

const priorityFixes = [
  {
    priority: 'P1',
    title: 'Add answer-ready summary near the top',
    impact: 'High',
    why: 'AI answer engines extract the first clear definition or summary they find. Without one, they fall back to vague page-level signals.',
    fix: 'Place a 30-50 word answer block in the first 200 words of the page that directly answers "what does this page offer and who is it for."',
  },
  {
    priority: 'P1',
    title: 'Expose pricing facts in structured blocks',
    impact: 'High',
    why: 'When AI systems answer pricing questions, they prefer pages with clear, extractable price points rather than text buried in paragraphs.',
    fix: 'Add a pricing summary using a short definition list or table: plan name, price, period, and one-line description.',
  },
  {
    priority: 'P2',
    title: 'Add Organization and Product JSON-LD schema',
    impact: 'Medium',
    why: 'Structured data helps answer engines associate the page with a known entity and product category, improving entity confidence.',
    fix: 'Include Organization schema with sameAs links and Product schema with name, description, and offers on the pricing page.',
  },
  {
    priority: 'P2',
    title: 'Clarify entity relationships',
    impact: 'Medium',
    why: 'Pages with consistent brand, author, and publisher signals are easier for AI systems to attribute correctly.',
    fix: 'Align og:site_name, Organization schema name, page title brand suffix, and visible footer brand to the same canonical entity name.',
  },
  {
    priority: 'P3',
    title: 'Improve trust evidence',
    impact: 'Lower',
    why: 'External references, methodology notes, and dated publication info help AI systems assess content authority.',
    fix: 'Add a short methodology note, link to external standards where relevant, and ensure published and modified dates are present.',
  },
];

const signalRows = [
  {
    signal: 'Robots.txt reachable',
    status: 'pass',
    evidence: 'Returned 200, Content-Type text/plain',
    action: 'No action needed',
  },
  {
    signal: 'Sitemap discovered',
    status: 'pass',
    evidence: 'Found via robots.txt reference',
    action: 'No action needed',
  },
  {
    signal: 'LLMs.txt present',
    status: 'fail',
    evidence: 'No /llms.txt or /llms-full.txt found',
    action: 'Publish LLMs.txt with key page summaries',
  },
  {
    signal: 'LLMs-full.txt present',
    status: 'fail',
    evidence: 'No long-form /llms-full.txt file found',
    action: 'Publish LLMs-full.txt when detailed source coverage is useful',
  },
  {
    signal: 'GPTBot allowed',
    status: 'pass',
    evidence: 'Not blocked in robots.txt',
    action: 'No action needed',
  },
  {
    signal: 'JSON-LD schema',
    status: 'fail',
    evidence: 'No JSON-LD detected on page',
    action: 'Add Organization and WebSite schema as minimum',
  },
  {
    signal: 'FAQPage schema',
    status: 'fail',
    evidence: 'No FAQPage JSON-LD found',
    action: 'Add FAQPage schema for question-answer pairs',
  },
  {
    signal: 'H1-H3 hierarchy',
    status: 'warn',
    evidence: 'H1 present, H2 missing on key sections',
    action: 'Add H2 headings for each major content section',
  },
  {
    signal: 'Answer blocks',
    status: 'fail',
    evidence: 'No definition or summary block in first 200 words',
    action: 'Add a 30-50 word answer block near top of page',
  },
  {
    signal: 'Brand consistency',
    status: 'warn',
    evidence: 'og:site_name differs from visible brand',
    action: 'Align og:site_name, schema name, and title suffix',
  },
  {
    signal: 'Author attribution',
    status: 'fail',
    evidence: 'No author or publisher metadata found',
    action: 'Add Organization schema author and published date',
  },
  {
    signal: 'Privacy / About links',
    status: 'warn',
    evidence: 'About page found, privacy link missing',
    action: 'Add privacy policy link to footer and schema',
  },
  {
    signal: 'Canonical URL',
    status: 'pass',
    evidence: 'Canonical matches page URL, no conflicts',
    action: 'No action needed',
  },
];

const aiSimulation = {
  current:
    'This appears to be a SaaS pricing page. It lists product features and some plan details, but the main value proposition is spread across several paragraphs. The business likely offers a software tool, though the exact use case is not immediately clear from the page structure alone.',
  improved:
    'This page describes a page-level AI search readiness audit tool. It checks crawlability, structured data, answer-ready content, entity clarity, trust signals, and AI crawler access. Pricing starts with a free single-page scan, a $19 Fix Pack with copy-ready schema and content blocks, a $29/mo Monitor path for important pages, and a $99 manual audit option.',
};

const competitorContext = [
  'Competitor A: appears stronger on trust signals',
  'Competitor B: has clearer product/category pages',
  'Your gap: missing answer-ready comparison content',
];

const fixPackItems = [
  'Executive summary',
  'AI Visibility Score breakdown',
  'Fix this first order with impact levels',
  'Copy-ready JSON-LD schema snippets',
  'Answer-ready content blocks',
  'LLMs.txt and LLMs-full.txt plan',
  'Competitor visibility gaps',
  'Query coverage gaps',
  'Entity and trust signal review',
  'Downloadable implementation handoff',
];

const sampleFaqItems = [
  {
    q: 'What do I get after paying $19?',
    a: 'You get an AI Visibility Fix Pack with a prioritized repair order, copy-ready JSON-LD, answer-ready content blocks, AI file recommendations, competitor context, query coverage gaps, and a downloadable implementation handoff.',
  },
  {
    q: 'Is the report useful if I am not technical?',
    a: 'Yes. The report separates business-readable priorities from developer-ready snippets, so a founder can understand what matters and a developer or SEO operator can implement the fixes.',
  },
  {
    q: 'Does the report guarantee AI citations?',
    a: 'No. We do not guarantee citations. We help you catch the technical and content signals that make AI answers more likely to understand, extract, and trust your page.',
  },
];

// ---------- Helpers ----------

const statusDefs: Record<
  string,
  { icon: typeof IconCircleCheck; label: string; cls: string }
> = {
  pass: {
    icon: IconCircleCheck,
    label: 'Pass',
    cls: 'text-emerald-400',
  },
  warn: {
    icon: IconExclamationCircle,
    label: 'Needs work',
    cls: 'text-amber-400',
  },
  fail: {
    icon: IconAlertTriangle,
    label: 'Missing',
    cls: 'text-red-400',
  },
};

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function priorityBadge(p: string) {
  if (p === 'P1') return 'bg-red-500/15 text-red-300 border-red-500/30';
  if (p === 'P2') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
  return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
}

// ---------- Shared styles ----------

const sectionLabel =
  'text-[11px] font-semibold uppercase tracking-widest text-zinc-500';
const panel = 'rounded-xl border border-zinc-800 bg-zinc-900';

// ---------- Page component ----------

function SampleAeoReportPage() {
  const passCount = signalRows.filter((r) => r.status === 'pass').length;
  const warnCount = signalRows.filter((r) => r.status === 'warn').length;
  const failCount = signalRows.filter((r) => r.status === 'fail').length;

  const modulePass = moduleScores.filter((m) => m.status === 'pass').length;
  const moduleWarn = moduleScores.filter((m) => m.status === 'warn').length;
  const moduleFail = moduleScores.filter((m) => m.status === 'fail').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ========== 1. Hero: Audit Report Header ========== */}
      <section className="bg-zinc-950 py-12 lg:py-18">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Top label row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-300">
                <IconFileAnalytics size={13} />
                AI Visibility Audit
              </span>
              <span className="h-3 w-px bg-zinc-700" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Sample Report
              </span>
            </div>

            {/* URL + meta */}
            <div className="mt-5">
              <p className="font-mono text-lg text-zinc-100 sm:text-xl">
                {scannedUrl}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {reportMeta.scanType} - Static sample, not a real scan
              </p>
            </div>

            {/* Score row */}
            <div className="mt-8 flex flex-wrap items-start gap-x-10 gap-y-6">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  AI Visibility Score
                </p>
                <div className="flex items-end gap-1.5">
                  <span
                    className={`text-6xl font-bold tracking-tight ${scoreColor(reportMeta.score)}`}
                  >
                    {reportMeta.score}
                  </span>
                  <span className="pb-1.5 text-xl text-zinc-600">/100</span>
                </div>
              </div>
              <div className="min-w-[200px] flex-1">
                <p className="text-sm font-semibold text-zinc-200">
                  {reportMeta.status}
                </p>
                <div className="mt-2.5 h-2 w-full max-w-xs rounded-full bg-zinc-800">
                  <div
                    className={`h-2 rounded-full ${scoreBg(reportMeta.score)}`}
                    style={{ width: `${reportMeta.score}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-zinc-500">
                    {moduleScores.length} modules scored
                  </span>
                  {modulePass > 0 && (
                    <span className="text-emerald-400">{modulePass} pass</span>
                  )}
                  {moduleWarn > 0 && (
                    <span className="text-amber-400">{moduleWarn} warn</span>
                  )}
                  {moduleFail > 0 && (
                    <span className="text-red-400">{moduleFail} fail</span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/tools/aeo-checker"
                onClick={() =>
                  trackConversionEvent('sample_report_run_audit_clicked')
                }
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 active:scale-[0.98]"
              >
                Audit your page <IconArrowRight size={16} />
              </a>
              <a
                href="/methodology"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 active:scale-[0.98]"
              >
                View methodology
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ========== Report Body ========== */}
      <section className="pb-16">
        <Container>
          <div className="mx-auto max-w-4xl space-y-5">
            {/* ---- 2. Visibility Blockers ---- */}
            <div className={`${panel} p-5 sm:p-6`}>
              <h2 className={sectionLabel}>Visibility blockers</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {moduleScores.map((mod) => {
                  const s = statusDefs[mod.status];
                  const StatusIcon = s.icon;
                  return (
                    <div
                      key={mod.label}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {mod.label}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <StatusIcon size={13} className={s.cls} />
                          <span className={`text-xs ${s.cls}`}>{s.label}</span>
                        </div>
                      </div>
                      <span
                        className={`text-lg font-bold ${scoreColor(mod.score)}`}
                      >
                        {mod.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---- 3. Fix This First ---- */}
            <div className={`${panel} overflow-hidden`}>
              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 className={sectionLabel}>Fix this first</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Ranked by impact on AI recommendation readiness for{' '}
                  <span className="font-mono text-zinc-300">{scannedUrl}</span>.
                </p>
              </div>

              {/* Desktop table */}
              <div className="mt-4 hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-y border-zinc-800 bg-zinc-950/60">
                      <th className="w-[48px] py-3 pl-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        #
                      </th>
                      <th className="w-[52px] py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Pri
                      </th>
                      <th className="py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Issue
                      </th>
                      <th className="w-[72px] py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Impact
                      </th>
                      <th className="py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Diagnosis
                      </th>
                      <th className="py-3 pr-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Repair Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {priorityFixes.map((item, idx) => (
                      <tr key={item.title} className="bg-zinc-950/40">
                        <td className="py-3 pl-5 text-xs text-zinc-500">
                          {idx + 1}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold ${priorityBadge(item.priority)}`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-sm font-medium text-zinc-100">
                          {item.title}
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-medium text-zinc-400">
                            {item.impact}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs leading-relaxed text-zinc-400">
                          {item.why}
                        </td>
                        <td className="py-3 pr-5 text-xs leading-relaxed text-zinc-400">
                          {item.fix}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-4 space-y-3 px-5 pb-5 sm:px-6 sm:pb-6 md:hidden">
                {priorityFixes.map((item, idx) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-zinc-500">
                        #{idx + 1}
                      </span>
                      <span
                        className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold ${priorityBadge(item.priority)}`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        {item.impact} impact
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-zinc-100">
                      {item.title}
                    </h3>
                    <div className="mt-3 space-y-2.5">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Diagnosis
                        </span>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                          {item.why}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                          Repair Action
                        </span>
                        <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                          {item.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---- 4. AI Answer Simulation ---- */}
            <div className={`${panel} p-5 sm:p-6`}>
              <h2 className={sectionLabel}>AI Answer Simulation</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Illustrative examples of how an AI system might describe{' '}
                <span className="font-mono text-zinc-300">{scannedUrl}</span>{' '}
                today vs. after the recommended fixes.
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex items-center gap-2">
                    <IconBrain size={16} className="text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-200">
                      How AI may describe this page today
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {aiSimulation.current}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5">
                  <div className="flex items-center gap-2">
                    <IconSparkles size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-semibold text-zinc-200">
                      What the page should make explicit
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {aiSimulation.improved}
                  </p>
                </div>
              </div>
            </div>

            {/* ---- 5. Competitor Context ---- */}
            <div className={`${panel} p-5 sm:p-6`}>
              <h2 className={sectionLabel}>Competitor context</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {competitorContext.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <p className="text-sm leading-6 text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-zinc-500">
                This sample uses static competitor context. Live competitor
                prompt tracking is not included in the free checker.
              </p>
            </div>

            {/* ---- 6. Diagnostic Evidence ---- */}
            <div className={`${panel} overflow-hidden`}>
              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className={sectionLabel}>Diagnostic evidence</h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      This is a sample scan of{' '}
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
                        {scannedUrl}
                      </span>
                      . Each sample signal is shown with evidence and a
                      recommended action. A real audit runs the same checks
                      against your actual URL.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">
                    {signalRows.length} signals checked
                  </span>
                </div>
              </div>

              {/* Desktop table */}
              <div className="mt-4 hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-y border-zinc-800 bg-zinc-950/60">
                      <th className="py-3 pl-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Signal
                      </th>
                      <th className="w-[130px] py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Status
                      </th>
                      <th className="py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Evidence
                      </th>
                      <th className="py-3 pr-5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {signalRows.map((row) => {
                      const s = statusDefs[row.status];
                      const StatusIcon = s.icon;
                      return (
                        <tr key={row.signal} className="bg-zinc-950/40">
                          <td className="py-3 pl-5 text-sm font-medium text-zinc-200">
                            {row.signal}
                          </td>
                          <td className="py-3">
                            <span className="inline-flex items-center gap-1.5">
                              <StatusIcon size={14} className={s.cls} />
                              <span className={`text-xs font-medium ${s.cls}`}>
                                {s.label}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 pr-4 font-mono text-xs text-zinc-400">
                            {row.evidence}
                          </td>
                          <td className="py-3 pr-5 text-xs text-zinc-400">
                            {row.action}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mt-4 space-y-2.5 px-5 pb-5 sm:px-6 sm:pb-6 md:hidden">
                {signalRows.map((row) => {
                  const s = statusDefs[row.status];
                  const StatusIcon = s.icon;
                  return (
                    <div
                      key={row.signal}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-zinc-200">
                          {row.signal}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-1">
                          <StatusIcon size={13} className={s.cls} />
                          <span className={`text-xs font-medium ${s.cls}`}>
                            {s.label}
                          </span>
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        <div>
                          <span className="font-semibold text-zinc-500">
                            Evidence:{' '}
                          </span>
                          <span className="font-mono text-zinc-400">
                            {row.evidence}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-zinc-500">
                            Recommendation:{' '}
                          </span>
                          <span className="text-zinc-400">{row.action}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary footer */}
              <div className="border-t border-zinc-800 bg-zinc-950/60 px-5 py-3 sm:px-6">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                  <span className="text-zinc-500">Summary:</span>
                  <span className="text-emerald-400">{passCount} pass</span>
                  <span className="text-amber-400">{warnCount} warn</span>
                  <span className="text-red-400">{failCount} fail</span>
                </div>
              </div>
            </div>

            {/* ---- 7. Fix Pack Contents ---- */}
            <div className={`${panel} p-5 sm:p-6`}>
              <h2 className={sectionLabel}>Copy-ready implementation plan</h2>
              <p className="mt-1 text-xs text-zinc-500">
                The $19 AI Visibility Fix Pack ships with diagnosis, copy-ready
                assets, and an implementation handoff.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {fixPackItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
                  >
                    <IconCheck
                      size={14}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span className="text-xs text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <h3 className="text-sm font-semibold text-emerald-200">
                  After the Fix Pack
                </h3>
                <p className="mt-2 text-xs leading-5 text-emerald-100/80">
                  After these fixes are published, monitor this URL for silent
                  regressions in crawler access, schema, LLMs.txt, and
                  answer-ready content.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ========== 7. CTA Band ========== */}
      <section className="border-t border-zinc-800 bg-zinc-950 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-zinc-100">
              Run this audit on your own page
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              Free single-page scan. No sign-up required. See your AI Visibility
              Score, gaps, and fix priorities before paying anything.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/tools/aeo-checker"
                onClick={() =>
                  trackConversionEvent('sample_report_bottom_cta_clicked')
                }
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 active:scale-[0.98]"
              >
                Run free scan <IconArrowRight size={16} />
              </a>
              <a
                href={`/pricing?intent=monitor&url=${encodeURIComponent(
                  scannedUrl
                )}`}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 active:scale-[0.98]"
              >
                Monitor this URL
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              We do not guarantee citations. We help you catch the technical and
              content signals that make AI answers more likely to understand,
              extract, and trust your page.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-4" />
    </div>
  );
}

// ---------- FAQ section (separate for reuse) ----------

const includedSectionsForSchema = [
  'Executive summary',
  'AI Visibility Score',
  'Visibility blockers',
  'Fix this first',
  'Competitor visibility gaps',
  'Diagnostic evidence',
  'Copy-ready JSON-LD schema',
  'Answer-ready content blocks',
  'Entity and trust signal review',
  'Query coverage gaps',
  'Copy-ready LLMs.txt files',
  'Downloadable implementation handoff',
];

// ---------- Route ----------

export const Route = createFileRoute('/sample-aeo-report')({
  head: () => ({
    ...seo('/sample-aeo-report', {
      title: 'Sample AI Visibility Report - $19 Fix Pack Preview',
      description:
        'Preview the $19 AI Visibility Fix Pack with an AI Visibility Score, visibility blockers, competitor context, copy-ready schema, answer-ready content blocks, query coverage gaps, and fix-first order.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'AI Visibility Fix Pack',
          websiteUrl: getCanonicalUrl('/sample-aeo-report'),
          longDescription:
            'A paid AI visibility fix pack with a readiness-based visibility score, visibility blockers, competitor context, query coverage gaps, copy-ready implementation assets, and AI-readable file recommendations.',
          startingPrice: '$19',
          keyFeatures: includedSectionsForSchema,
        })
      ),
      jsonLd(faqSchema(sampleFaqItems)),
      jsonLd(
        itemListSchema('/sample-aeo-report', [
          {
            name: 'Run AEO Checker',
            url: getCanonicalUrl('/tools/aeo-checker'),
          },
          {
            name: 'GEO Audit Tool',
            url: getCanonicalUrl('/tools/geo-audit'),
          },
          {
            name: 'AI Overview Readiness Checker',
            url: getCanonicalUrl('/tools/ai-overview-readiness-checker'),
          },
        ])
      ),
      jsonLd(
        breadcrumbSchema([
          { name: 'Home', url: getCanonicalUrl('/') },
          {
            name: 'Sample AI Visibility Report',
            url: getCanonicalUrl('/sample-aeo-report'),
          },
        ])
      ),
    ],
  }),
  component: SampleAeoReportPage,
});

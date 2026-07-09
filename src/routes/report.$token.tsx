import { createFileRoute } from '@tanstack/react-router';
import { seo } from '@/lib/seo';
import {
  getReportByToken,
  type ReportData,
} from '@/api/ai-readiness/report-checkout';
import Container from '@/components/layout/container';
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconLoader2,
  IconDownload,
  IconPrinter,
  IconCopy,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

// ---------- Shared helpers (mirror aeo-checker) ----------

type Status = 'good' | 'warning' | 'issue' | 'neutral';

function statusBadge(status: Status) {
  const map: Record<Status, { bg: string; text: string }> = {
    good: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
    },
    issue: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
    },
    neutral: {
      bg: 'bg-gray-100 dark:bg-zinc-800',
      text: 'text-gray-600 dark:text-zinc-400',
    },
  };
  return map[status];
}

function accessBadge(access: string) {
  switch (access) {
    case 'allowed':
      return {
        label: 'Allowed',
        cls: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'blocked':
      return { label: 'Blocked', cls: 'text-red-600 dark:text-red-400' };
    default:
      return { label: 'Unknown', cls: 'text-gray-400 dark:text-zinc-500' };
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

function scoreLabelText(score: number): string {
  if (score >= 80) return 'Strong technical AEO readiness';
  if (score >= 60) return 'Good foundation with improvement opportunities';
  if (score >= 40) return 'Partial readiness, several important gaps';
  return 'Weak technical AEO readiness';
}

function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No';
}

// ---------- Component ----------

function ReportPage() {
  const { token } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const poll = async () => {
      try {
        const data = await getReportByToken({ data: { token } });
        if (cancelled) return;
        setReport(data);
        if (data?.status === 'active') {
          setLoading(false);
          clearInterval(timer);
        } else if (data) {
          // payment pending - keep polling
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load report.');
          setLoading(false);
          clearInterval(timer);
        }
      }
    };

    // Initial fetch
    poll();

    timer = setInterval(() => {
      if (cancelled) return;
      setElapsed((prev) => {
        // Stop polling after 2 minutes
        if (prev >= 120) {
          clearInterval(timer);
          return prev;
        }
        return prev + 2;
      });
      poll();
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [token]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <IconLoader2
            size={48}
            className="mx-auto animate-spin text-blue-500"
          />
          <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
            Loading report...
          </p>
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-8 text-center">
          <IconX size={40} className="mx-auto text-red-400" />
          <p className="mt-4 text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // ---------- Not found ----------
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 text-center">
          <IconAlertTriangle size={40} className="mx-auto text-amber-400" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Report not found
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            This report link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Pending ----------
  if (report.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-8 text-center">
          <IconLoader2
            size={40}
            className="mx-auto text-amber-400 animate-spin"
          />
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Confirming payment
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Your report for{' '}
            <span className="font-medium text-gray-700 dark:text-zinc-300">
              {report.websiteUrl}
            </span>{' '}
            is being processed. This should only take a few seconds.
          </p>
          {elapsed > 10 && (
            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              Still waiting... don't worry, your payment is safe. The report
              will appear here automatically.
            </p>
          )}
          {elapsed >= 120 && (
            <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
              Taking longer than expected.{' '}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Refresh page
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---------- Active report ----------
  const r = report.result!;
  const hostname = new URL(r.normalizedUrl).hostname;
  const fixPackContents = [
    'Score summary',
    'Priority repair order',
    'Crawlability review',
    'AI crawler access review',
    'LLMs.txt and LLMs-full.txt plan',
    'Schema and entity clarity checks',
    'Answer-ready content suggestions',
    'Trust signals review',
    'Evidence log',
  ];
  const evidenceRows = [
    {
      label: 'Crawlability',
      value: r.page.statusCode ? `HTTP ${r.page.statusCode}` : 'Unknown',
    },
    {
      label: 'AI crawler access',
      value: r.aiFiles.robotsTxt.exists
        ? `${r.aiFiles.robotsTxt.crawlers.length} user agents checked`
        : 'Robots.txt not found',
    },
    {
      label: 'LLMs.txt / LLMs-full.txt',
      value: `${r.aiFiles.llmsTxt.exists ? 'LLMs.txt found' : 'LLMs.txt missing'}, ${
        r.aiFiles.llmsFullTxt.exists
          ? 'LLMs-full.txt found'
          : 'LLMs-full.txt missing'
      }`,
    },
    {
      label: 'Schema / entity clarity',
      value:
        r.structuredData.schemaTypes.length > 0
          ? r.structuredData.schemaTypes.join(', ')
          : 'No JSON-LD schema detected',
    },
    {
      label: 'Answer-ready content',
      value: r.answerReadyContent.hasShortAnswerParagraphs
        ? 'Short answer paragraphs found'
        : 'Short answer paragraphs need work',
    },
    {
      label: 'Trust signals',
      value: r.trustSignals.hasContactLink
        ? 'Contact signal found'
        : 'Contact signal missing',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const lines = buildFullReportMarkdown(r);
    const blob = new Blob([lines], {
      type: 'text/markdown;charset=utf-8',
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `ai-search-readiness-fix-pack-${hostname}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  };

  const handleCopyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(null), 2000);
    } catch {
      setCopiedLabel('Unable to copy');
    }
  };

  return (
    <div className="min-h-screen print:bg-white print:text-black">
      {/* Header */}
      <section className="border-b border-gray-200 dark:border-zinc-800/50 print:hidden">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                AI Search Readiness Fix Pack
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                {hostname}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600"
              >
                <IconPrinter size={16} />
                Print
              </button>
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                <IconDownload size={16} />
                Download
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Print-only title */}
      <div className="hidden print:block p-8">
        <h1 className="text-2xl font-bold">
          AI Search Readiness Fix Pack - {hostname}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generated {new Date(r.checkedAt).toLocaleDateString()} | Score:{' '}
          {r.score}/100
        </p>
      </div>

      <Container className="py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Score */}
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
              Technical AEO Score
            </p>
            <p className={`mt-2 text-6xl font-bold ${scoreColor(r.score)}`}>
              {r.score}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              {scoreLabelText(r.score)}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 mb-4">
              Score breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <ScoreBadge
                label="Crawlability"
                status={
                  !r.page.issues.length
                    ? 'good'
                    : r.page.issues.length <= 2
                      ? 'warning'
                      : 'issue'
                }
              />
              <ScoreBadge
                label="AI Files & Crawlers"
                status={r.aiFiles.llmsTxt.exists ? 'good' : 'warning'}
              />
              <ScoreBadge
                label="Structured Data"
                status={r.structuredData.hasJsonLd ? 'good' : 'issue'}
              />
              <ScoreBadge
                label="Content"
                status={r.answerReadyContent.hasFaqSection ? 'good' : 'warning'}
              />
              <ScoreBadge
                label="Entity Clarity"
                status={
                  r.entityClarity.hasOrganizationSchema ? 'good' : 'warning'
                }
              />
              <ScoreBadge
                label="Trust Signals"
                status={
                  r.trustSignals.hasAuthor
                    ? 'good'
                    : r.trustSignals.hasContactLink
                      ? 'warning'
                      : 'issue'
                }
              />
            </div>
          </div>

          <Card title="Fix Pack Contents" status="neutral">
            <div className="grid gap-2 sm:grid-cols-2">
              {fixPackContents.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <IconCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <span className="text-gray-700 dark:text-zinc-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Analysis - the core value of the paid report */}
          {r.aiAnalysis && (
            <>
              <Card title="Analysis" status="neutral">
                <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                  {r.aiAnalysis.summary}
                </p>
                {r.aiAnalysis.strengths.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {r.aiAnalysis.strengths.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-zinc-400"
                      >
                        <IconCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {r.aiAnalysis.quickWins.length > 0 && (
                <Card title="Quick Wins" status="good">
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">
                    These can be done in under 15 minutes:
                  </p>
                  <ul className="space-y-2">
                    {r.aiAnalysis.quickWins.map((w) => (
                      <li
                        key={w}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-zinc-300"
                      >
                        <IconCheck
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-500"
                        />
                        {w}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {r.aiAnalysis.actionPlan.length > 0 && (
                <Card title="Do These 3 Things First" status="warning">
                  <div className="space-y-3">
                    {r.aiAnalysis.actionPlan.slice(0, 3).map((a, i) => (
                      <div
                        key={a.title}
                        className="rounded-xl border border-blue-200 bg-white p-4 dark:border-blue-900/40 dark:bg-zinc-900/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {i + 1}
                          </span>
                          <h4 className="font-semibold text-gray-800 dark:text-zinc-200">
                            {a.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                          {a.whatToDo}
                        </p>
                        <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                          Impact: {a.why} Effort: {a.effort}.
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {r.aiAnalysis.actionPlan.length > 0 && (
                <Card title="Your Action Plan" status="neutral">
                  <div className="space-y-4">
                    {r.aiAnalysis.actionPlan.map((a, i) => {
                      const colors: Record<string, string> = {
                        critical:
                          'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20',
                        high: 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20',
                        medium:
                          'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20',
                        low: 'border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/30',
                      };
                      const badges: Record<string, string> = {
                        critical:
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                        high: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
                        medium:
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                        low: 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400',
                      };
                      return (
                        <div
                          key={a.title}
                          className={`rounded-xl border p-4 ${colors[a.priority] || colors.medium}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-xs font-semibold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
                              {i + 1}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${badges[a.priority] || badges.medium}`}
                            >
                              {a.priority}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-zinc-500">
                              {a.effort}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-800 dark:text-zinc-200">
                            {a.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                            {a.whatToDo}
                          </p>
                          <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500 italic">
                            Why: {a.why}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </>
          )}

          {/* Crawlability */}
          <Card title="Technical Crawlability" status="good">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="Status"
                value={r.page.statusCode ? `HTTP ${r.page.statusCode}` : 'N/A'}
              />
              <Meta label="Content Type" value={r.page.contentType || 'N/A'} />
              <Meta label="Title" value={r.page.title || 'N/A'} />
              <Meta
                label="Meta Description"
                value={r.page.metaDescription || 'N/A'}
              />
              <Meta label="Canonical" value={r.page.canonical || 'N/A'} />
              <Meta label="Meta Robots" value={r.page.metaRobots || 'N/A'} />
            </div>
            {r.page.issues.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.page.issues.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconX size={14} className="mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {r.page.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                {r.page.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <IconAlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* AI Files */}
          <Card
            title="AI Search Files & Crawler Access"
            status={r.aiFiles.llmsTxt.exists ? 'good' : 'issue'}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="LLMs.txt"
                value={
                  r.aiFiles.llmsTxt.exists
                    ? `Found (${r.aiFiles.llmsTxt.statusCode})`
                    : 'Not Found'
                }
              />
              <Meta
                label="LLMs-full.txt"
                value={
                  r.aiFiles.llmsFullTxt.exists
                    ? `Found (${r.aiFiles.llmsFullTxt.statusCode})`
                    : 'Not Found'
                }
              />
              <Meta
                label="Sitemap"
                value={
                  r.aiFiles.sitemap.exists
                    ? `Found (${r.aiFiles.sitemap.statusCode})`
                    : 'Not Found'
                }
              />
              <Meta
                label="Robots.txt"
                value={
                  r.aiFiles.robotsTxt.exists
                    ? `Found (${r.aiFiles.robotsTxt.statusCode})`
                    : 'Not Found'
                }
              />
            </div>
            {r.aiFiles.robotsTxt.exists && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-zinc-800">
                      <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                        Crawler
                      </th>
                      <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                        User Agent
                      </th>
                      <th className="py-2 text-right font-medium text-gray-500 dark:text-zinc-400">
                        Access
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.aiFiles.robotsTxt.crawlers.map((c) => {
                      const b = accessBadge(c.access);
                      return (
                        <tr
                          key={c.userAgent}
                          className="border-b border-gray-100 dark:border-zinc-800/50"
                        >
                          <td className="py-2.5 text-gray-700 dark:text-zinc-300">
                            {c.name}
                          </td>
                          <td className="py-2.5 font-mono text-xs text-gray-400 dark:text-zinc-500">
                            {c.userAgent}
                          </td>
                          <td
                            className={`py-2.5 text-right font-medium ${b.cls}`}
                          >
                            {b.label}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Structured Data */}
          <Card
            title="Structured Data"
            status={r.structuredData.hasJsonLd ? 'good' : 'issue'}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="JSON-LD"
                value={r.structuredData.hasJsonLd ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Schema Types"
                value={
                  r.structuredData.schemaTypes.length > 0
                    ? r.structuredData.schemaTypes.join(', ')
                    : 'None'
                }
              />
            </div>
            {r.structuredData.parseErrors.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.structuredData.parseErrors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
            {r.structuredData.issues.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.structuredData.issues.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconX size={14} className="mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {r.structuredData.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                {r.structuredData.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <IconAlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Answer-ready Content */}
          <Card
            title="Answer-ready Content"
            status={r.answerReadyContent.hasFaqSection ? 'good' : 'warning'}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="H1 Count"
                value={String(r.answerReadyContent.h1Count)}
              />
              <Meta
                label="H2 Count"
                value={String(r.answerReadyContent.h2Count)}
              />
              <Meta
                label="H3 Count"
                value={String(r.answerReadyContent.h3Count)}
              />
              <Meta
                label="FAQ Section"
                value={
                  r.answerReadyContent.hasFaqSection ? 'Found' : 'Not Found'
                }
              />
              <Meta
                label="Question Headings"
                value={
                  r.answerReadyContent.hasQuestionHeadings
                    ? 'Found'
                    : 'Not Found'
                }
              />
              <Meta
                label="Lists"
                value={r.answerReadyContent.hasLists ? 'Present' : 'Not Found'}
              />
              <Meta
                label="Short Answer Paragraphs"
                value={
                  r.answerReadyContent.hasShortAnswerParagraphs
                    ? 'Present'
                    : 'Not Found'
                }
              />
            </div>
            {r.answerReadyContent.issues.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.answerReadyContent.issues.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconX size={14} className="mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {r.answerReadyContent.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                {r.answerReadyContent.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <IconAlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Entity Clarity */}
          <Card title="Entity Clarity" status="warning">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="Inferred Brand"
                value={r.entityClarity.inferredBrandName || 'N/A'}
              />
              <Meta
                label="og:site_name"
                value={r.entityClarity.hasOgSiteName ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Organization Schema"
                value={
                  r.entityClarity.hasOrganizationSchema ? 'Found' : 'Not Found'
                }
              />
              <Meta
                label="Brand Mentions"
                value={String(r.entityClarity.brandMentionCount ?? 0)}
              />
            </div>
            {r.entityClarity.issues.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.entityClarity.issues.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconX size={14} className="mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {r.entityClarity.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                {r.entityClarity.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <IconAlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Trust Signals */}
          <Card
            title="Trust Signals"
            status={r.trustSignals.hasAuthor ? 'good' : 'issue'}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="Author"
                value={r.trustSignals.hasAuthor ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Published Date"
                value={r.trustSignals.hasPublishedDate ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Modified Date"
                value={r.trustSignals.hasModifiedDate ? 'Found' : 'Not Found'}
              />
              <Meta
                label="About Link"
                value={r.trustSignals.hasAboutLink ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Contact Link"
                value={r.trustSignals.hasContactLink ? 'Found' : 'Not Found'}
              />
              <Meta
                label="Privacy Link"
                value={r.trustSignals.hasPrivacyLink ? 'Found' : 'Not Found'}
              />
              <Meta
                label="External Links"
                value={String(r.trustSignals.externalLinkCount)}
              />
            </div>
            {r.trustSignals.issues.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                {r.trustSignals.issues.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <IconX size={14} className="mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {r.trustSignals.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                {r.trustSignals.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <IconAlertTriangle
                      size={14}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />{' '}
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Evidence Log" status="neutral">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800">
                    <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                      Signal
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                      Evidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-gray-100 dark:border-zinc-800/50"
                    >
                      <td className="py-2.5 font-medium text-gray-700 dark:text-zinc-300">
                        {row.label}
                      </td>
                      <td className="py-2.5 text-gray-500 dark:text-zinc-400">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Prioritized Fixes (shown when AI analysis is unavailable) */}
          {!r.aiAnalysis && r.recommendations.length > 0 && (
            <Card title="Prioritized Fixes" status="neutral">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Address these items in order to improve your technical AEO
                  readiness score.
                </p>
                <ol className="space-y-3 text-sm">
                  {r.recommendations.map((rec, i) => (
                    <li
                      key={rec}
                      className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 dark:text-zinc-300 pt-0.5">
                        {rec}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          )}

          {/* Schema Recommendations */}
          <SchemaRecommendations
            aiSchemaJson={r.aiAnalysis?.customSchemaJson}
            copiedLabel={copiedLabel}
            onCopy={handleCopyText}
            existingTypes={r.structuredData.schemaTypes}
            pageTitle={r.page.title || ''}
            brandName={r.entityClarity.inferredBrandName || hostname}
            websiteUrl={r.normalizedUrl}
            metaDescription={r.page.metaDescription || ''}
            hasAuthor={r.trustSignals.hasAuthor}
            hasPublishedDate={r.trustSignals.hasPublishedDate}
            hasFaq={r.answerReadyContent.hasFaqSection}
            hasQuestionHeadings={r.answerReadyContent.hasQuestionHeadings}
          />

          {/* LLMs.txt Improvement Plan */}
          <Card
            title="LLMs.txt Improvement Plan"
            status={r.aiFiles.llmsTxt.exists ? 'good' : 'issue'}
          >
            {r.aiAnalysis?.customLlmsTxt ? (
              <div className="space-y-4 text-sm">
                <p className="text-gray-500 dark:text-zinc-400">
                  AI-generated /llms.txt tailored to your site:
                </p>
                <CopyableCodeBlock
                  code={r.aiAnalysis.customLlmsTxt}
                  copiedLabel={copiedLabel}
                  label="/llms.txt"
                  onCopy={handleCopyText}
                />
                {r.aiAnalysis.customLlmsFullTxt && (
                  <>
                    <p className="text-gray-500 dark:text-zinc-400 mt-4">
                      AI-generated /llms-full.txt:
                    </p>
                    <CopyableCodeBlock
                      code={r.aiAnalysis.customLlmsFullTxt}
                      copiedLabel={copiedLabel}
                      label="/llms-full.txt"
                      maxHeight
                      onCopy={handleCopyText}
                    />
                  </>
                )}
              </div>
            ) : (
              <LlmsTxtPlan
                copiedLabel={copiedLabel}
                hasLlmsTxt={r.aiFiles.llmsTxt.exists}
                hasLlmsFullTxt={r.aiFiles.llmsFullTxt.exists}
                websiteUrl={r.normalizedUrl}
                brandName={r.entityClarity.inferredBrandName || hostname}
                description={r.page.metaDescription || ''}
                onCopy={handleCopyText}
              />
            )}
          </Card>

          {/* Answer Content Suggestions */}
          <Card
            title="Answer-Ready Content Suggestions"
            status={r.answerReadyContent.hasFaqSection ? 'good' : 'warning'}
          >
            {r.aiAnalysis?.contentSuggestions.length ? (
              <ul className="space-y-3 text-sm">
                {r.aiAnalysis.contentSuggestions.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3"
                  >
                    <IconCheck
                      size={16}
                      className="mt-0.5 shrink-0 text-blue-500"
                    />
                    <span className="text-gray-700 dark:text-zinc-300">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            ) : r.aiAnalysis?.missingTopics?.length ? (
              <div className="space-y-3 text-sm">
                <p className="text-gray-500 dark:text-zinc-400">
                  Topics your page should cover to improve AI search coverage:
                </p>
                <ul className="space-y-2">
                  {r.aiAnalysis.missingTopics.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-3"
                    >
                      <IconAlertTriangle
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-500"
                      />
                      <span className="text-gray-700 dark:text-zinc-300">
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ContentSuggestions
                h1Count={r.answerReadyContent.h1Count}
                h2Count={r.answerReadyContent.h2Count}
                hasFaq={r.answerReadyContent.hasFaqSection}
                hasQuestions={r.answerReadyContent.hasQuestionHeadings}
                hasShortAnswers={r.answerReadyContent.hasShortAnswerParagraphs}
                hasLists={r.answerReadyContent.hasLists}
              />
            )}
          </Card>

          {/* Metadata */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Report for {r.normalizedUrl} | Generated{' '}
              {new Date(r.checkedAt).toLocaleString()} | Purchased{' '}
              {new Date(report.activatedAt!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Container>

      {/* Footer CTA */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12 print:hidden">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">
              Keep important pages from silently losing readiness
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              After these fixes are published, monitor this URL for silent
              regressions in crawler access, schema, LLMs.txt, and answer-ready
              content.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`/pricing?intent=monitor&url=${encodeURIComponent(
                  r.normalizedUrl
                )}`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Monitor this URL
              </a>
              <a
                href="/tools/aeo-checker"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Run a new scan
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ---------- Sub-components ----------

function ScoreBadge({ label, status }: { label: string; status: Status }) {
  const badge = statusBadge(status);
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${badge.bg}`}
    >
      {status === 'good' && (
        <IconCheck size={14} className="text-emerald-500 shrink-0" />
      )}
      {status === 'warning' && (
        <IconAlertTriangle size={14} className="text-amber-500 shrink-0" />
      )}
      {status === 'issue' && (
        <IconX size={14} className="text-red-500 shrink-0" />
      )}
      <span className={`text-xs font-medium ${badge.text}`}>{label}</span>
    </div>
  );
}

function Card({
  title,
  status = 'neutral',
  children,
}: {
  title: string;
  status?: Status;
  children: React.ReactNode;
}) {
  const badge = statusBadge(status);
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 print:border-gray-300 print:bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-zinc-200 print:text-black">
          {title}
        </h3>
        {status !== 'neutral' && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
          >
            {status === 'good' && <IconCheck size={12} />}
            {status === 'warning' && <IconAlertTriangle size={12} />}
            {status === 'issue' && <IconX size={12} />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400 dark:text-zinc-500">{label}</span>
      <p className="text-gray-700 dark:text-zinc-300 break-all">{value}</p>
    </div>
  );
}

function CopyableCodeBlock({
  code,
  copiedLabel,
  label,
  maxHeight = false,
  onCopy,
}: {
  code: string;
  copiedLabel: string | null;
  label: string;
  maxHeight?: boolean;
  onCopy: (label: string, text: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-zinc-700">
        <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onCopy(label, code)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          <IconCopy size={13} />
          {copiedLabel === label ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className={`overflow-x-auto p-4 text-xs text-gray-700 dark:text-zinc-300 ${maxHeight ? 'max-h-96 overflow-y-auto' : ''}`}
      >
        {code}
      </pre>
    </div>
  );
}

function LlmsTxtPlan({
  copiedLabel,
  hasLlmsTxt,
  hasLlmsFullTxt,
  websiteUrl,
  brandName,
  description,
  onCopy,
}: {
  copiedLabel: string | null;
  hasLlmsTxt: boolean;
  hasLlmsFullTxt: boolean;
  websiteUrl: string;
  brandName: string;
  description: string;
  onCopy: (label: string, text: string) => void;
}) {
  if (hasLlmsTxt && hasLlmsFullTxt) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Both LLMs.txt and LLMs-full.txt are present. Review them periodically to
        ensure they reflect your current site structure and key pages.
      </p>
    );
  }

  const llmsTxt = `# ${brandName}
> ${description || `${brandName} - ${websiteUrl}`}

## About
- [Home](${websiteUrl}): ${description || `${brandName} official website`}

## Getting Started
- The llms.txt file helps AI systems understand your site structure.
- Add links to your most important pages under ## Core Pages.
- Add links to documentation or guides under ## Documentation.`;

  const llmsFullTxt = `# ${brandName} - Full Content

> ${description || `${brandName}`}

## About
This file provides expanded content to help AI systems understand
your website's key information. Replace this template with actual
content from your most important pages.

Start by including your homepage content, product descriptions,
and key documentation pages.`;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-500 dark:text-zinc-400">
        {!hasLlmsTxt
          ? 'An LLMs.txt file gives AI systems a structured summary of your site. Add one at your site root.'
          : 'Your LLMs.txt exists. Consider adding an LLMs-full.txt for deeper content coverage.'}
      </p>

      {!hasLlmsTxt && (
        <div>
          <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
            Recommended LLMs.txt:
          </h4>
          <CopyableCodeBlock
            code={llmsTxt}
            copiedLabel={copiedLabel}
            label="/llms.txt template"
            onCopy={onCopy}
          />
        </div>
      )}

      {!hasLlmsFullTxt && (
        <div>
          <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
            Recommended LLMs-full.txt:
          </h4>
          <CopyableCodeBlock
            code={llmsFullTxt}
            copiedLabel={copiedLabel}
            label="/llms-full.txt template"
            onCopy={onCopy}
          />
        </div>
      )}
    </div>
  );
}

function ContentSuggestions({
  h1Count,
  h2Count,
  hasFaq,
  hasQuestions,
  hasShortAnswers,
  hasLists,
}: {
  h1Count: number;
  h2Count: number;
  hasFaq: boolean;
  hasQuestions: boolean;
  hasShortAnswers: boolean;
  hasLists: boolean;
}) {
  const items: string[] = [];

  if (h1Count !== 1) {
    items.push(
      h1Count === 0
        ? 'Add an H1 heading that clearly states the page topic.'
        : `You have ${h1Count} H1 headings. Use exactly one H1 per page to avoid confusing AI parsers.`
    );
  }

  if (h2Count < 2) {
    items.push(
      'Add at least 2-3 H2 section headings to create a clear content hierarchy. Each H2 should cover a distinct subtopic.'
    );
  }

  if (!hasFaq) {
    items.push(
      'Add an FAQ section with clear question/answer pairs. Use question-format headings (e.g. "What is X?") followed by 40-80 word answers.'
    );
  } else if (!hasQuestions) {
    items.push(
      'Your FAQ section exists but uses no question-format headings. Rewrite headings as questions (e.g. "How does X work?" instead of "X Overview").'
    );
  }

  if (!hasShortAnswers) {
    items.push(
      'Rewrite key explanatory paragraphs to 40-80 words. AI systems favor concise, self-contained answers over long discursive text.'
    );
  }

  if (!hasLists) {
    items.push(
      'Use bulleted or numbered lists for steps, features, or comparisons. Lists help AI extract structured information more easily.'
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Your content structure looks strong for AI readability. Keep pages
        updated and review periodically.
      </p>
    );
  }

  return (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3"
        >
          <IconCheck size={16} className="mt-0.5 shrink-0 text-blue-500" />
          <span className="text-gray-700 dark:text-zinc-300">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Schema Recommendations ----------

function SchemaRecommendations({
  aiSchemaJson,
  copiedLabel,
  existingTypes,
  pageTitle,
  brandName,
  websiteUrl,
  metaDescription,
  hasAuthor,
  hasPublishedDate,
  hasFaq,
  hasQuestionHeadings,
  onCopy,
}: {
  aiSchemaJson?: string;
  copiedLabel: string | null;
  existingTypes: string[];
  pageTitle: string;
  brandName: string;
  websiteUrl: string;
  metaDescription: string;
  hasAuthor: boolean;
  hasPublishedDate: boolean;
  hasFaq: boolean;
  hasQuestionHeadings: boolean;
  onCopy: (label: string, text: string) => void;
}) {
  if (aiSchemaJson) {
    return (
      <Card title="Schema Recommendations" status="neutral">
        <div className="space-y-4 text-sm">
          <p className="text-gray-500 dark:text-zinc-400">
            AI-generated schema markup tailored to your page:
          </p>
          <CopyableCodeBlock
            code={aiSchemaJson}
            copiedLabel={copiedLabel}
            label="JSON-LD schema"
            onCopy={onCopy}
          />
        </div>
      </Card>
    );
  }

  const titleLower = pageTitle.toLowerCase();
  const isTool =
    /\b(checker|generator|tool|audit|converter|calculator|analyzer|validator|scanner|tester)\b/i.test(
      titleLower
    );
  const isArticle = hasAuthor || hasPublishedDate;

  const schemas: { label: string; json: string }[] = [];

  // Always recommend Organization as the base
  schemas.push({
    label: 'Organization',
    json: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brandName,
        url: websiteUrl,
        sameAs: [],
      },
      null,
      2
    ),
  });

  if (isTool) {
    schemas.push({
      label: 'WebApplication',
      json: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: pageTitle,
          url: websiteUrl,
          description: metaDescription,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'All',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        null,
        2
      ),
    });
  }

  if (isArticle) {
    schemas.push({
      label: 'Article',
      json: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: pageTitle,
          url: websiteUrl,
          description: metaDescription,
          author: {
            '@type': 'Organization',
            name: brandName,
          },
          publisher: {
            '@type': 'Organization',
            name: brandName,
            url: websiteUrl,
          },
        },
        null,
        2
      ),
    });
  }

  if (hasFaq || hasQuestionHeadings) {
    schemas.push({
      label: 'FAQPage',
      json: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is this page about?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: metaDescription || `Learn more about ${brandName}.`,
              },
            },
          ],
        },
        null,
        2
      ),
    });
  }

  // Always add WebSite as the last base schema
  schemas.push({
    label: 'WebSite',
    json: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: brandName,
        url: websiteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${websiteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      null,
      2
    ),
  });

  return (
    <Card title="Schema Recommendations" status="neutral">
      <div className="space-y-4 text-sm">
        <p className="text-gray-500 dark:text-zinc-400">
          {existingTypes.length === 0
            ? 'No structured data detected. Adding JSON-LD schema helps AI systems understand your site.'
            : `Detected schema types: ${existingTypes.join(', ')}. Below are recommendations:`}
        </p>
        {schemas.map((s) => (
          <div key={s.label}>
            <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
              {s.label} schema
            </h4>
            <CopyableCodeBlock
              code={s.json}
              copiedLabel={copiedLabel}
              label={`${s.label} schema`}
              onCopy={onCopy}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------- Markdown export ----------

function buildFullReportMarkdown(r: NonNullable<ReportData['result']>): string {
  const ai = r.aiAnalysis;
  const lines = [
    '# AI Search Readiness Fix Pack',
    '',
    `Website: ${new URL(r.normalizedUrl).hostname}`,
    `Checked URL: ${r.normalizedUrl}`,
    `Generated: ${new Date(r.checkedAt).toISOString()}`,
    `Overall Score: ${r.score}/100 - ${scoreLabelText(r.score)}`,
    '',
    'This report improves the conditions for search engines and AI answer systems to crawl, understand, extract, and cite your content. It does not guarantee rankings, citations, traffic, or visibility in any specific search or AI product.',
    '',
  ];

  if (ai?.summary) {
    lines.push('## Executive Summary', '', ai.summary, '');
  }

  if (ai?.actionPlan?.length) {
    lines.push('## Do These 3 Things First', '');
    ai.actionPlan.slice(0, 3).forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.title}`,
        `   - Priority: ${item.priority}`,
        `   - Effort: ${item.effort}`,
        `   - What to do: ${item.whatToDo}`,
        `   - Why it matters: ${item.why}`,
        ''
      );
    });
  }

  if (ai?.strengths?.length) {
    lines.push('## Strengths', '');
    ai.strengths.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  if (ai?.quickWins?.length) {
    lines.push('## Quick Wins', '');
    ai.quickWins.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  if (ai?.actionPlan?.length) {
    lines.push('## Full Action Plan', '');
    ai.actionPlan.forEach((item, index) => {
      lines.push(
        `### ${index + 1}. ${item.title}`,
        '',
        `- Priority: ${item.priority}`,
        `- Effort: ${item.effort}`,
        `- What to do: ${item.whatToDo}`,
        `- Why it matters: ${item.why}`,
        ''
      );
    });
  }

  lines.push(
    '## Technical Crawlability',
    '',
    `- HTTP Status: ${r.page.statusCode || 'N/A'}`,
    `- Content Type: ${r.page.contentType || 'N/A'}`,
    `- Title: ${r.page.title || 'Missing'}`,
    `- Meta Description: ${r.page.metaDescription || 'Missing'}`,
    `- Canonical: ${r.page.canonical || 'Missing'}`,
    `- Meta Robots: ${r.page.metaRobots || 'Not detected'}`
  );

  if (r.page.issues.length > 0) {
    lines.push('', '### Issues', '');
    r.page.issues.forEach((i) => {
      lines.push(`- ${i}`);
    });
  }

  lines.push(
    '',
    '## AI Search Files & Crawler Access',
    '',
    `- LLMs.txt: ${r.aiFiles.llmsTxt.exists ? `Found (${r.aiFiles.llmsTxt.statusCode})` : 'Not Found'}`,
    `- LLMs-full.txt: ${r.aiFiles.llmsFullTxt.exists ? `Found (${r.aiFiles.llmsFullTxt.statusCode})` : 'Not Found'}`,
    `- Sitemap: ${r.aiFiles.sitemap.exists ? `Found (${r.aiFiles.sitemap.statusCode})` : 'Not Found'}`,
    `- Robots.txt: ${r.aiFiles.robotsTxt.exists ? `Found (${r.aiFiles.robotsTxt.statusCode})` : 'Not Found'}`,
    ''
  );

  if (r.aiFiles.robotsTxt.exists) {
    r.aiFiles.robotsTxt.crawlers.forEach((c) => {
      lines.push(`- ${c.name} (${c.userAgent}): ${c.access}`);
    });
    lines.push('');
  }

  lines.push(
    '## Structured Data',
    '',
    `- JSON-LD: ${r.structuredData.hasJsonLd ? 'Found' : 'Not Found'}`,
    `- Schema Types: ${r.structuredData.schemaTypes.length > 0 ? r.structuredData.schemaTypes.join(', ') : 'None'}`,
    ''
  );

  if (r.structuredData.parseErrors.length > 0) {
    lines.push('### Parse Errors', '');
    r.structuredData.parseErrors.forEach((e) => {
      lines.push(`- ${e}`);
    });
    lines.push('');
  }

  if (ai?.schemaSuggestions?.length) {
    lines.push('### Schema Fix List', '');
    ai.schemaSuggestions.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  if (ai?.customSchemaJson) {
    lines.push(
      '### Copy-Ready JSON-LD',
      '',
      '```json',
      ai.customSchemaJson,
      '```',
      ''
    );
  }

  lines.push(
    '## Answer-Ready Content',
    '',
    `- H1: ${r.answerReadyContent.h1Count}`,
    `- H2: ${r.answerReadyContent.h2Count}`,
    `- H3: ${r.answerReadyContent.h3Count}`,
    `- FAQ Section: ${formatYesNo(r.answerReadyContent.hasFaqSection)}`,
    `- Question Headings: ${formatYesNo(r.answerReadyContent.hasQuestionHeadings)}`,
    `- Lists: ${formatYesNo(r.answerReadyContent.hasLists)}`,
    `- Short Answers: ${formatYesNo(r.answerReadyContent.hasShortAnswerParagraphs)}`,
    ''
  );

  if (ai?.contentSuggestions?.length) {
    lines.push('### Content Blocks To Add', '');
    ai.contentSuggestions.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  if (ai?.missingTopics?.length) {
    lines.push('### Query Fan-Out Gaps', '');
    ai.missingTopics.forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  if (ai?.customLlmsTxt || ai?.customLlmsFullTxt) {
    lines.push('## Copy-Ready LLMs.txt Files', '');
  }

  if (ai?.customLlmsTxt) {
    lines.push('### /llms.txt', '', '```txt', ai.customLlmsTxt, '```', '');
  }

  if (ai?.customLlmsFullTxt) {
    lines.push(
      '### /llms-full.txt',
      '',
      '```txt',
      ai.customLlmsFullTxt,
      '```',
      ''
    );
  }

  lines.push(
    '## Entity Clarity',
    '',
    `- Inferred Brand: ${r.entityClarity.inferredBrandName || 'N/A'}`,
    `- og:site_name: ${formatYesNo(r.entityClarity.hasOgSiteName)}`,
    `- Organization Schema: ${formatYesNo(r.entityClarity.hasOrganizationSchema)}`,
    `- Brand Mentions: ${r.entityClarity.brandMentionCount ?? 0}`,
    '',
    '## Trust Signals',
    '',
    `- Author: ${formatYesNo(r.trustSignals.hasAuthor)}`,
    `- Published Date: ${formatYesNo(r.trustSignals.hasPublishedDate)}`,
    `- Modified Date: ${formatYesNo(r.trustSignals.hasModifiedDate)}`,
    `- About Link: ${formatYesNo(r.trustSignals.hasAboutLink)}`,
    `- Contact Link: ${formatYesNo(r.trustSignals.hasContactLink)}`,
    `- Privacy Link: ${formatYesNo(r.trustSignals.hasPrivacyLink)}`,
    `- External Links: ${r.trustSignals.externalLinkCount}`,
    '',
    '## Prioritized Fixes',
    ''
  );

  r.recommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. ${rec}`);
  });

  lines.push(
    '',
    '## Suggested 30-Day SEO/GEO Follow-Up',
    '',
    '1. Apply the top 3 fixes first, then re-run this checker.',
    '2. Publish or update the answer-ready content blocks suggested above.',
    '3. Add the JSON-LD and LLMs.txt files, then request recrawls in search tools.',
    '4. Track whether brand, product, and problem queries return clearer snippets or AI answers.',
    ''
  );

  lines.push(
    '## Evidence Log',
    '',
    `- Crawlability: ${r.page.statusCode ? `HTTP ${r.page.statusCode}` : 'Unknown'}`,
    `- AI crawler access: ${
      r.aiFiles.robotsTxt.exists
        ? `${r.aiFiles.robotsTxt.crawlers.length} user agents checked`
        : 'Robots.txt not found'
    }`,
    `- LLMs.txt / LLMs-full.txt: ${
      r.aiFiles.llmsTxt.exists ? 'LLMs.txt found' : 'LLMs.txt missing'
    }, ${
      r.aiFiles.llmsFullTxt.exists
        ? 'LLMs-full.txt found'
        : 'LLMs-full.txt missing'
    }`,
    `- Schema / entity clarity: ${
      r.structuredData.schemaTypes.length > 0
        ? r.structuredData.schemaTypes.join(', ')
        : 'No JSON-LD schema detected'
    }`,
    `- Answer-ready content: ${
      r.answerReadyContent.hasShortAnswerParagraphs
        ? 'Short answer paragraphs found'
        : 'Short answer paragraphs need work'
    }`,
    `- Trust signals: ${
      r.trustSignals.hasContactLink
        ? 'Contact signal found'
        : 'Contact signal missing'
    }`,
    '',
    '## Fix Pack Contents',
    '',
    '- Score summary',
    '- Priority repair order',
    '- Crawlability review',
    '- AI crawler access review',
    '- LLMs.txt and LLMs-full.txt plan',
    '- Schema and entity clarity checks',
    '- Answer-ready content suggestions',
    '- Trust signals review',
    '- Evidence log',
    '',
    '## Monitor Next Step',
    '',
    'After these fixes are published, monitor this URL for silent regressions in crawler access, schema, LLMs.txt, and answer-ready content.',
    ''
  );

  lines.push('');
  return lines.join('\n');
}

// ---------- Route export ----------

export const Route = createFileRoute('/report/$token')({
  head: () => ({
    ...seo('/report/$token', {
      title: 'AI Search Readiness Fix Pack',
      description:
        'Your paid AI search readiness fix pack with prioritized fixes, copy-ready schema, llms.txt files, and content improvement suggestions.',
      noIndex: true,
    }),
  }),
  component: ReportPage,
});

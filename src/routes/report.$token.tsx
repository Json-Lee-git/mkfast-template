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
      return { label: 'Allowed', cls: 'text-emerald-600 dark:text-emerald-400' };
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getReportByToken({ data: { token } });
        if (!cancelled) {
          setReport(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load report.');
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <IconLoader2 size={48} className="mx-auto animate-spin text-blue-500" />
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
          <IconAlertTriangle
            size={40}
            className="mx-auto text-amber-400"
          />
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
          <IconAlertTriangle
            size={40}
            className="mx-auto text-amber-400"
          />
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Payment pending
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            Your report for{' '}
            <span className="font-medium text-gray-700 dark:text-zinc-300">
              {report.websiteUrl}
            </span>{' '}
            is waiting for payment confirmation. The full report will be
            available here once your payment is processed.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Active report ----------
  const r = report.result!;
  const hostname = new URL(r.normalizedUrl).hostname;

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
    link.download = `aeo-full-report-${hostname}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="min-h-screen print:bg-white print:text-black">
      {/* Header */}
      <section className="border-b border-gray-200 dark:border-zinc-800/50 print:hidden">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                Full AEO Audit Report
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
          Full AEO Audit Report — {hostname}
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

          {/* Crawlability */}
          <Card title="Technical Crawlability" status="good">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Meta
                label="Status"
                value={r.page.statusCode ? `HTTP ${r.page.statusCode}` : 'N/A'}
              />
              <Meta
                label="Content Type"
                value={r.page.contentType || 'N/A'}
              />
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
                value={r.answerReadyContent.hasFaqSection ? 'Found' : 'Not Found'}
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
                  r.entityClarity.hasOrganizationSchema
                    ? 'Found'
                    : 'Not Found'
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

          {/* Prioritized Fixes */}
          <Card title="Prioritized Fixes" status="neutral">
            <div className="space-y-4">
              {r.recommendations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  No critical issues found. Your site is in good shape.
                </p>
              ) : (
                <>
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
                </>
              )}
            </div>
          </Card>

          {/* AI Analysis */}
          {r.aiAnalysis && (
            <Card title="AI-Powered Analysis" status="neutral">
              <div className="space-y-5">
                <p className="text-sm text-gray-700 dark:text-zinc-300">
                  {r.aiAnalysis.summary}
                </p>
                {r.aiAnalysis.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                      Strengths
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-zinc-400">
                      {r.aiAnalysis.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <IconCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />{' '}
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.aiAnalysis.quickWins.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      Quick Wins
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-zinc-400">
                      {r.aiAnalysis.quickWins.map((w) => (
                        <li key={w} className="flex items-start gap-2">
                          <IconAlertTriangle size={14} className="mt-0.5 shrink-0 text-blue-500" />{' '}
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.aiAnalysis.contentSuggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                      Content Suggestions
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-zinc-400">
                      {r.aiAnalysis.contentSuggestions.map((c) => (
                        <li key={c} className="flex items-start gap-2">
                          <IconCheck size={14} className="mt-0.5 shrink-0 text-purple-500" />{' '}
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.aiAnalysis.schemaSuggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      Schema Suggestions
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-zinc-400">
                      {r.aiAnalysis.schemaSuggestions.map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <IconCheck size={14} className="mt-0.5 shrink-0 text-amber-500" />{' '}
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Schema Recommendations */}
          <Card title="Schema Recommendations" status="neutral">
            <div className="space-y-4">
              {r.structuredData.schemaTypes.length === 0 ? (
                <SchemaRecommendations
                  missing
                  websiteUrl={r.normalizedUrl}
                  brandName={r.entityClarity.inferredBrandName || hostname}
                />
              ) : (
                <SchemaRecommendations
                  missing={false}
                  existingTypes={r.structuredData.schemaTypes}
                  hasOrganization={r.entityClarity.hasOrganizationSchema}
                  hasFaq={r.answerReadyContent.hasFaqSection}
                  websiteUrl={r.normalizedUrl}
                  brandName={r.entityClarity.inferredBrandName || hostname}
                />
              )}
            </div>
          </Card>

          {/* LLMs.txt Improvement Plan */}
          <Card
            title="LLMs.txt Improvement Plan"
            status={r.aiFiles.llmsTxt.exists ? 'good' : 'issue'}
          >
            <LlmsTxtPlan
              hasLlmsTxt={r.aiFiles.llmsTxt.exists}
              hasLlmsFullTxt={r.aiFiles.llmsFullTxt.exists}
              websiteUrl={r.normalizedUrl}
              brandName={r.entityClarity.inferredBrandName || hostname}
              title={r.page.title || hostname}
              description={r.page.metaDescription || ''}
            />
          </Card>

          {/* Answer Content Suggestions */}
          <Card
            title="Answer-Ready Content Suggestions"
            status={r.answerReadyContent.hasFaqSection ? 'good' : 'warning'}
          >
            <ContentSuggestions
              h1Count={r.answerReadyContent.h1Count}
              h2Count={r.answerReadyContent.h2Count}
              hasFaq={r.answerReadyContent.hasFaqSection}
              hasQuestions={r.answerReadyContent.hasQuestionHeadings}
              hasShortAnswers={r.answerReadyContent.hasShortAnswerParagraphs}
              hasLists={r.answerReadyContent.hasLists}
            />
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
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Run a new audit:{' '}
              <a
                href="/tools/aeo-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                AEO Checker
              </a>
              {' | '}
              <a
                href="/tools/llms-txt-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt Checker
              </a>
              {' | '}
              <a
                href="/tools/llms-txt-generator"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt Generator
              </a>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ---------- Sub-components ----------

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

// ---------- Full-report sections ----------

function SchemaRecommendations({
  missing,
  existingTypes = [],
  hasOrganization,
  hasFaq,
  websiteUrl,
  brandName,
}: {
  missing: boolean;
  existingTypes?: string[];
  hasOrganization?: boolean;
  hasFaq?: boolean;
  websiteUrl: string;
  brandName: string;
}) {
  const domain = new URL(websiteUrl).hostname;

  return (
    <div className="space-y-4 text-sm">
      {missing && (
        <p className="text-gray-500 dark:text-zinc-400">
          No structured data detected. Adding JSON-LD schema helps AI systems
          understand your site content and entity relationships. Here is a
          baseline recommendation:
        </p>
      )}

      <div>
        <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
          Organization schema
        </h4>
        <pre className="overflow-x-auto rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 text-xs text-gray-700 dark:text-zinc-300">
{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${brandName}",
  "url": "${websiteUrl}",
  "sameAs": []
}`}
        </pre>
      </div>

      <div>
        <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
          WebSite schema
        </h4>
        <pre className="overflow-x-auto rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 text-xs text-gray-700 dark:text-zinc-300">
{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${brandName}",
  "url": "${websiteUrl}"
}`}
        </pre>
      </div>

      {hasFaq && (
        <div>
          <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
            FAQPage schema (detected FAQ content — add this)
          </h4>
          <pre className="overflow-x-auto rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 text-xs text-gray-700 dark:text-zinc-300">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is [topic]?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "[concise answer]"
    }
  }]
}`}
          </pre>
        </div>
      )}
    </div>
  );
}

function LlmsTxtPlan({
  hasLlmsTxt,
  hasLlmsFullTxt,
  websiteUrl,
  brandName,
  title,
  description,
}: {
  hasLlmsTxt: boolean;
  hasLlmsFullTxt: boolean;
  websiteUrl: string;
  brandName: string;
  title: string;
  description: string;
}) {
  if (hasLlmsTxt && hasLlmsFullTxt) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Both LLMs.txt and LLMs-full.txt are present. Review them periodically
        to ensure they reflect your current site structure and key pages.
      </p>
    );
  }

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
          <pre className="overflow-x-auto rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 text-xs text-gray-700 dark:text-zinc-300">
{`# ${brandName}
> ${description || title}

## Core Pages
- [Home](${websiteUrl}): Main landing page
- [About](${websiteUrl}/about): Company information

## Tools
- [AEO Checker](${websiteUrl}/tools/aeo-checker): Technical AEO audit

## Optional
- [LLMs.txt Guide](${websiteUrl}/guides/llms-txt-file): LLMs.txt documentation`}
          </pre>
        </div>
      )}

      {!hasLlmsFullTxt && (
        <div>
          <h4 className="font-medium text-gray-800 dark:text-zinc-200 mb-2">
            Recommended LLMs-full.txt:
          </h4>
          <pre className="overflow-x-auto rounded-xl bg-gray-100 dark:bg-zinc-800 p-4 text-xs text-gray-700 dark:text-zinc-300">
{`# ${brandName} - Full Content
## Home
${description || title}

## AEO Checker
Free technical AEO audit tool checking crawlability, LLMs.txt,
AI crawler access, structured data, answer-ready content, entity
clarity, and trust signals for any website.`}
          </pre>
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

// ---------- Markdown export ----------

function buildFullReportMarkdown(r: NonNullable<ReportData['result']>): string {
  const lines = [
    '# Full AEO Audit Report',
    '',
    `Website: ${new URL(r.normalizedUrl).hostname}`,
    `Checked URL: ${r.normalizedUrl}`,
    `Generated: ${new Date(r.checkedAt).toISOString()}`,
    `Overall Score: ${r.score}/100 — ${scoreLabelText(r.score)}`,
    '',
    '## Technical Crawlability',
    '',
    `- HTTP Status: ${r.page.statusCode || 'N/A'}`,
    `- Content Type: ${r.page.contentType || 'N/A'}`,
    `- Title: ${r.page.title || 'Missing'}`,
    `- Meta Description: ${r.page.metaDescription || 'Missing'}`,
    `- Canonical: ${r.page.canonical || 'Missing'}`,
    `- Meta Robots: ${r.page.metaRobots || 'Not detected'}`,
  ];

  if (r.page.issues.length > 0) {
    lines.push('', '### Issues', '');
    r.page.issues.forEach((i) => lines.push(`- ${i}`));
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
    r.structuredData.parseErrors.forEach((e) => lines.push(`- ${e}`));
    lines.push('');
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
    '',
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

  lines.push('');
  return lines.join('\n');
}

// ---------- Route export ----------

export const Route = createFileRoute('/report/$token')({
  head: () => ({
    ...seo('/report/$token', {
      title: 'Full AEO Audit Report',
      description:
        'Your full AEO audit report with detailed technical analysis, prioritized fixes, schema recommendations, and content improvement suggestions.',
      noIndex: true,
    }),
  }),
  component: ReportPage,
});

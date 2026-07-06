import { seo } from '@/lib/seo';
import {
  faqSchema,
  jsonLd,
  softwareApplicationSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { getCanonicalUrl } from '@/lib/urls';
import { trackConversionEvent } from '@/lib/conversion-events';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconLoader2,
  IconMail,
  IconArrowRight,
} from '@tabler/icons-react';
import { checkAiReadiness, type CheckResult } from '@/api/ai-readiness/checker';
import { submitLeadCapture } from '@/api/ai-readiness/lead';
import { formatBytes } from '@/lib/formatter';
import { useState } from 'react';

// ---------- Types ----------

type Status = 'good' | 'warning' | 'issue' | 'neutral';

// ---------- Utility helpers ----------

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

function accessBadge(access: 'allowed' | 'blocked' | 'unknown'): {
  label: string;
  cls: string;
} {
  switch (access) {
    case 'allowed':
      return {
        label: 'Allowed',
        cls: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'blocked':
      return { label: 'Blocked', cls: 'text-red-600 dark:text-red-400' };
    case 'unknown':
      return { label: 'Unknown', cls: 'text-gray-400 dark:text-zinc-500' };
  }
}

function scoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
}

// ---------- Component ----------

function CheckerPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);

  // Lead capture
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadMessage, setLeadMessage] = useState<string | null>(null);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a website URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    trackConversionEvent('llms_checker_started', { url: trimmed });

    try {
      const data = await checkAiReadiness({ data: { url: trimmed } });
      setResult(data);
      trackConversionEvent('llms_checker_completed', {
        url: data.normalizedUrl,
        score: data.score,
      });
    } catch (err: any) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim() || !r) return;

    setLeadLoading(true);
    setLeadMessage(null);

    try {
      const res = await submitLeadCapture({
        data: { email: leadEmail.trim(), websiteUrl: r.normalizedUrl },
      });
      setLeadMessage(res.message);
      setLeadSuccess(res.success);
      if (res.success) {
        trackConversionEvent('llms_lead_capture_submitted', {
          url: r.normalizedUrl,
        });
        setLeadEmail('');
      }
    } catch {
      setLeadMessage(
        'Unable to send the report at this time. Please try again later.'
      );
      setLeadSuccess(false);
    } finally {
      setLeadLoading(false);
    }
  };

  const r = result;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              LLMs.txt Checker & Validator
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Check whether your website has a valid LLMs.txt file, accessible
              AI-readable links, LLMs-full.txt, sitemap, and AI crawler access.
              LLMs.txt is useful context for some AI systems, but it is not
              required for Google AI Overviews or AI Mode.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              Use this free LLMs.txt validator to test the file at
              <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-zinc-900">
                /llms.txt
              </code>
              , verify response headers, find broken links, and check whether AI
              crawlers can reach the public pages listed in your file.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
              This checker also works as a free LLMs.txt validation tool for
              teams that need to verify headers, Markdown structure, link
              health, and AI crawler access before submitting a site for AI
              search review.
            </p>
          </div>
        </Container>
      </section>

      {/* Form */}
      <section className="py-12">
        <Container>
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your domain or website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Validate LLMs.txt'
                )}
              </button>
            </div>
          </form>
        </Container>
      </section>

      {/* Error */}
      {error && (
        <section className="pb-8">
          <Container>
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-4 text-center">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </Container>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && !r && (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 text-center">
                <IconLoader2
                  size={48}
                  className="mx-auto animate-spin text-blue-500"
                />
                <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
                  Checking your site... This may take a few seconds.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Report */}
      {r && (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Overall Score */}
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                  Technical Readiness Estimate
                </p>
                <p className={`mt-2 text-6xl font-bold ${scoreColor(r.score)}`}>
                  {r.score}
                </p>
                <p className="mt-2 text-sm text-gray-400 dark:text-zinc-500">
                  out of 100
                </p>
              </div>

              {/* LLMs.txt status */}
              <ResultCard
                title="LLMs.txt Status"
                status={r.llmsTxt.exists ? 'good' : 'issue'}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <MetaItem
                    label="Status"
                    value={r.llmsTxt.exists ? 'Found' : 'Not Found'}
                  />
                  <MetaItem
                    label="HTTP Status"
                    value={
                      r.llmsTxt.statusCode != null
                        ? String(r.llmsTxt.statusCode)
                        : 'N/A'
                    }
                  />
                  <MetaItem label="URL" value={r.llmsTxt.url} />
                  {r.llmsTxt.sizeBytes != null && (
                    <MetaItem
                      label="File Size"
                      value={formatBytes(r.llmsTxt.sizeBytes)}
                    />
                  )}
                </div>
              </ResultCard>

              {/* Structure */}
              <ResultCard
                title="LLMs.txt Structure"
                status={
                  !r.llmsTxt.exists
                    ? 'issue'
                    : r.llmsTxt.structure &&
                        r.llmsTxt.structure.issues.length > 0
                      ? 'warning'
                      : 'good'
                }
              >
                {r.llmsTxt.structure && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <MetaItem
                        label="H1 Heading"
                        value={
                          r.llmsTxt.structure.hasH1 ? 'Present' : 'Missing'
                        }
                      />
                      <MetaItem
                        label="Summary"
                        value={
                          r.llmsTxt.structure.hasSummary ? 'Present' : 'Missing'
                        }
                      />
                      <MetaItem
                        label="Sections"
                        value={String(r.llmsTxt.structure.sectionCount)}
                      />
                      <MetaItem
                        label="Total Links"
                        value={String(r.llmsTxt.structure.linkCount)}
                      />
                      <MetaItem
                        label="Internal Links"
                        value={String(r.llmsTxt.structure.internalLinkCount)}
                      />
                      <MetaItem
                        label="External Links"
                        value={String(r.llmsTxt.structure.externalLinkCount)}
                      />
                    </div>
                    {r.llmsTxt.structure.issues.length > 0 && (
                      <ul className="mt-4 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                        {r.llmsTxt.structure.issues.map((i) => (
                          <li key={i} className="flex items-start gap-2">
                            <IconX
                              size={14}
                              className="mt-0.5 shrink-0 text-red-500"
                            />{' '}
                            {i}
                          </li>
                        ))}
                      </ul>
                    )}
                    {r.llmsTxt.structure?.warnings.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                        {r.llmsTxt.structure?.warnings.map((w) => (
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
                  </>
                )}
                {!r.llmsTxt.structure && (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Structure could not be checked because LLMs.txt was not
                    found or could not be read.
                  </p>
                )}
              </ResultCard>

              {/* Link health */}
              <ResultCard
                title="Link Health"
                status={
                  r.llmsTxt.links
                    ? r.llmsTxt.links.broken > 0
                      ? 'warning'
                      : 'good'
                    : 'neutral'
                }
              >
                {r.llmsTxt.links ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <MetaItem
                      label="Checked"
                      value={String(r.llmsTxt.links.checked)}
                    />
                    <MetaItem
                      label="Valid"
                      value={String(r.llmsTxt.links.valid)}
                    />
                    <MetaItem
                      label="Broken"
                      value={String(r.llmsTxt.links.broken)}
                    />
                    <MetaItem
                      label="Redirected"
                      value={String(r.llmsTxt.links.redirected)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    No LLMs.txt links were available to check.
                  </p>
                )}
              </ResultCard>

              {/* LLMs-full.txt and sitemap */}
              <ResultCard
                title="LLMs-full.txt and Sitemap"
                status={
                  r.llmsFullTxt.exists && r.sitemap.exists ? 'good' : 'warning'
                }
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <MetaItem
                    label="LLMs-full.txt"
                    value={r.llmsFullTxt.exists ? 'Found' : 'Not Found'}
                  />
                  <MetaItem
                    label="LLMs-full.txt Status"
                    value={
                      r.llmsFullTxt.statusCode != null
                        ? String(r.llmsFullTxt.statusCode)
                        : 'N/A'
                    }
                  />
                  <MetaItem label="URL" value={r.llmsFullTxt.url} />
                  {r.llmsFullTxt.sizeBytes != null && (
                    <MetaItem
                      label="File Size"
                      value={formatBytes(r.llmsFullTxt.sizeBytes)}
                    />
                  )}
                  <MetaItem
                    label="Sitemap"
                    value={r.sitemap.exists ? 'Found' : 'Not Found'}
                  />
                  <MetaItem
                    label="Sitemap Status"
                    value={
                      r.sitemap.statusCode != null
                        ? String(r.sitemap.statusCode)
                        : 'N/A'
                    }
                  />
                  {r.sitemap.url ? (
                    <MetaItem label="Sitemap URL" value={r.sitemap.url} />
                  ) : (
                    <MetaItem label="Sitemap URL" value="N/A" />
                  )}
                </div>
              </ResultCard>

              {/* AI Crawler Access */}
              <ResultCard
                title="AI Crawler Access"
                status={r.robotsTxt.exists ? 'good' : 'issue'}
              >
                {r.robotsTxt.exists ? (
                  <div className="overflow-x-auto">
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
                        {r.robotsTxt.crawlers.map((c) => {
                          const badge = accessBadge(c.access);
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
                                className={`py-2.5 text-right font-medium ${badge.cls}`}
                              >
                                {badge.label}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    robots.txt not found.
                  </p>
                )}
              </ResultCard>

              {/* Recommendations */}
              <ResultCard title="Recommended Fixes" status="neutral">
                {r.recommendations.length > 0 ? (
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-zinc-400">
                    {r.recommendations.map((rec) => (
                      <li key={rec} className="flex items-start gap-2">
                        <IconAlertTriangle
                          size={14}
                          className="mt-0.5 shrink-0 text-blue-500"
                        />{' '}
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    No immediate technical fixes were found.
                  </p>
                )}
              </ResultCard>

              {/* Checked URL info */}
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  Checked: {r.normalizedUrl} at{' '}
                  {new Date(r.checkedAt).toLocaleString()}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-8 text-center dark:border-blue-800 dark:bg-blue-950/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">
                  Need the full AEO fix plan?
                </h3>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500 dark:text-zinc-400">
                  LLMs.txt is one part of AI search readiness. Run the AEO audit
                  to get prioritized fixes for crawlability, schema,
                  answer-ready content, trust signals, and query fan-out gaps.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href={`/tools/aeo-checker?url=${encodeURIComponent(
                      r.normalizedUrl
                    )}`}
                    onClick={() =>
                      trackConversionEvent('llms_to_aeo_report_clicked', {
                        url: r.normalizedUrl,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Run AEO audit <IconArrowRight size={16} />
                  </a>
                  <a
                    href="/sample-aeo-report"
                    onClick={() =>
                      trackConversionEvent('llms_sample_report_clicked', {
                        url: r.normalizedUrl,
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98] dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300 dark:hover:bg-blue-950/40"
                  >
                    View sample report
                  </a>
                </div>
              </div>

              {/* Lead capture */}
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-8 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10">
                    <IconMail
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-zinc-200">
                      Get the full AI Search Readiness report
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      We'll email you the complete report for {r.normalizedUrl}.
                    </p>
                  </div>
                </div>

                {leadMessage ? (
                  <div
                    className={`rounded-xl p-3 text-center text-sm ${
                      leadSuccess
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {leadMessage}
                  </div>
                ) : (
                  <form
                    onSubmit={handleLeadSubmit}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="email"
                      placeholder="Your email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      disabled={leadLoading}
                      className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={leadLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                    >
                      {leadLoading ? (
                        <>
                          <IconLoader2 size={14} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send me the report'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Internal link: guide */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Need an LLMs.txt file? Start with the{' '}
              <a
                href="/guides/llms-txt-file"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt guide
              </a>
              , compare{' '}
              <a
                href="/compare/llms-txt-checker-alternatives"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt checker alternatives
              </a>
              , then check{' '}
              <a
                href="/tools/ai-crawler-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                AI crawler access
              </a>
              ,{' '}
              <a
                href="/tools/robots-txt-ai-crawler-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                robots.txt AI rules
              </a>
              , or run the{' '}
              <a
                href="/tools/aeo-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                AEO Checker
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      {/* Trust disclaimer */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              LLMs.txt is an emerging convention. Google says there are no
              special files required for AI Overviews or AI Mode. This tool
              checks technical readiness signals and does not guarantee
              rankings, citations, or visibility in AI search products.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

// ---------- Sub-components ----------

function ResultCard({
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
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-zinc-200">
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

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400 dark:text-zinc-500">{label}</span>
      <p className="text-gray-700 dark:text-zinc-300 break-all">{value}</p>
    </div>
  );
}

// ---------- Route export ----------

export const Route = createFileRoute('/tools/llms-txt-checker')({
  head: () => ({
    ...seo('/tools/llms-txt-checker', {
      title: 'Free LLMs.txt Checker & Validator — Test Your AI Crawler Access',
      description:
        'Validate your llms.txt, llms-full.txt, sitemap, and AI crawler access for GPTBot, ClaudeBot, PerplexityBot, and more. See what AI sees. Free, instant, no signup.',
    }),
    scripts: [
      jsonLd(
        softwareApplicationSchema({
          name: 'LLMs.txt Checker & Validator',
          websiteUrl: getCanonicalUrl('/tools/llms-txt-checker'),
          longDescription:
            'Free validator that checks llms.txt structure, link health, llms-full.txt discoverability, sitemap presence, and AI crawler access across GPTBot, ClaudeBot, PerplexityBot, and more.',
          startingPrice: '$0',
          keyFeatures: [
            'LLMs.txt structure validation',
            'Link health & broken link detection',
            'AI crawler access analysis',
            'Sitemap & llms-full.txt checks',
            'Readiness score (0-100)',
          ],
        })
      ),
      jsonLd(
        faqSchema([
          {
            q: 'What is an LLMs.txt validator?',
            a: 'An LLMs.txt validator checks whether your website has a correctly structured /llms.txt file, validates its internal links, confirms llms-full.txt and sitemap discoverability, and reports AI crawler access for GPTBot, ClaudeBot, PerplexityBot, and other AI user agents.',
          },
          {
            q: 'Why does my site need an llms.txt file?',
            a: 'LLMs.txt helps AI systems and LLM-based search tools discover, crawl, and understand your key content. Without one, AI crawlers may miss important pages or get an incomplete picture of your site.',
          },
          {
            q: 'Is this tool free?',
            a: 'Yes — the LLMs.txt Checker & Validator is free to use. No account, no signup required.',
          },
        ])
      ),
      jsonLd(websiteSchema()),
    ],
  }),
  component: CheckerPage,
});

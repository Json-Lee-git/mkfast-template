import { seo } from '@/lib/seo';
import { jsonLd, websiteSchema } from '@/lib/ai-visibility-schema';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import {
  IconCopy,
  IconDownload,
  IconPencil,
  IconArrowRight,
  IconLoader2,
} from '@tabler/icons-react';
import { generateLlmsTxt, enhanceLlmsTxt } from '@/api/ai-readiness/generator';
import { useState } from 'react';

// ---------- Component ----------

function GeneratorPage() {
  const [activeTab, setActiveTab] = useState<'sitemap' | 'manual'>('sitemap');

  // Sitemap mode
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapError, setSitemapError] = useState<string | null>(null);
  const [sitemapResult, setSitemapResult] = useState<{
    markdown: string;
    warnings: string[];
  } | null>(null);

  // Manual mode
  const [siteName, setSiteName] = useState('');
  const [summary, setSummary] = useState('');
  const [manualSections, setManualSections] = useState([
    {
      title: '',
      links: [{ title: '', url: '', description: '' }],
    },
  ]);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [, setManualResult] = useState<string | null>(null);

  // Shared output state
  const [output, setOutput] = useState('');
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceMsg, setEnhanceMsg] = useState<string | null>(null);

  // Sitemap submit
  const handleSitemapSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sitemapUrl.trim();
    if (!trimmed) {
      setSitemapError('Please enter a website URL or sitemap URL.');
      return;
    }
    setSitemapLoading(true);
    setSitemapError(null);
    setSitemapResult(null);
    setOutput('');

    try {
      const result = await generateLlmsTxt({
        data: { mode: 'sitemap', url: trimmed },
      });
      setSitemapResult({
        markdown: result.markdown,
        warnings: result.warnings,
      });
      setOutput(result.markdown);
    } catch (err: any) {
      setSitemapError(err?.message || 'Something went wrong.');
    } finally {
      setSitemapLoading(false);
    }
  };

  // Manual submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) {
      setManualError('Please enter a site name.');
      return;
    }

    // Filter out empty sections and links
    const filteredSections = manualSections
      .filter((s) => s.title.trim())
      .map((s) => ({
        title: s.title.trim(),
        links: s.links.filter((l) => l.title.trim() && l.url.trim()),
      }))
      .filter((s) => s.links.length > 0);

    if (filteredSections.length === 0) {
      setManualError('Please add at least one section with a title and link.');
      return;
    }

    setManualLoading(true);
    setManualError(null);
    setManualResult(null);
    setOutput('');

    try {
      const result = await generateLlmsTxt({
        data: {
          mode: 'manual',
          siteName: siteName.trim(),
          summary: summary.trim(),
          sections: filteredSections,
        },
      });
      setManualResult(result.markdown);
      setOutput(result.markdown);
    } catch (err: any) {
      setManualError(err?.message || 'Something went wrong.');
    } finally {
      setManualLoading(false);
    }
  };

  // AI enhance
  const handleEnhance = async () => {
    if (!output) return;
    setEnhancing(true);
    setEnhanceMsg(null);
    try {
      const resolvedSiteName =
        activeTab === 'manual'
          ? siteName.trim()
          : sitemapUrl.trim() || 'Website';
      const result = await enhanceLlmsTxt({
        data: { markdown: output, siteName: resolvedSiteName },
      });
      setOutput(result.markdown);
      setEnhanceMsg(
        result.changes.length > 0
          ? `AI enhanced: ${result.changes.join(', ')}`
          : 'AI enhancement returned no changes.'
      );
    } catch {
      setEnhanceMsg('AI enhancement unavailable. The draft is unchanged.');
    } finally {
      setEnhancing(false);
    }
  };

  // Shared output actions
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Manual section helpers
  const addSection = () => {
    setManualSections([
      ...manualSections,
      { title: '', links: [{ title: '', url: '', description: '' }] },
    ]);
  };

  const removeSection = (si: number) => {
    setManualSections(manualSections.filter((_, i) => i !== si));
  };

  const updateSectionTitle = (si: number, value: string) => {
    const next = [...manualSections];
    next[si] = { ...next[si], title: value };
    setManualSections(next);
  };

  const addLink = (si: number) => {
    const next = [...manualSections];
    next[si] = {
      ...next[si],
      links: [...next[si].links, { title: '', url: '', description: '' }],
    };
    setManualSections(next);
  };

  const removeLink = (si: number, li: number) => {
    const next = [...manualSections];
    next[si] = {
      ...next[si],
      links: next[si].links.filter((_, i) => i !== li),
    };
    setManualSections(next);
  };

  const updateLink = (
    si: number,
    li: number,
    field: 'title' | 'url' | 'description',
    value: string
  ) => {
    const next = [...manualSections];
    const links = [...next[si].links];
    links[li] = { ...links[li], [field]: value };
    next[si] = { ...next[si], links };
    setManualSections(next);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              LLMs.txt Generator
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Create a clean AI-readable LLMs.txt file from your sitemap or
              manual inputs. Copy, edit, and download it in seconds.
            </p>
          </div>
        </Container>
      </section>

      {/* Tabs */}
      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('sitemap')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sitemap'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
              >
                Generate from Sitemap
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
              >
                Manual Input
              </button>
            </div>

            {/* Sitemap mode */}
            {activeTab === 'sitemap' && (
              <div className="mt-6 space-y-4">
                <form onSubmit={handleSitemapSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Website URL or sitemap URL"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    disabled={sitemapLoading}
                    className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sitemapLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                  >
                    {sitemapLoading ? (
                      <>
                        <IconLoader2 size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  We'll read your sitemap and extract page titles to build a
                  draft LLMs.txt file. First {30} URLs will be included.
                </p>
                {sitemapError && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-3">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {sitemapError}
                    </p>
                  </div>
                )}
                {sitemapResult?.warnings &&
                  sitemapResult.warnings.length > 0 && (
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-3">
                      {sitemapResult.warnings.map((w) => (
                        <p
                          key={w}
                          className="text-sm text-amber-700 dark:text-amber-400"
                        >
                          {w}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Manual mode */}
            {activeTab === 'manual' && (
              <div className="mt-6 space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Site name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    disabled={manualLoading}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                  <textarea
                    placeholder="Site summary (optional)"
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    disabled={manualLoading}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none disabled:opacity-50"
                  />

                  {manualSections.map((section, si) => (
                    <div
                      key={si}
                      className="rounded-xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                          Section {si + 1}
                        </span>
                        {manualSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(si)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Section title (e.g. Main Pages)"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(si, e.target.value)}
                        disabled={manualLoading}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                      />

                      {section.links.map((link, li) => (
                        <div key={li} className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Link title"
                              value={link.title}
                              onChange={(e) =>
                                updateLink(si, li, 'title', e.target.value)
                              }
                              disabled={manualLoading}
                              className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                            <input
                              type="text"
                              placeholder="URL"
                              value={link.url}
                              onChange={(e) =>
                                updateLink(si, li, 'url', e.target.value)
                              }
                              disabled={manualLoading}
                              className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Optional description"
                              value={link.description}
                              onChange={(e) =>
                                updateLink(
                                  si,
                                  li,
                                  'description',
                                  e.target.value
                                )
                              }
                              disabled={manualLoading}
                              className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                            />
                            {section.links.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLink(si, li)}
                                className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLink(si)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        + Add link
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSection}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add section
                  </button>

                  {manualError && (
                    <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-3">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {manualError}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={manualLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                    >
                      {manualLoading ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate LLMs.txt'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Output */}
      {output && (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="font-semibold text-gray-800 dark:text-zinc-200 mb-4">
                {editing ? 'Edit your LLMs.txt' : 'Your LLMs.txt'}
              </h2>
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 overflow-hidden">
                {editing ? (
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={20}
                    className="w-full p-6 text-sm text-gray-700 dark:text-zinc-300 font-mono leading-relaxed bg-transparent resize-y focus:outline-none"
                  />
                ) : (
                  <pre className="p-6 text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {output}
                  </pre>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 active:scale-[0.98]"
                >
                  <IconCopy size={16} /> {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 active:scale-[0.98]"
                >
                  <IconDownload size={16} /> Download llms.txt
                </button>
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={enhancing}
                  className="inline-flex items-center gap-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 transition-all hover:border-purple-400 dark:hover:border-purple-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {enhancing ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />{' '}
                      Enhancing...
                    </>
                  ) : (
                    'AI Enhance'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:hover:border-zinc-600 active:scale-[0.98]"
                >
                  <IconPencil size={16} />{' '}
                  {editing ? 'Done Editing' : 'Edit Output'}
                </button>
                <a
                  href="/tools/llms-txt-checker"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
                >
                  Run Checker <IconArrowRight size={16} />
                </a>
              </div>
              {enhanceMsg && (
                <p className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                  {enhanceMsg}
                </p>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* LLMs-full.txt note */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-12">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-200">
              Need an LLMs-full.txt file?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
              LLMs-full.txt is usually more useful for documentation sites, API
              docs, and developer tools. It can become very large, so this
              generator focuses on LLMs.txt. You can check whether your site
              already has an LLMs-full.txt file in the{' '}
              <a
                href="/tools/llms-txt-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt Checker
              </a>
              . Learn more in the{' '}
              <a
                href="/guides/llms-txt-file"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LLMs.txt guide
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
              LLMs.txt is an emerging convention. This tool checks technical
              readiness signals and does not guarantee rankings, citations, or
              visibility in AI search products.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

// ---------- Route export ----------

export const Route = createFileRoute('/tools/llms-txt-generator')({
  head: () => ({
    ...seo('/tools/llms-txt-generator', {
      title:
        'Free LLMs.txt Generator from Sitemap | Create an AI-Readable File',
      description:
        'Generate a clean, AI-readable LLMs.txt file for your website from your sitemap or manual inputs. Create, edit, copy, and download your file. Works with any site. Free, no sign-up required.',
    }),
    scripts: [jsonLd(websiteSchema())],
  }),
  component: GeneratorPage,
});

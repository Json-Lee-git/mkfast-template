import { useState } from "react";
import type { FormEvent } from "react";

const PLATFORM_OPTIONS = ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews", "Claude", "Copilot"];
const ROLE_OPTIONS = ["Founder", "SEO", "Marketer", "Agency", "Other"];

export type CheckerFormData = {
  brandName: string; websiteUrl: string; industry: string; competitors: string;
  email: string; platforms: string[]; role: string;
};

export function CheckerForm({ onSubmit }: { onSubmit: (data: CheckerFormData) => Promise<boolean> }) {
  const [form, setForm] = useState<CheckerFormData>({ brandName: "", websiteUrl: "", industry: "", competitors: "", email: "", platforms: [], role: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePlatform = (p: string) => setForm((f) => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p] }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await onSubmit(form);
      if (ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">You're on the list</h3>
        <p className="mt-3 text-gray-600 dark:text-zinc-300">We're preparing a sample AI visibility report format. We'll email you when your report is ready.</p>
      </div>
    );
  }

  const inputClass = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-zinc-300";
  const pillActive = "rounded px-2.5 py-1 text-xs transition-colors bg-blue-600 text-white";
  const pillInactive = "rounded px-2.5 py-1 text-xs transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div><label className={labelClass}>Brand name *</label><input required className={inputClass} placeholder="Your brand name" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} /></div>
      <div><label className={labelClass}>Website URL *</label><input required type="url" className={inputClass} placeholder="https://example.com" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} /></div>
      <div><label className={labelClass}>Industry</label><input className={inputClass} placeholder="e.g. SaaS, E-commerce" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></div>
      <div><label className={labelClass}>Main competitors (optional)</label><input className={inputClass} placeholder="e.g. competitor1.com" value={form.competitors} onChange={(e) => setForm({ ...form, competitors: e.target.value })} /></div>
      <div><label className={labelClass}>Work email *</label><input required type="email" className={inputClass} placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div><label className={labelClass}>Which AI platforms do you care about?</label><div className="flex flex-wrap gap-2">{PLATFORM_OPTIONS.map((p) => (<button key={p} type="button" className={form.platforms.includes(p) ? pillActive : pillInactive} onClick={() => togglePlatform(p)}>{p}</button>))}</div></div>
      <div><label className={labelClass}>Current role</label><div className="flex flex-wrap gap-2">{ROLE_OPTIONS.map((r) => (<button key={r} type="button" className={form.role === r ? pillActive : pillInactive} onClick={() => setForm({ ...form, role: r })}>{r}</button>))}</div></div>
      <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Submitting..." : "Submit & Get Sample Report"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}

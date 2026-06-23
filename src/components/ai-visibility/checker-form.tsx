import { useState } from "react";
import type { FormEvent } from "react";

const PLATFORM_OPTIONS = ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews", "Claude", "Copilot"];
const ROLE_OPTIONS = ["Founder", "SEO", "Marketer", "Agency", "Other"];

export type CheckerFormData = {
  brandName: string;
  websiteUrl: string;
  industry: string;
  competitors: string;
  email: string;
  platforms: string[];
  role: string;
};

export function CheckerForm({ onSubmit }: { onSubmit: (data: CheckerFormData) => void }) {
  const [form, setForm] = useState<CheckerFormData>({
    brandName: "",
    websiteUrl: "",
    industry: "",
    competitors: "",
    email: "",
    platforms: [],
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const togglePlatform = (p: string) => {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-800 bg-emerald-900/20 p-8 text-center">
        <h3 className="text-xl font-semibold text-emerald-400">You're on the list</h3>
        <p className="mt-3 text-zinc-300">
          We're preparing a sample AI visibility report format. We'll email you when your report is ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Brand name *</label>
        <input
          required
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          placeholder="Your brand name"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Website URL *</label>
        <input
          required
          type="url"
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          placeholder="https://example.com"
          value={form.websiteUrl}
          onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Industry</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          placeholder="e.g. SaaS, E-commerce, Fintech"
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Main competitors (optional)</label>
        <input
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          placeholder="e.g. competitor1.com, competitor2.com"
          value={form.competitors}
          onChange={(e) => setForm({ ...form, competitors: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Work email *</label>
        <input
          required
          type="email"
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Which AI platforms do you care about?</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                form.platforms.includes(p)
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              onClick={() => togglePlatform(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">Current role</label>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`rounded px-3 py-1 text-xs transition-colors ${
                form.role === r ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              onClick={() => setForm({ ...form, role: r })}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Submit & Get Sample Report
      </button>
    </form>
  );
}

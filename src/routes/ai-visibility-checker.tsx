import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container";
import { CheckerForm } from "@/components/ai-visibility/checker-form";
import { FAQ } from "@/components/ai-visibility/faq";
import type { CheckerFormData } from "@/components/ai-visibility/checker-form";
import { seo } from "@/lib/seo";

const checkerFAQ = [
  { q: "What does this checker do?", a: "This early-access checker collects your brand information and helps us prepare a sample AI visibility report. It does not perform live monitoring across AI platforms yet." },
  { q: "Is this checker free?", a: "Yes, completely free. Submit your details and we will send you a sample report format via email." },
  { q: "When will I get my report?", a: "We are currently preparing sample report formats. You will receive an email when your report is ready." },
  { q: "What will the report include?", a: "The sample report will show brand mention overview, platform breakdown, competitor comparison, and trend charts." },
];

export const Route = createFileRoute("/ai-visibility-checker")({
  head: () => seo("/ai-visibility-checker", {
    title: "Free AI Visibility Checker — Check Brand Presence Across AI Search",
    description: "Free AI visibility checker. See how your brand appears across ChatGPT, Perplexity, Gemini and Google AI Overviews. Get a sample report.",
  }),
  component: CheckerPage,
});

function CheckerPage() {
  const handleSubmit = (_data: CheckerFormData) => {};

  return (
    <div>
      <section className="border-b border-zinc-800 py-16">
        <Container className="text-center">
          <h1 className="text-3xl font-bold text-zinc-100">Free AI Visibility Checker</h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">Enter your brand details to get started. We'll prepare a sample AI visibility report for your brand.</p>
        </Container>
      </section>
      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-lg">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
              <CheckerForm onSubmit={handleSubmit} />
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              This is an early-access checker. The current version collects your inputs and helps us prepare a sample report. It does not perform live monitoring across AI platforms yet.
            </p>
          </div>
        </Container>
      </section>
      <section className="border-t border-zinc-800 py-12">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-zinc-100">What a Full Report Includes</h2>
            <ul className="mt-6 space-y-3 text-zinc-400">
              <li>✓ Brand mention overview across all tracked AI platforms</li>
              <li>✓ Platform-by-platform breakdown with mention frequency</li>
              <li>✓ Competitor comparison and share of voice analysis</li>
              <li>✓ Sentiment analysis and trend charts over time</li>
              <li>✓ Recommendations for improving AI search visibility</li>
            </ul>
          </div>
        </Container>
      </section>
      <section className="border-t border-zinc-800 py-12">
        <Container><div className="mx-auto max-w-2xl"><h2 className="text-2xl font-bold text-zinc-100">FAQ</h2><FAQ items={checkerFAQ} className="mt-6" /></div></Container>
      </section>
    </div>
  );
}

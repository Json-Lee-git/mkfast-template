import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container";
import { PricingTable } from "@/components/ai-visibility/pricing-table";
import { FAQ } from "@/components/ai-visibility/faq";
import { tools } from "@/data/tools";
import { seo } from "@/lib/seo";

const pricingFAQ = [
  { q: "How much do AI visibility tools cost?", a: "AI visibility tools range from free (OmniSEO, LLMrefs) to $139.95/month (Semrush). Most mid-range tools cost $39-79/month." },
  { q: "Are there free AI visibility tools?", a: "Yes. Otterly AI, OmniSEO, LLMrefs, and Peec AI offer free plans or free checkers." },
  { q: "Do AI visibility tools offer free trials?", a: "Many do. Peec AI offers 14-day trials on all plans. Check individual vendor pages for current offers." },
  { q: "Is it worth paying for AI visibility tracking?", a: "If your brand competes for organic discovery and your audience uses AI search, paid tracking provides actionable competitive intelligence." },
];

export const Route = createFileRoute("/ai-visibility-tools-pricing")({
  head: () => seo("/ai-visibility-tools-pricing", {
    title: "AI Visibility Tools Pricing Comparison — Plans & Costs (2026)",
    description: "Compare pricing for AI visibility tools. From free plans to enterprise solutions. Find the best AI visibility tracker for your budget.",
  }),
  component: PricingPage,
});

function PricingPage() {
  const freeTools = tools.filter((t) => t.hasFreePlan);
  const budgetTools = tools.filter((t) => parseInt(t.startingPrice.replace(/[^0-9]/g, "")) > 0 && parseInt(t.startingPrice.replace(/[^0-9]/g, "")) < 50);

  return (
    <div>
      <section className="border-b border-gray-200 dark:border-zinc-800 py-16">
        <Container>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">AI Visibility Tools Pricing</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">Compare pricing, plans, and costs for the top AI visibility tracking tools.</p>
        </Container>
      </section>
      <section className="py-12"><Container><PricingTable tools={tools} /></Container></section>
      <section className="border-t border-gray-200 dark:border-zinc-800 py-12">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Free AI Visibility Tools</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((t) => (
              <a key={t.slug} href={`/tools/${t.slug}`} className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4 hover:border-zinc-700">
                <h3 className="font-semibold text-gray-800 dark:text-zinc-200">{t.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{t.shortDescription.slice(0, 100)}...</p>
                <span className="mt-2 inline-block text-xs text-emerald-600 dark:text-emerald-400">✓ Free plan available</span>
              </a>
            ))}
          </div>
        </Container>
      </section>
      {budgetTools.length > 0 && (
        <section className="border-t border-gray-200 dark:border-zinc-800 py-12">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Budget Picks (Under $50/mo)</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {budgetTools.map((t) => (
                <div key={t.slug} className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-zinc-200">{t.name}</h3>
                  <p className="text-sm text-zinc-400">{t.startingPrice}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
      <section className="border-t border-gray-200 dark:border-zinc-800 py-12">
        <Container><div className="mx-auto max-w-2xl"><h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">FAQ</h2><FAQ items={pricingFAQ} className="mt-6" /></div></Container>
      </section>
    </div>
  );
}

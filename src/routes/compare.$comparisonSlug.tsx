import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container";
import { FAQ } from "@/components/ai-visibility/faq";
import { getComparisonBySlug, getRelatedComparisons } from "@/data/comparisons";
import { getToolBySlug } from "@/data/tools";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/compare/$comparisonSlug")({
  head: ({ params }) => {
    const comp = getComparisonBySlug(params.comparisonSlug);
    if (!comp) return seo("/compare", { title: "Not Found", description: "" });
    return seo(`/compare/${comp.slug}`, { title: comp.title, description: comp.metaDescription });
  },
  component: ComparePage,
});

function ComparePage() {
  const { comparisonSlug } = Route.useParams();
  const comp = getComparisonBySlug(comparisonSlug);

  if (!comp) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Comparison not found</h1>
        <a href="/best-ai-visibility-tools" className="mt-4 inline-block text-blue-400">← Back to tools</a>
      </Container>
    );
  }

  const toolA = getToolBySlug(comp.toolA);
  const toolB = getToolBySlug(comp.toolB);
  const related = getRelatedComparisons(comp);

  if (!toolA || !toolB) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Tool data not available</h1>
      </Container>
    );
  }

  const compareFAQ = [
    { q: `Which is better, ${toolA.name} or ${toolB.name}?`, a: comp.recommendationDetail },
    { q: `Is ${toolA.name} cheaper than ${toolB.name}?`, a: comp.pricingSummary },
    { q: `What platforms does each support?`, a: `${toolA.name}: ${toolA.platforms.join(", ")}. ${toolB.name}: ${toolB.platforms.join(", ")}.` },
  ];

  return (
    <div>
      <section className="border-b border-gray-200 dark:border-zinc-800 py-16">
        <Container>
          <a href="/best-ai-visibility-tools" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-300">← Back to all tools</a>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-zinc-100">{comp.title}</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">{comp.summary}</p>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800">
                  <th className="px-4 py-2 text-left text-xs font-medium text-zinc-400">Feature</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-400">{toolA.name}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400">{toolB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  ["Starting Price", toolA.startingPrice, toolB.startingPrice],
                  ["Free Plan", toolA.hasFreePlan ? "✓" : "✗", toolB.hasFreePlan ? "✓" : "✗"],
                  ["Free Checker", toolA.hasFreeChecker ? "✓" : "✗", toolB.hasFreeChecker ? "✓" : "✗"],
                  ["Platforms", toolA.platforms.join(", "), toolB.platforms.join(", ")],
                  ["Best For", toolA.bestFor.join(", "), toolB.bestFor.join(", ")],
                ].map(([label, a, b]) => (
                  <tr key={label}>
                    <td className="px-4 py-2 text-zinc-400">{label}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-zinc-300">{a}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-zinc-300">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800 py-8">
        <Container>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Pricing Comparison</h2>
          <p className="mt-2 text-zinc-400">{comp.pricingSummary}</p>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800 py-8">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-blue-400">Best for {toolA.name}</h2>
              <ul className="mt-4 space-y-2">
                {comp.bestForToolA.map((b) => (<li key={b} className="text-sm text-zinc-400">• {b}</li>))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Best for {toolB.name}</h2>
              <ul className="mt-4 space-y-2">
                {comp.bestForToolB.map((b) => (<li key={b} className="text-sm text-zinc-400">• {b}</li>))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800 py-8">
        <Container>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Recommendation</h2>
          <p className="mt-4 text-gray-700 dark:text-zinc-300">{comp.recommendationDetail}</p>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-gray-200 dark:border-zinc-800 py-8">
          <Container>
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Other Comparisons</h2>
            <div className="mt-4 space-y-2">
              {related.map((r) => (
                <a key={r.slug} href={`/compare/${r.slug}`} className="block text-blue-600 dark:text-blue-400 hover:text-blue-300">→ {r.title}</a>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-gray-200 dark:border-zinc-800 py-8">
        <Container><div className="mx-auto max-w-2xl"><FAQ items={compareFAQ} /></div></Container>
      </section>
    </div>
  );
}

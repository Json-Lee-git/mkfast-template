import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container";
import { ToolCard } from "@/components/ai-visibility/tool-card";
import { ComparisonTable } from "@/components/ai-visibility/comparison-table";
import { FAQ } from "@/components/ai-visibility/faq";
import { tools, getToolBySlug, getRelatedTools } from "@/data/tools";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) => {
    const tool = getToolBySlug(params.slug);
    if (!tool) return seo("/tools", { title: "Tool Not Found", description: "" });
    return seo(`/tools/${tool.slug}`, {
      title: `${tool.name} Review — Features, Pricing & Alternatives (2026)`,
      description: tool.shortDescription,
    });
  },
  component: ToolDetailPage,
});

function ToolDetailPage() {
  const { slug } = Route.useParams();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-100">Tool not found</h1>
        <a href="/best-ai-visibility-tools" className="mt-4 inline-block text-blue-400 hover:text-blue-300">← Back to all tools</a>
      </Container>
    );
  }

  const relatedTools = getRelatedTools(tool, 3);

  const detailFAQ = [
    { q: `What is ${tool.name}?`, a: tool.longDescription },
    { q: `How much does ${tool.name} cost?`, a: tool.pricingNotes },
    { q: `Does ${tool.name} have a free plan?`, a: tool.hasFreePlan ? `Yes, ${tool.name} offers a free plan.` : `No, ${tool.name} does not have a free plan.` },
    { q: `What platforms does ${tool.name} support?`, a: `${tool.name} supports: ${tool.platforms.join(", ")}.` },
  ];

  const overviewCols = [
    { key: "name", label: "Tool" },
    { key: "startingPrice", label: "Starting Price" },
    { key: "platforms", label: "Platforms" },
    { key: "bestFor", label: "Best For" },
  ];

  return (
    <div>
      <section className="border-b border-zinc-800 py-16">
        <Container>
          <a href="/best-ai-visibility-tools" className="text-sm text-blue-400 hover:text-blue-300">← Back to all tools</a>
          <h1 className="mt-4 text-3xl font-bold text-zinc-100">{tool.name}</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">{tool.longDescription}</p>
        </Container>
      </section>

      <section className="py-8"><Container><ComparisonTable tools={[tool]} cols={overviewCols} title="Overview" /></Container></section>

      <section className="border-t border-zinc-800 py-8">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Key Features</h2>
              <ul className="mt-4 space-y-2">
                {tool.keyFeatures.map((f) => (<li key={f} className="text-sm text-zinc-400">• {f}</li>))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Best For</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.bestFor.map((b) => (<span key={b} className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{b}</span>))}
              </div>
              <h2 className="mt-6 text-xl font-bold text-zinc-100">Supported Platforms</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.platforms.map((p) => (<span key={p} className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{p}</span>))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-800 py-8">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Pros</h2>
              <ul className="mt-4 space-y-2">
                {tool.pros.map((p) => (<li key={p} className="text-sm text-emerald-400">✓ {p}</li>))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Cons</h2>
              <ul className="mt-4 space-y-2">
                {tool.cons.map((c) => (<li key={c} className="text-sm text-red-400">✗ {c}</li>))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-800 py-8">
        <Container>
          <h2 className="text-xl font-bold text-zinc-100">Pricing</h2>
          <p className="mt-2 text-zinc-400">{tool.pricingNotes}</p>
          <p className="mt-2 text-xs text-zinc-500">Pricing and feature information may change. Always verify details on the vendor's official website before making a purchase.</p>
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors">Visit {tool.name} Website →</a>
        </Container>
      </section>

      {relatedTools.length > 0 && (
        <section className="border-t border-zinc-800 py-8">
          <Container>
            <h2 className="text-xl font-bold text-zinc-100">Alternatives</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {relatedTools.map((rt) => (<ToolCard key={rt.slug} tool={rt} />))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-zinc-800 py-8">
        <Container><div className="mx-auto max-w-2xl"><h2 className="text-xl font-bold text-zinc-100">FAQ</h2><FAQ items={detailFAQ} className="mt-6" /></div></Container>
      </section>
    </div>
  );
}

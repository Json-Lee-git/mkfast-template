import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/layout/container";
import { FAQ } from "@/components/ai-visibility/faq";
import { getGlossaryTerm } from "@/data/glossary";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/glossary/$slug")({
  head: ({ params }) => {
    const term = getGlossaryTerm(params.slug);
    if (!term) return seo("/glossary", { title: "Not Found", description: "" });
    return seo(`/glossary/${term.slug}`, {
      title: `${term.term} — Definition & Why It Matters for AI Search`,
      description: `${term.term}: ${term.definition.slice(0, 150)}...`,
    });
  },
  component: GlossaryPage,
});

function GlossaryPage() {
  const { slug } = Route.useParams();
  const term = getGlossaryTerm(slug);

  if (!term) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-100">Glossary term not found</h1>
        <a href="/" className="mt-4 inline-block text-blue-400">← Home</a>
      </Container>
    );
  }

  const faq = [
    { q: `What is ${term.term}?`, a: term.definition },
    { q: `Why does ${term.term.toLowerCase()} matter?`, a: term.whyItMatters },
    { q: `How is ${term.term.toLowerCase()} measured?`, a: term.howMeasured },
  ];

  return (
    <div>
      <section className="border-b border-zinc-800 py-16">
        <Container>
          <a href="/" className="text-sm text-blue-400 hover:text-blue-300">← Home</a>
          <h1 className="mt-4 text-3xl font-bold text-zinc-100">{term.term}</h1>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="mx-auto max-w-2xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Definition</h2>
              <p className="mt-2 leading-relaxed text-zinc-400">{term.definition}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Why It Matters</h2>
              <p className="mt-2 leading-relaxed text-zinc-400">{term.whyItMatters}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">How It Is Measured</h2>
              <p className="mt-2 leading-relaxed text-zinc-400">{term.howMeasured}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Related Tools</h2>
              <p className="mt-2 text-zinc-400">
                <a href="/best-ai-visibility-tools" className="text-blue-400 hover:text-blue-300">Browse AI visibility tools →</a>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-100">Related Pages</h2>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href="/best-ai-visibility-tools" className="text-blue-400 hover:text-blue-300 text-sm">Best AI Visibility Tools</a>
                <span className="text-zinc-700">·</span>
                <a href="/ai-visibility-checker" className="text-blue-400 hover:text-blue-300 text-sm">Free AI Visibility Checker</a>
                <span className="text-zinc-700">·</span>
                <a href="/ai-visibility-tools-pricing" className="text-blue-400 hover:text-blue-300 text-sm">Pricing Comparison</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-800 py-8">
        <Container><div className="mx-auto max-w-2xl"><FAQ items={faq} /></div></Container>
      </section>
    </div>
  );
}

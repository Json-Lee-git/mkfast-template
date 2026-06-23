import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { ToolCard } from '@/components/ai-visibility/tool-card';
import { ComparisonTable } from '@/components/ai-visibility/comparison-table';
import { FAQ } from '@/components/ai-visibility/faq';
import { tools } from '@/data/tools';
import { seo } from '@/lib/seo';

const bestToolsFAQ = [
  { q: "What are AI visibility tools?", a: "AI visibility tools monitor brand mentions across AI search platforms like ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews. They help you understand how your brand appears in AI-generated responses." },
  { q: "How do AI visibility tools work?", a: "They query AI platforms at regular intervals using brand-related prompts, analyze the responses for mentions, sentiment, and ranking, and compile the data into dashboards and reports." },
  { q: "Do I need an AI visibility tool?", a: "If your target audience uses AI platforms for product discovery, yes. AI visibility directly impacts whether potential customers learn about your brand through AI search." },
  { q: "Are there free AI visibility checkers?", a: "Yes, several tools offer free plans or free checkers including Otterly AI, OmniSEO, LLMrefs, and Peec AI." },
  { q: "Which AI platforms should I track?", a: "Start with ChatGPT (largest user base) and Google AI Overviews (directly affects organic traffic). Add Perplexity, Gemini, and Claude as needed." },
];

export const Route = createFileRoute('/best-ai-visibility-tools')({
  head: () => seo('/best-ai-visibility-tools', {
    title: 'Best AI Visibility Tools — Compare AI Search Visibility & LLM Tracking Tools (2026)',
    description: 'Compare the best AI visibility tools for monitoring brand mentions in ChatGPT, Perplexity, Gemini and Google AI Overviews. Pricing, features, free plans, and expert reviews.',
  }),
  component: BestToolsPage,
});

function BestToolsPage() {
  const cols = [
    { key: 'name', label: 'Tool' },
    { key: 'startingPrice', label: 'Starting Price' },
    { key: 'platforms', label: 'Platforms' },
    { key: 'bestFor', label: 'Best For' },
    { key: 'websiteUrl', label: 'Website' },
  ];

  return (
    <div>
      <section className="border-b border-zinc-800 py-16">
        <Container>
          <h1 className="text-3xl font-bold text-zinc-100">Best AI Visibility Tools</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">Compare the top AI visibility tools for monitoring brand presence across ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews. Find the right tool for your budget and needs.</p>
        </Container>
      </section>

      <section className="py-12"><Container><ComparisonTable tools={tools} cols={cols} title="Quick Comparison" /></Container></section>

      <section className="border-t border-zinc-800 py-12">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-100">All Tools</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (<ToolCard key={tool.slug} tool={tool} />))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-800 py-12">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-100">Best For Different Use Cases</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Best for Agencies", tool: "Otterly AI", desc: "Automated reports, competitor comparison, and white-label options." },
              { title: "Best Free Plan", tool: "OmniSEO", desc: "Free plan includes 5 tracked keywords with browser extension." },
              { title: "Best for Enterprise", tool: "Profound", desc: "Six-platform coverage with API access and white-label reporting." },
              { title: "Best Budget Pick", tool: "Peec AI", desc: "Starts at $39/month with sentiment analysis and easy setup." },
              { title: "Best for Developers", tool: "LLMrefs", desc: "API-first architecture with webhook notifications." },
              { title: "Most Platforms", tool: "Scrunch AI", desc: "Full six-platform coverage with sentiment analysis." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-zinc-800 p-5">
                <span className="text-xs text-zinc-500">{item.title}</span>
                <h3 className="mt-1 font-semibold text-zinc-200">{item.tool}</h3>
                <p className="mt-1 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-800 py-12">
        <Container><div className="mx-auto max-w-2xl"><h2 className="text-2xl font-bold text-zinc-100">FAQ</h2><FAQ items={bestToolsFAQ} className="mt-6" /></div></Container>
      </section>
    </div>
  );
}

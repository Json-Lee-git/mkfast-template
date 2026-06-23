import Container from "@/components/layout/container";
import { ToolCard } from "@/components/ai-visibility/tool-card";
import { FAQ } from "@/components/ai-visibility/faq";
import { tools } from "@/data/tools";

const featuredTools = tools.slice(0, 6);

const homeFAQ = [
  {
    q: "What is AI visibility?",
    a: "AI visibility refers to how often and in what context your brand appears in AI-powered search results and language model responses (ChatGPT, Perplexity, Gemini, etc.). As more users rely on AI for product research and discovery, AI visibility directly impacts your brand's reach and purchase influence.",
  },
  {
    q: "How do I track my brand in ChatGPT?",
    a: "AI visibility tools like Otterly AI, Peec AI, and Profound monitor ChatGPT and other AI platforms for brand mentions. They track how often your brand appears, in what context, and how you compare to competitors. Most offer free plans or free checkers to get started.",
  },
  {
    q: "Which AI visibility tool should I choose?",
    a: "It depends on your needs. Solo marketers and startups often start with Peec AI ($39/mo) or OmniSEO ($29/mo). Agencies favor Otterly AI ($49/mo). Enterprises go with Profound ($79/mo). Use our comparison pages to find the right fit.",
  },
  {
    q: "Is there a free AI visibility checker?",
    a: "Yes, several tools offer free checkers or free plans. OmniSEO, LLMrefs, Otterly AI, and Peec AI all have free tiers. We also offer a free AI visibility checker on this site that collects your brand info and prepares a sample report.",
  },
];

export function AIHomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-zinc-800 py-20">
        <Container className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
            Find the Best AI Visibility Tools for Your Brand
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Compare tools that help you monitor brand mentions, citations and rankings across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/best-ai-visibility-tools"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
            >
              Compare AI Visibility Tools
            </a>
            <a
              href="/ai-visibility-checker"
              className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Try Free AI Visibility Checker
            </a>
          </div>
        </Container>
      </section>

      {/* Featured Tools */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-100">Featured AI Visibility Tools</h2>
          <p className="mt-2 text-zinc-400">Top tools for tracking brand presence across AI search platforms.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="/best-ai-visibility-tools" className="text-sm text-blue-400 hover:text-blue-300">
              View all 10 tools →
            </a>
          </div>
        </Container>
      </section>

      {/* What is AI visibility */}
      <section className="border-t border-zinc-800 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-100">What Is AI Visibility?</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            AI visibility measures how your brand appears in AI-powered search platforms like ChatGPT, Perplexity, 
            Gemini, Claude, and Google AI Overviews. Unlike traditional SEO that tracks keyword rankings in search 
            engines, AI visibility tracking reveals whether AI models mention, recommend, or cite your brand in their 
            responses. As AI becomes the primary way people discover products and information, understanding your AI 
            visibility is essential for maintaining competitive advantage.
          </p>
        </Container>
      </section>

      {/* Use cases */}
      <section className="border-t border-zinc-800 py-16">
        <Container>
          <h2 className="text-2xl font-bold text-zinc-100">Use Cases</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Brand Monitoring", desc: "Track when and how your brand appears in AI-generated answers across multiple platforms." },
              { title: "Competitor Intelligence", desc: "Compare your AI visibility against competitors and identify opportunities." },
              { title: "Content Strategy", desc: "Optimize content for AI platforms and improve your chances of being cited by language models." },
              { title: "Agency Reporting", desc: "Generate AI visibility reports for clients alongside traditional SEO metrics." },
              { title: "Reputation Management", desc: "Monitor brand mentions for sentiment and accuracy in AI responses." },
              { title: "Market Research", desc: "Understand which AI platforms drive discovery in your industry." },
            ].map((uc) => (
              <div key={uc.title} className="rounded-lg border border-zinc-800 p-5">
                <h3 className="font-semibold text-zinc-200">{uc.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{uc.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 py-16">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100">Ready to Start Tracking?</h2>
          <p className="mt-2 text-zinc-400">Try our free AI visibility checker or compare tools to find your best fit.</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="/ai-visibility-checker" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors">
              Free AI Visibility Checker
            </a>
            <a href="/best-ai-visibility-tools" className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
              Compare Tools
            </a>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-800 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-zinc-100">Frequently Asked Questions</h2>
            <FAQ items={homeFAQ} className="mt-6" />
          </div>
        </Container>
      </section>
    </div>
  );
}

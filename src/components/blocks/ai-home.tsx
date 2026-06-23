import Container from "@/components/layout/container";
import { ToolCard } from "@/components/ai-visibility/tool-card";
import { FAQ } from "@/components/ai-visibility/faq";
import { tools } from "@/data/tools";
import { IconSearch, IconChartBar, IconBulb, IconUsers, IconArrowRight } from "@tabler/icons-react";

const featuredTools = tools.slice(0, 6);

const homeFAQ = [
  { q: "What is AI visibility?", a: "AI visibility refers to how often and in what context your brand appears in AI-powered search results and language model responses (ChatGPT, Perplexity, Gemini, etc.). As more users rely on AI for product research and discovery, AI visibility directly impacts your brand's reach and purchase influence." },
  { q: "How do I track my brand in ChatGPT?", a: "AI visibility tools like Otterly AI, Peec AI, and Profound monitor ChatGPT and other AI platforms for brand mentions. They track how often your brand appears, in what context, and how you compare to competitors. Most offer free plans or free checkers to get started." },
  { q: "Which AI visibility tool should I choose?", a: "It depends on your needs. Solo marketers and startups often start with Peec AI ($39/mo) or OmniSEO ($29/mo). Agencies favor Otterly AI ($49/mo). Enterprises go with Profound ($79/mo). Use our comparison table to find the right fit." },
  { q: "Is there a free AI visibility checker?", a: "Yes. Otterly AI, OmniSEO, LLMrefs, and Peec AI all offer free tiers. We also host a free AI visibility checker on this site - submit your brand info and we will send you a sample report." },
];

const features = [
  { icon: IconSearch, title: "Compare 10+ Tools", desc: "Side-by-side comparisons of pricing, platform coverage, features, and best use cases." },
  { icon: IconChartBar, title: "Free Visibility Checker", desc: "Submit your brand details and get a sample AI visibility report format via email." },
  { icon: IconBulb, title: "Expert Analysis", desc: "Pros, cons, and honest recommendations for each tool - no sponsored rankings." },
  { icon: IconUsers, title: "Built for Marketers", desc: "SEO professionals, content marketers, and agency teams comparing AI visibility tools." },
];

export function AIHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <Container className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-300 dark:border-zinc-700/50 bg-gray-100 dark:bg-zinc-900/50 px-4 py-1.5 text-sm text-gray-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Updated June 2026
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              Find the Best{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                AI Visibility Tools
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Compare tools for monitoring brand mentions across ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews. Free checkers, pricing, and honest reviews.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="/best-ai-visibility-tools" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200">
                Compare Tools <IconArrowRight size={16} />
              </a>
              <a href="/ai-visibility-checker" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-gray-400 dark:border-zinc-600 hover:bg-gray-200 dark:bg-zinc-800/50 active:scale-[0.98]">
                Free AI Visibility Checker
              </a>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/30 p-6 transition-all hover:border-gray-300 dark:border-zinc-700 hover:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-gray-800 dark:text-zinc-200">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Tools */}
      <section className="border-t border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Featured AI Visibility Tools</h2>
              <p className="mt-2 text-gray-500 dark:text-zinc-400">Hand-picked tools for tracking brand presence across AI search.</p>
            </div>
            <a href="/best-ai-visibility-tools" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-300 transition-colors">
              View all 10 tools <IconArrowRight size={14} />
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <a href="/best-ai-visibility-tools" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-300">View all 10 tools →</a>
          </div>
        </Container>
      </section>

      {/* What is AI visibility */}
      <section className="border-t border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">What Is AI Visibility?</h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              AI visibility measures how your brand appears in AI-powered search platforms. Unlike traditional SEO that tracks keyword rankings, AI visibility tracking reveals whether AI models mention, recommend, or cite your brand in their responses. As AI becomes the primary way people discover products and information, monitoring your AI visibility is essential for staying competitive.
            </p>
          </div>
        </Container>
      </section>

      {/* Use cases */}
      <section className="border-t border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">Use Cases</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Brand Monitoring", desc: "Track when and how your brand appears in AI-generated answers across multiple platforms." },
              { title: "Competitor Intelligence", desc: "Compare your AI visibility against competitors and identify gaps." },
              { title: "Content Strategy", desc: "Optimize content for AI platforms to improve your chances of being cited." },
              { title: "Agency Reporting", desc: "Generate AI visibility reports for clients alongside traditional SEO metrics." },
              { title: "Reputation Management", desc: "Monitor brand mentions for sentiment and accuracy in AI responses." },
              { title: "Market Research", desc: "Understand which AI platforms drive discovery in your industry." },
            ].map((uc) => (
              <div key={uc.title} className="rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/20 p-6 transition-colors hover:border-gray-300 dark:border-zinc-700">
                <h3 className="font-semibold text-gray-800 dark:text-zinc-200">{uc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-zinc-400">{uc.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-950/40 dark:via-zinc-900 dark:to-zinc-950 px-8 py-14 text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl" />
            <h2 className="relative text-2xl font-bold text-gray-900 dark:text-zinc-100">Ready to Start Tracking?</h2>
            <p className="relative mt-3 text-gray-500 dark:text-zinc-400">Try our free AI visibility checker or compare tools to find your best fit.</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <a href="/ai-visibility-checker" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200">
                Free AI Visibility Checker <IconArrowRight size={16} />
              </a>
              <a href="/best-ai-visibility-tools" className="inline-flex items-center gap-2 rounded-xl border border-gray-400 dark:border-zinc-600 bg-gray-200 dark:bg-zinc-800/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 transition-all hover:border-zinc-500 active:scale-[0.98]">
                Compare Tools
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">Frequently Asked Questions</h2>
            <FAQ items={homeFAQ} className="mt-8" />
          </div>
        </Container>
      </section>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}

export type ToolComparison = {
  slug: string;
  toolA: string;
  toolB: string;
  title: string;
  metaDescription: string;
  summary: string;
  pricingSummary: string;
  featureSummary: string;
  bestForToolA: string[];
  bestForToolB: string[];
  recommendationShort: string;
  recommendationDetail: string;
};

export const comparisons: ToolComparison[] = [
  {
    slug: "otterly-vs-peec-ai",
    toolA: "otterly-ai",
    toolB: "peec-ai",
    title: "Otterly AI vs Peec AI — Which AI Visibility Tool Is Right for You?",
    metaDescription:
      "Compare Otterly AI and Peec AI on price, features, platform coverage, and best use cases. Find the right AI visibility tracker for brand monitoring across ChatGPT and LLMs.",
    summary:
      "Otterly AI and Peec AI both offer AI visibility monitoring for brands, but they serve different audiences. Otterly leans toward agencies and reporting workflows, while Peec AI targets startups and solo marketers with simpler, more affordable tooling.",
    pricingSummary:
      "Otterly starts at $49/month with a free plan for 10 keywords. Peec AI starts at $39/month, also with a free tier. Both offer 14-day trials on paid plans. Otterly's enterprise plan is more expensive but includes advanced reporting features.",
    featureSummary:
      "Both tools cover ChatGPT, Perplexity, and Gemini. Otterly adds Google AI Overviews support. Otterly has stronger competitor comparison and reporting features, while Peec AI offers sentiment analysis that Otterly lacks.",
    bestForToolA: ["Agencies managing multiple clients", "Teams needing automated reports", "Competitor analysis"],
    bestForToolB: ["Startups and small teams", "Solo SEO professionals", "Teams wanting sentiment analysis"],
    recommendationShort: "Choose Otterly for agency work; Peec AI for solo or small team use.",
    recommendationDetail:
      "If you manage multiple client brands and need polished, automated reports to share with stakeholders, Otterly AI is the better investment. If you're a solo marketer or small startup that needs straightforward monitoring at a lower price point, Peec AI delivers excellent value with less complexity.",
  },
  {
    slug: "peec-ai-vs-profound",
    toolA: "peec-ai",
    toolB: "profound",
    title: "Peec AI vs Profound — Startup-Friendly or Enterprise-Grade AI Visibility?",
    metaDescription:
      "Peec AI vs Profound: Compare pricing, platform coverage, and features for AI visibility monitoring. Startup-friendly or enterprise-grade?",
    summary:
      "Peec AI and Profound sit at opposite ends of the AI visibility market. Peec AI is built for accessibility and ease of use at an affordable price. Profound is an enterprise-grade platform with the most comprehensive AI platform coverage on the market.",
    pricingSummary:
      "Peec AI is the clear budget winner at $39/month (Starter) vs Profound at $79/month (Professional). Peec offers a free plan; Profound does not. But Profound's higher price includes significantly more platform coverage and advanced analytics.",
    featureSummary:
      "Profound covers all six major AI platforms (ChatGPT, Perplexity, Gemini, Claude, Copilot, Google AI Overviews) versus Peec AI's four. Profound offers API access, white-label reporting, and historical trend analysis. Peec AI counters with simpler setup and sentiment analysis.",
    bestForToolA: ["Budget-conscious teams", "Quick setup needs", "Simple brand monitoring"],
    bestForToolB: ["Enterprise requirements", "Multi-platform tracking", "API and data integration needs"],
    recommendationShort: "Peec AI for getting started quickly; Profound for serious, multi-platform monitoring.",
    recommendationDetail:
      "Peec AI is the right choice if you need to get AI visibility monitoring set up quickly with minimal cost and complexity. Profound justifies its higher price for organizations that need comprehensive six-platform coverage, API access for data pipelines, and white-label reporting for client delivery.",
  },
  {
    slug: "semrush-vs-ahrefs-ai-visibility",
    toolA: "semrush-ai-visibility",
    toolB: "ahrefs-ai-visibility-checker",
    title: "Semrush vs Ahrefs AI Visibility — Which SEO Giant Does AI Search Better?",
    metaDescription:
      "Semrush AI Visibility Toolkit vs Ahrefs Brand Radar: compare AI search monitoring features from the two biggest SEO platforms.",
    summary:
      "Both Semrush and Ahrefs have added AI visibility features to their SEO platforms. Semrush covers more AI platforms (3 vs 2), but Ahrefs' Brand Radar benefits from its world-class backlink data. For existing users of either platform, the choice is often made by which ecosystem you're already in.",
    pricingSummary:
      "Semrush starts at $139.95/month for the Guru plan (includes AI visibility). Ahrefs starts at $129/month for the Standard plan (includes Brand Radar). Pricing is very close, with Semrush being slightly more expensive but offering broader AI platform coverage.",
    featureSummary:
      "Semrush tracks ChatGPT, Google AI Overviews, and Gemini. Ahrefs covers ChatGPT and Google AI Overviews. Semrush offers more AI platform coverage; Ahrefs offers better backlink correlation data. Both integrate with their respective SEO dashboards and reporting.",
    bestForToolA: ["Existing Semrush users", "Teams needing Gemini tracking", "Combined SEO + AI reporting"],
    bestForToolB: ["Existing Ahrefs users", "Backlink-focused SEO teams", "Content gap analysis for AI search"],
    recommendationShort: "Stick with the SEO platform you already use. If choosing fresh, Semrush has more AI platform coverage.",
    recommendationDetail:
      "If you're already paying for Semrush or Ahrefs, use the AI visibility features built into your existing subscription. If you're choosing between them specifically for AI visibility, Semrush's three-platform coverage (vs Ahrefs' two) gives it an edge, though Ahrefs' backlink-AI correlation is uniquely valuable for link-focused SEO strategies.",
  },
  {
    slug: "otterly-vs-profound",
    toolA: "otterly-ai",
    toolB: "profound",
    title: "Otterly AI vs Profound — Mid-Market or Enterprise AI Visibility?",
    metaDescription:
      "Otterly AI vs Profound: compare two leading AI visibility tools on platform coverage, pricing, features, and ideal use cases.",
    summary:
      "Otterly AI and Profound compete in the AI visibility space but target different segments. Otterly is the mid-market leader with strong agency features at a reasonable price. Profound aims higher with enterprise-grade analytics, broader platform coverage, and API access.",
    pricingSummary:
      "Otterly starts at $49/month with a free plan. Profound starts at $79/month with no free tier. For small to mid-size teams, Otterly's pricing is more accessible. For enterprise needs requiring API and white-label features, Profound's higher price is justified.",
    featureSummary:
      "Otterly covers 4 platforms; Profound covers 6. Both offer competitor tracking and automated reporting. Profound adds API access, white-label reporting, and historical trend analysis. Otterly has a cleaner UX and faster onboarding.",
    bestForToolA: ["Mid-size agencies", "Teams wanting free tier access", "Faster onboarding"],
    bestForToolB: ["Enterprise organizations", "API integration requirements", "White-label reporting needs"],
    recommendationShort: "Otterly for most teams; Profound when you need enterprise features and maximum platform coverage.",
    recommendationDetail:
      "Otterly AI hits the sweet spot for most marketing teams and agencies — strong features, reasonable pricing, and a free plan to get started. Move to Profound when you need six-platform coverage, API access for custom data pipelines, or white-label reports for client delivery at scale.",
  },
];

export function getComparisonBySlug(slug: string): ToolComparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getRelatedComparisons(comparison: ToolComparison, count = 2): ToolComparison[] {
  return comparisons
    .filter((c) => c.slug !== comparison.slug)
    .slice(0, count);
}

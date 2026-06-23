export type AITool = {
  name: string;
  slug: string;
  websiteUrl: string;
  startingPrice: string;
  hasFreePlan: boolean;
  hasFreeChecker: boolean;
  platforms: string[];
  bestFor: string[];
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  pricingNotes: string;
  shortDescription: string;
  longDescription: string;
  category: string[];
  lastUpdated: string;
};

export const tools: AITool[] = [
  {
    name: "Otterly AI",
    slug: "otterly-ai",
    websiteUrl: "https://otterly.ai",
    startingPrice: "$49/month",
    hasFreePlan: true,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Google AI Overviews", "Perplexity", "Gemini"],
    bestFor: ["Brand monitoring", "Competitor tracking", "Agency reporting"],
    keyFeatures: [
      "Real-time brand mention monitoring",
      "Competitor visibility comparison",
      "AI search result tracking",
      "Automated weekly reports",
      "Keyword position tracking across AI platforms",
    ],
    pros: ["Clean, intuitive dashboard", "Strong competitor comparison", "Regular platform updates"],
    cons: ["Limited historical data in lower plans", "No API access on starter plan"],
    pricingNotes:
      "Free plan includes 10 tracked keywords. Pro starts at $49/mo. Enterprise custom pricing available.",
    shortDescription:
      "Monitor your brand's visibility across ChatGPT, Perplexity, Gemini and Google AI Overviews with automated tracking and reports.",
    longDescription:
      "Otterly AI helps marketing teams and agencies monitor brand mentions across major AI search platforms. Track how your brand appears in ChatGPT, Perplexity, Gemini and Google AI Overviews. Compare your visibility against competitors, identify trends, and receive automated reports to share with stakeholders.",
    category: ["AI Visibility", "Brand Monitoring", "SEO"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Peec AI",
    slug: "peec-ai",
    websiteUrl: "https://peec.ai",
    startingPrice: "$39/month",
    hasFreePlan: true,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Perplexity", "Gemini", "Claude"],
    bestFor: ["Startups", "Content marketers", "Solo SEO professionals"],
    keyFeatures: [
      "Brand mention detection across LLMs",
      "Sentiment analysis for AI responses",
      "Competitor benchmarking",
      "Email alerts for mention changes",
      "CSV export for reporting",
    ],
    pros: ["Affordable entry price", "Simple setup process", "Good for small teams"],
    cons: ["Fewer supported platforms than competitors", "Limited enterprise features"],
    pricingNotes:
      "Starter plan at $39/mo. Growth at $79/mo. 14-day free trial on all plans.",
    shortDescription:
      "Track your brand's presence in AI-powered search results with Peec AI's straightforward monitoring and alerting tools.",
    longDescription:
      "Peec AI provides accessible AI visibility monitoring for startups and small marketing teams. Detect when and how your brand appears in LLM responses, track sentiment trends, and benchmark against competitors. Simple setup, clear alerts, and exportable data make it easy to integrate AI visibility into your existing workflow.",
    category: ["AI Visibility", "Brand Monitoring"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Profound",
    slug: "profound",
    websiteUrl: "https://www.tryprofound.com",
    startingPrice: "$79/month",
    hasFreePlan: false,
    hasFreeChecker: false,
    platforms: ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews", "Claude", "Copilot"],
    bestFor: ["Enterprise", "Agencies", "Large marketing teams"],
    keyFeatures: [
      "Multi-platform AI visibility tracking",
      "Advanced competitive intelligence",
      "Custom dashboard and reporting",
      "API access for data integration",
      "Historical trend analysis",
      "White-label reporting",
    ],
    pros: ["Most comprehensive platform coverage", "Powerful API and integrations", "Enterprise-grade reporting"],
    cons: ["Higher price point", "Steeper learning curve", "No free plan"],
    pricingNotes:
      "Professional at $79/mo. Team at $199/mo. Enterprise custom pricing. No free plan, but demo available.",
    shortDescription:
      "Enterprise-grade AI visibility tracking across six major platforms with advanced analytics, API access, and white-label reporting.",
    longDescription:
      "Profound is the enterprise choice for AI visibility monitoring. Track brand mentions across ChatGPT, Perplexity, Gemini, Claude, Copilot, and Google AI Overviews from a single dashboard. Advanced competitive intelligence, API access for custom integrations, and white-label reporting make it ideal for agencies and large marketing organizations.",
    category: ["AI Visibility", "Brand Monitoring", "Enterprise"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Semrush AI Visibility Toolkit",
    slug: "semrush-ai-visibility",
    websiteUrl: "https://www.semrush.com",
    startingPrice: "$139.95/month",
    hasFreePlan: false,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Google AI Overviews", "Gemini"],
    bestFor: ["SEO professionals", "Digital agencies", "Existing Semrush users"],
    keyFeatures: [
      "AI Overview tracking in Semrush dashboard",
      "Brand monitoring across AI search",
      "Integration with existing Semrush projects",
      "Competitive AI visibility analysis",
      "Combined SEO + AI visibility reporting",
    ],
    pros: ["Integrated with full Semrush SEO suite", "Massive keyword and competitor database", "Trusted brand"],
    cons: ["Expensive if you only need AI visibility", "Requires Semrush subscription", "Limited platforms"],
    pricingNotes:
      "Requires Semrush subscription starting at $139.95/mo. AI visibility features included in Guru and Business plans.",
    shortDescription:
      "Semrush AI Visibility Toolkit adds AI search monitoring to the Semrush platform, combining traditional SEO with LLM visibility tracking.",
    longDescription:
      "Semrush brings AI visibility tracking into its comprehensive SEO platform. Existing Semrush users can monitor brand appearances in ChatGPT, Google AI Overviews, and Gemini alongside traditional search rankings. The unified dashboard makes it easy to correlate AI visibility with organic search performance.",
    category: ["AI Visibility", "SEO", "Enterprise"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Ahrefs AI Visibility Checker",
    slug: "ahrefs-ai-visibility-checker",
    websiteUrl: "https://ahrefs.com",
    startingPrice: "$129/month",
    hasFreePlan: false,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Google AI Overviews"],
    bestFor: ["SEO professionals", "Content marketers", "Existing Ahrefs users"],
    keyFeatures: [
      "Brand Radar for AI mention detection",
      "AI Overview presence monitoring",
      "Content gap analysis for AI search",
      "Backlink + AI visibility correlation",
      "Automated alerts",
    ],
    pros: ["World-class backlink data integration", "Reliable platform", "Strong educational resources"],
    cons: ["Limited to 2 AI platforms currently", "Expensive standalone", "AI visibility features still maturing"],
    pricingNotes:
      "Requires Ahrefs subscription starting at $129/mo. Brand Radar available on Standard plan and above.",
    shortDescription:
      "Ahrefs Brand Radar helps you monitor AI search visibility alongside traditional SEO metrics in the Ahrefs platform.",
    longDescription:
      "Ahrefs Brand Radar brings AI visibility monitoring to the Ahrefs ecosystem. Track brand mentions in ChatGPT and Google AI Overviews, correlate AI visibility with your backlink profile, and identify content gaps for AI-powered search. Best suited for existing Ahrefs users who want AI visibility data alongside their SEO workflows.",
    category: ["AI Visibility", "SEO"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "SE Ranking AI Visibility",
    slug: "se-ranking-ai-visibility",
    websiteUrl: "https://seranking.com",
    startingPrice: "$55/month",
    hasFreePlan: false,
    hasFreeChecker: false,
    platforms: ["ChatGPT", "Google AI Overviews", "Gemini"],
    bestFor: ["Small to medium agencies", "Freelance SEOs", "Budget-conscious teams"],
    keyFeatures: [
      "AI visibility tracking dashboard",
      "Competitor AI presence monitoring",
      "White-label client reporting",
      "Scheduled automated reports",
      "Multi-location tracking",
    ],
    pros: ["Competitive pricing", "Strong white-label features", "Good for client reporting"],
    cons: ["Smaller platform coverage than leaders", "Less brand recognition"],
    pricingNotes:
      "Essential at $55/mo. Pro at $109/mo. Business at $239/mo. AI visibility features on Pro and above.",
    shortDescription:
      "Affordable AI visibility tracking with white-label reporting, ideal for agencies managing client brands across AI search platforms.",
    longDescription:
      "SE Ranking offers AI visibility monitoring as part of its all-in-one SEO platform at competitive price points. Track brand mentions in ChatGPT, Google AI Overviews, and Gemini. White-label reporting makes it particularly attractive for agencies managing multiple client accounts.",
    category: ["AI Visibility", "SEO", "Agency"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Frase AI Visibility",
    slug: "frase-ai-visibility",
    websiteUrl: "https://www.frase.io",
    startingPrice: "$14.99/month",
    hasFreePlan: false,
    hasFreeChecker: false,
    platforms: ["ChatGPT", "Google AI Overviews"],
    bestFor: ["Content marketers", "Small teams", "Content-first organizations"],
    keyFeatures: [
      "Content optimization for AI search",
      "AI answer engine analysis",
      "Topic research with AI visibility data",
      "Content brief generation",
      "Competitor content analysis",
    ],
    pros: ["Very affordable entry point", "Strong content optimization features", "Good for content-first teams"],
    cons: ["AI visibility features are secondary", "Limited platform support", "Not a dedicated tracker"],
    pricingNotes:
      "Solo at $14.99/mo. Basic at $44.99/mo. Team at $114.99/mo. AI features available on all plans.",
    shortDescription:
      "Frase combines content optimization with AI visibility insights, helping content teams create material that performs in AI-powered search.",
    longDescription:
      "Frase approaches AI visibility from a content-first perspective. Rather than just tracking mentions, it helps content teams understand what AI answer engines are looking for and optimize content accordingly. Topic research, content briefs, and competitor analysis are enriched with AI visibility data.",
    category: ["AI Visibility", "Content Marketing"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "OmniSEO",
    slug: "omniseo",
    websiteUrl: "https://www.omniseo.ai",
    startingPrice: "$29/month",
    hasFreePlan: true,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews"],
    bestFor: ["Startups", "Small businesses", "Freelancers"],
    keyFeatures: [
      "AI search visibility dashboard",
      "Keyword opportunity finder for AI platforms",
      "Competitor AI presence analysis",
      "Weekly trend reports",
      "Browser extension for quick checks",
    ],
    pros: ["Very affordable", "Free plan available", "Easy to use browser extension"],
    cons: ["Smaller company, less established", "Limited enterprise features", "Newer platform"],
    pricingNotes:
      "Free plan includes 5 tracked keywords. Starter at $29/mo. Growth at $59/mo.",
    shortDescription:
      "Budget-friendly AI visibility tracking with a free plan, browser extension, and keyword opportunity finder for startups and small businesses.",
    longDescription:
      "OmniSEO makes AI visibility tracking accessible to startups and small businesses with a generous free plan and affordable paid tiers. Monitor brand mentions in ChatGPT, Perplexity, Gemini, and Google AI Overviews. The browser extension enables quick visibility checks while browsing. A good starting point for teams new to AI search visibility monitoring.",
    category: ["AI Visibility", "Startup"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "LLMrefs",
    slug: "llmrefs",
    websiteUrl: "https://llmrefs.com",
    startingPrice: "$25/month",
    hasFreePlan: true,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Perplexity", "Gemini", "Claude"],
    bestFor: ["Developers", "Technical founders", "API-first teams"],
    keyFeatures: [
      "API-first AI visibility tracking",
      "Programmatic brand mention queries",
      "Webhook notifications",
      "Developer-friendly documentation",
      "Custom metric dashboards",
    ],
    pros: ["Developer-friendly API", "Affordable pricing", "Good for custom integrations"],
    cons: ["Less polished UI than competitors", "Smaller team", "No agency/white-label features"],
    pricingNotes:
      "Free plan includes 10 API queries/day. Hacker at $25/mo. Startup at $75/mo.",
    shortDescription:
      "Developer-focused AI visibility tracking with API-first architecture, webhook notifications, and programmatic brand mention queries.",
    longDescription:
      "LLMrefs takes a developer-first approach to AI visibility tracking. Query brand mentions programmatically via API, set up webhook notifications for mention changes, and build custom dashboards with your own metrics. Ideal for technical founders and development teams who want to integrate AI visibility data into their existing toolchain.",
    category: ["AI Visibility", "Developer Tools", "API"],
    lastUpdated: "2026-06-20",
  },
  {
    name: "Scrunch AI",
    slug: "scrunch-ai",
    websiteUrl: "https://scrunch.ai",
    startingPrice: "$45/month",
    hasFreePlan: false,
    hasFreeChecker: true,
    platforms: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot", "Google AI Overviews"],
    bestFor: ["Mid-market companies", "Growing agencies", "Data-driven teams"],
    keyFeatures: [
      "6-platform AI visibility tracking",
      "Sentiment and tone analysis",
      "Share of voice reporting",
      "Custom alert rules",
      "Data export to BI tools",
    ],
    pros: ["Comprehensive platform coverage", "Strong analytics capabilities", "Good mid-market positioning"],
    cons: ["No free plan", "Can be complex for beginners"],
    pricingNotes:
      "Professional at $45/mo. Agency at $120/mo. Enterprise custom. 7-day free trial.",
    shortDescription:
      "Scrunch AI provides six-platform coverage with sentiment analysis and BI-ready data exports for data-driven marketing teams.",
    longDescription:
      "Scrunch AI tracks brand visibility across all six major AI search platforms. Sentiment analysis helps understand not just if your brand appears, but in what context. Share of voice reporting shows your position relative to competitors. BI-ready data exports make it easy to fold AI visibility metrics into existing analytical workflows.",
    category: ["AI Visibility", "Analytics"],
    lastUpdated: "2026-06-20",
  },
];

export function getToolBySlug(slug: string): AITool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(tool: AITool, count = 3): AITool[] {
  return tools
    .filter((t) => t.slug !== tool.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

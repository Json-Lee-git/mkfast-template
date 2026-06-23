export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  whyItMatters: string;
  howMeasured: string;
};

export const glossaryTerms: Record<string, GlossaryTerm> = {
  "ai-visibility": {
    slug: "ai-visibility",
    term: "AI Visibility",
    definition:
      "AI visibility refers to how often and in what context a brand, product, or topic appears in AI-powered search results and language model responses. Unlike traditional SEO which tracks keyword rankings in search engines like Google, AI visibility measures presence across ChatGPT, Perplexity, Gemini, Claude, Copilot, and Google AI Overviews.",
    whyItMatters:
      "As more users shift from traditional search engines to AI chatbots and AI-powered search for information discovery, brands need to understand their presence in these new channels. AI visibility directly impacts brand perception, purchase decisions, and competitive positioning in an increasingly AI-mediated information landscape.",
    howMeasured:
      "AI visibility is measured by tracking brand mentions across AI platforms, analyzing the sentiment and context of those mentions, monitoring keyword-based queries, and comparing share of voice against competitors. Tools like Otterly AI, Peec AI, and Profound automate this monitoring.",
  },
  "llm-visibility": {
    slug: "llm-visibility",
    term: "LLM Visibility",
    definition:
      "LLM (Large Language Model) visibility specifically measures how brands and topics appear in responses from large language models like ChatGPT, Claude, and Gemini. It is a subset of AI visibility focused on conversational AI platforms rather than AI-enhanced traditional search results.",
    whyItMatters:
      "LLM platforms like ChatGPT now have hundreds of millions of active users who rely on them for product research, recommendations, and information gathering. If your brand is not visible or presented accurately in LLM responses, you are missing a growing channel of purchase-influencing traffic.",
    howMeasured:
      "LLM visibility tracking tools query LLM APIs with brand-related prompts at regular intervals, analyzing the resulting responses for brand mentions, sentiment, accuracy of information, and competitive positioning. This data is aggregated into dashboards and trend reports.",
  },
  "ai-search-monitoring": {
    slug: "ai-search-monitoring",
    term: "AI Search Monitoring",
    definition:
      "AI search monitoring is the continuous process of tracking how brands, keywords, and topics appear across AI-powered search platforms. It combines elements of traditional rank tracking with LLM response analysis to provide a complete picture of AI search presence.",
    whyItMatters:
      "Without monitoring, brands operate blind in AI search channels. AI search monitoring provides the data needed to optimize content for AI visibility, identify competitive threats, track the impact of algorithm changes, and report AI search performance to stakeholders.",
    howMeasured:
      "AI search monitoring tools run scheduled queries against AI platforms, capture and analyze responses, track changes over time, and generate reports. Key metrics include mention frequency, sentiment trends, share of voice, and position changes across different AI platforms.",
  },
  "geo-generative-engine-optimization": {
    slug: "geo-generative-engine-optimization",
    term: "GEO (Generative Engine Optimization)",
    definition:
      "Generative Engine Optimization (GEO) is the practice of optimizing content and brand presence specifically for AI-powered search and generative AI platforms. It extends traditional SEO principles to address how language models select, rank, and present information in their responses.",
    whyItMatters:
      "As AI-generated answers replace traditional blue-link search results for many query types, GEO becomes essential for maintaining organic visibility. Research shows that AI platforms frequently cite and recommend brands in their responses, creating new opportunities for traffic and brand exposure.",
    howMeasured:
      "GEO performance is measured through AI visibility scores, brand mention frequency in LLM responses, citation rates (how often your content is referenced), competitive share of voice in AI search, and ultimately the traffic and conversions driven by AI platform referrals.",
  },
};

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms[slug];
}

export function getAllGlossarySlugs(): string[] {
  return Object.keys(glossaryTerms);
}

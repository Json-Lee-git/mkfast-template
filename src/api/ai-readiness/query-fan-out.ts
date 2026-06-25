import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { runAi, parseAiJson } from './ai';

const inputSchema = z.object({
  query: z.string().trim().min(1, 'Please enter a query or topic'),
});

export interface FanOutResult {
  query: string;
  mainIntent: string;
  fanOutQueries: string[];
  intentClusters: string[];
  recommendedHeadings: string[];
  faqQuestions: string[];
  contentGaps: string[];
  suggestedInternalLinks: Array<{
    label: string;
    href: string;
    reason: string;
  }>;
}

const SUGGESTED_LINKS = [
  {
    label: 'AEO Checker',
    href: '/tools/aeo-checker',
    reason: 'Audit the page after you add answer-ready sections.',
  },
  {
    label: 'LLMs.txt Checker',
    href: '/tools/llms-txt-checker',
    reason: 'Check whether AI-readable files support this content.',
  },
  {
    label: 'LLMs.txt Generator',
    href: '/tools/llms-txt-generator',
    reason: 'Generate a file that points AI systems to important pages.',
  },
];

const AI_SYSTEM_PROMPT = `You are an SEO content strategist. Given a search query or topic, produce a JSON object with a query fan-out.

Rules:
- fanOutQueries: 5-8 long-tail search queries people might search for around this topic
- intentClusters: 3-5 thematic clusters that group related queries
- recommendedHeadings: 4-6 article headings structured for answer-engine readability
- faqQuestions: 4-6 question-format FAQ entries
- contentGaps: 2-4 common content gaps or angles most competitors miss
- mainIntent: one sentence describing what a searcher wants from this query

Return ONLY valid JSON, no markdown, no explanation:
{
  "mainIntent": "...",
  "fanOutQueries": ["...", "..."],
  "intentClusters": ["...", "..."],
  "recommendedHeadings": ["...", "..."],
  "faqQuestions": ["...", "..."],
  "contentGaps": ["...", "..."]
}`;

function buildDefaultResult(topic: string): FanOutResult {
  return {
    query: topic,
    mainIntent: `Understand ${topic} and explore related angles.`,
    fanOutQueries: [
      `What is ${topic}?`,
      `How does ${topic} work?`,
      `Benefits of ${topic}`,
      `How to get started with ${topic}?`,
      `Common mistakes with ${topic}`,
      `${topic} best practices`,
      `${topic} vs alternatives`,
    ],
    intentClusters: ['Definition', 'How it works', 'Getting started', 'Best practices', 'Comparisons'],
    recommendedHeadings: [
      `What is ${topic}?`,
      `How ${topic} works`,
      `Getting started with ${topic}`,
      `${topic} best practices`,
      `Common questions about ${topic}`,
    ],
    faqQuestions: [
      `What is ${topic}?`,
      `How do I start with ${topic}?`,
      `What are common mistakes with ${topic}?`,
      `Is ${topic} worth the effort?`,
      `What tools help with ${topic}?`,
    ],
    contentGaps: [
      'No introductory definition',
      'Missing step-by-step guide',
      'No comparison with alternatives',
    ],
    suggestedInternalLinks: SUGGESTED_LINKS,
  };
}

export const runQueryFanOut = createServerFn({ method: 'POST' })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<FanOutResult> => {
    const topic = data.query.trim();

    // Try AI-powered fan-out
    const aiResult = await runAi({
      feature: 'query-fan-out',
      systemPrompt: AI_SYSTEM_PROMPT,
      userPrompt: `Query: "${topic}"`,
      maxTokens: 800,
    });

    if (aiResult) {
      const parsed = parseAiJson(aiResult.text) as Record<string, unknown> | null;
      if (parsed && typeof parsed.mainIntent === 'string') {
        return {
          query: topic,
          mainIntent: String(parsed.mainIntent || ''),
          fanOutQueries: Array.isArray(parsed.fanOutQueries)
            ? parsed.fanOutQueries.map(String)
            : [],
          intentClusters: Array.isArray(parsed.intentClusters)
            ? parsed.intentClusters.map(String)
            : [],
          recommendedHeadings: Array.isArray(parsed.recommendedHeadings)
            ? parsed.recommendedHeadings.map(String)
            : [],
          faqQuestions: Array.isArray(parsed.faqQuestions)
            ? parsed.faqQuestions.map(String)
            : [],
          contentGaps: Array.isArray(parsed.contentGaps)
            ? parsed.contentGaps.map(String)
            : [],
          suggestedInternalLinks: SUGGESTED_LINKS,
        };
      }
    }

    // Fallback to template-based output
    return buildDefaultResult(topic);
  });

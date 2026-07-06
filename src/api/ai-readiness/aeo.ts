import { createServerFn } from '@tanstack/react-start';
import { csrfMiddleware } from '@/lib/csrf';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { AI_CRAWLERS } from '@/lib/ai-crawlers';
import {
  FETCH_TIMEOUT_MS,
  MAX_REDIRECTS,
  normalizeOrigin,
  normalizeUrlKeepPath,
  fetchWithTimeout,
} from './shared';
import { runAi, parseAiJson } from './ai';

const inputSchema = z.object({
  url: z.string().trim().min(1, 'Please enter a URL'),
});

const MAX_HTML_SIZE = 2 * 1024 * 1024; // 2 MB
// ---------- Types ----------

export interface AeoAuditResult {
  normalizedUrl: string;
  checkedAt: string;
  score: number;
  scoreLabel: string;
  page: {
    finalUrl: string;
    statusCode?: number;
    contentType?: string;
    title?: string;
    metaDescription?: string;
    canonical?: string;
    metaRobots?: string;
    issues: string[];
    warnings: string[];
  };
  aiFiles: {
    llmsTxt: { exists: boolean; url: string; statusCode?: number };
    llmsFullTxt: { exists: boolean; url: string; statusCode?: number };
    sitemap: { exists: boolean; url?: string; statusCode?: number };
    robotsTxt: {
      exists: boolean;
      url: string;
      statusCode?: number;
      crawlers: Array<{
        name: string;
        userAgent: string;
        access: 'allowed' | 'blocked' | 'unknown';
        note?: string;
      }>;
    };
  };
  structuredData: {
    hasJsonLd: boolean;
    schemaTypes: string[];
    parseErrors: string[];
    issues: string[];
    warnings: string[];
  };
  answerReadyContent: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hasFaqSection: boolean;
    hasQuestionHeadings: boolean;
    hasLists: boolean;
    hasShortAnswerParagraphs: boolean;
    issues: string[];
    warnings: string[];
  };
  entityClarity: {
    inferredBrandName?: string;
    hasOgSiteName: boolean;
    hasOrganizationSchema: boolean;
    brandMentionCount?: number;
    issues: string[];
    warnings: string[];
  };
  trustSignals: {
    hasAuthor: boolean;
    hasPublishedDate: boolean;
    hasModifiedDate: boolean;
    hasAboutLink: boolean;
    hasContactLink: boolean;
    hasPrivacyLink: boolean;
    externalLinkCount: number;
    issues: string[];
    warnings: string[];
  };
  recommendations: string[];
  pageText?: string;
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    quickWins: string[];
    actionPlan: Array<{
      priority: 'critical' | 'high' | 'medium' | 'low';
      effort: string;
      title: string;
      whatToDo: string;
      why: string;
    }>;
    contentSuggestions: string[];
    schemaSuggestions: string[];
    missingTopics: string[];
    customLlmsTxt: string;
    customLlmsFullTxt: string;
    customSchemaJson: string;
  };
}

export type AeoActionPriority = NonNullable<
  AeoAuditResult['aiAnalysis']
>['actionPlan'][number]['priority'];

// ---------- URL normalize ----------

function normalizeInputUrl(raw: string): string {
  const trimmed = raw.trim();
  // Check if it looks like a domain or a full URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return normalizeUrlKeepPath(trimmed);
  }
  // Treat as domain
  return normalizeOrigin(trimmed) + '/';
}

// ---------- Fetch helpers ----------

async function readTextWithLimit(
  res: Response,
  limitBytes: number
): Promise<{ text: string; sizeBytes: number }> {
  if (!res.body) {
    const text = (await res.text()).slice(0, limitBytes);
    return {
      text,
      sizeBytes: new TextEncoder().encode(text).length,
    };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let sizeBytes = 0;

  while (sizeBytes < limitBytes) {
    const { done, value } = await reader.read();
    if (done) break;

    const remaining = limitBytes - sizeBytes;
    const chunk =
      value.byteLength > remaining ? value.slice(0, remaining) : value;
    text += decoder.decode(chunk, { stream: value.byteLength <= remaining });
    sizeBytes += chunk.byteLength;

    if (value.byteLength > remaining) {
      await reader.cancel();
      break;
    }
  }

  text += decoder.decode();
  return { text, sizeBytes };
}

async function fetchPage(url: string): Promise<{
  finalUrl: string;
  statusCode: number;
  contentType?: string;
  body?: string;
  sizeBytes?: number;
}> {
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount < MAX_REDIRECTS) {
    let res: Response;
    try {
      res = await fetchWithTimeout(currentUrl, FETCH_TIMEOUT_MS);
    } catch {
      return { finalUrl: currentUrl, statusCode: 0 };
    }

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (location) {
        try {
          currentUrl = normalizeUrlKeepPath(new URL(location, currentUrl).href);
        } catch {
          return { finalUrl: currentUrl, statusCode: 0 };
        }
        redirectCount++;
        continue;
      }
    }

    const ct = res.headers.get('content-type') || '';

    if (res.status >= 200 && res.status < 400) {
      try {
        const { text, sizeBytes } = await readTextWithLimit(res, MAX_HTML_SIZE);
        return {
          finalUrl: currentUrl,
          statusCode: res.status,
          contentType: ct || undefined,
          body: text,
          sizeBytes,
        };
      } catch {
        return {
          finalUrl: currentUrl,
          statusCode: res.status,
          contentType: ct || undefined,
        };
      }
    }

    return {
      finalUrl: currentUrl,
      statusCode: res.status,
      contentType: ct || undefined,
    };
  }

  return { finalUrl: currentUrl, statusCode: 0 };
}

// ---------- HTML parsing ----------

function extractMeta(html: string, name: string): string | undefined {
  const regex = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    'i'
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    'i'
  );
  return (html.match(regex)?.[1] || html.match(alt)?.[1])?.trim();
}

function extractTitle(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
}

function extractCanonical(html: string): string | undefined {
  return html
    .match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    ?.trim();
}

function extractMetaRobots(html: string): string | undefined {
  return extractMeta(html, 'robots');
}

function normalizeSchemaType(value: string): string {
  return value.replace(/^https?:\/\/schema\.org\//i, '').trim();
}

function collectSchemaTypes(value: unknown, types: Set<string>): void {
  if (!value) return;
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
    return;
  }
  if (typeof value !== 'object') return;

  const record = value as Record<string, unknown>;
  const rawType = record['@type'];
  if (typeof rawType === 'string') {
    const type = normalizeSchemaType(rawType);
    if (type) types.add(type);
  } else if (Array.isArray(rawType)) {
    for (const item of rawType) {
      if (typeof item === 'string') {
        const type = normalizeSchemaType(item);
        if (type) types.add(type);
      }
    }
  }

  for (const nested of Object.values(record)) {
    if (nested && typeof nested === 'object') collectSchemaTypes(nested, types);
  }
}

function extractJsonLd(
  html: string
): Array<{ types: string[]; error?: string }> {
  const results: Array<{ types: string[]; error?: string }> = [];
  const regex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = regex.exec(html);
  while (match !== null) {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      const types = new Set<string>();
      collectSchemaTypes(parsed, types);
      results.push({ types: [...types] });
    } catch (error) {
      results.push({
        types: [],
        error:
          error instanceof Error
            ? error.message
            : 'Invalid JSON-LD block could not be parsed.',
      });
    }
    match = regex.exec(html);
  }
  return results;
}

function extractHeadings(html: string): {
  h1: string[];
  h2: string[];
  h3: string[];
} {
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [])
    .map((h) => h.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  const h2 = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [])
    .map((h) => h.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  const h3 = (html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [])
    .map((h) => h.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  return { h1, h2, h3 };
}

function hasQuestionHeadings(headings: string[]): boolean {
  return headings.some((h) =>
    /^(what|how|why|when|where|who|should|can|does|is|are|do)\b/i.test(h)
  );
}

function hasFaqSection(html: string, headings: string[]): boolean {
  const faqPattern = /\b(faq|frequently asked questions?|common questions?)\b/i;
  if (faqPattern.test(html)) return true;
  return headings.some((h) => faqPattern.test(h));
}

function hasLists(html: string): boolean {
  return /<[ou]l[^>]*>/i.test(html);
}

function hasShortAnswerParagraphs(html: string): boolean {
  const paras = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  let shortCount = 0;
  for (const p of paras) {
    const text = p.replace(/<[^>]+>/g, '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 20 && wordCount <= 100) shortCount++;
  }
  return shortCount >= 2;
}

function extractExternalLinks(html: string, baseDomain: string): string[] {
  const links: string[] = [];
  const regex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  let match = regex.exec(html);
  while (match !== null) {
    try {
      const url = new URL(match[1]);
      if (url.hostname !== baseDomain && !links.includes(match[1])) {
        links.push(match[1]);
      }
    } catch {
      /* skip invalid URLs */
    }
    match = regex.exec(html);
  }
  return links;
}

function hasInternalLink(html: string, pattern: RegExp): boolean {
  return pattern.test(html);
}

function resolveRobotsAccess(
  lines: string[],
  userAgent: string
): 'allowed' | 'blocked' | 'unknown' {
  const uaLower = userAgent.toLowerCase();
  let bestAccess: 'allowed' | 'blocked' | 'unknown' = 'unknown';
  let bestSpecificity = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('user-agent:')) continue;

    const agents: string[] = [];
    let cursor = i;
    while (cursor < lines.length) {
      const current = lines[cursor].trim();
      if (!current.startsWith('user-agent:')) break;
      agents.push(current.slice('user-agent:'.length).trim());
      cursor++;
    }

    const matchesSpecific = agents.includes(uaLower);
    const matchesWildcard = agents.includes('*');
    if (!matchesSpecific && !matchesWildcard) {
      i = Math.max(cursor - 1, i);
      continue;
    }

    const specificity = matchesSpecific ? 2 : 1;
    if (specificity < bestSpecificity) {
      i = Math.max(cursor - 1, i);
      continue;
    }

    let groupAccess: 'allowed' | 'blocked' | 'unknown' = 'allowed';
    for (let j = cursor; j < lines.length; j++) {
      const rule = lines[j].trim();
      if (rule.startsWith('user-agent:')) break;
      if (rule.startsWith('disallow:')) {
        const path = rule.slice('disallow:'.length).trim();
        if (path === '/') groupAccess = 'blocked';
      }
      if (rule.startsWith('allow:')) {
        const path = rule.slice('allow:'.length).trim();
        if (path === '/' || path === '') groupAccess = 'allowed';
      }
    }

    bestSpecificity = specificity;
    bestAccess = groupAccess;
    i = Math.max(cursor - 1, i);
  }

  return bestAccess;
}

function extractBrandName(
  title: string | undefined,
  ogSiteName: string | undefined,
  domain: string
): string {
  if (ogSiteName) return ogSiteName;
  if (title) {
    const sep = title.match(/^(.+?)\s+[|\-:]\s+.+$/);
    if (sep) return sep[1].trim();
    return title.trim();
  }
  return domain.replace(/^www\./, '').split('.')[0];
}

function hasAuthor(html: string): boolean {
  return (
    /<meta[^>]+name=["']author["'][^>]+content=/i.test(html) ||
    /<a[^>]+rel=["']author["'][^>]/i.test(html) ||
    /class=["'][^"']*author[^"']*["']/i.test(html) ||
    /\bby\s+<[^>]+>[^<]+<\/[^>]+>/i.test(html)
  );
}

function hasDate(html: string): { published: boolean; modified: boolean } {
  const hasPublished =
    /<meta[^>]+(?:name|property)=["']article:published_time["'][^>]+content=/i.test(
      html
    ) ||
    /<time[^>]+datetime=["'][^"']+["'][^>]*>/i.test(html) ||
    /datetime=["']\d{4}-\d{2}-\d{2}/i.test(html);
  const hasModified =
    /<meta[^>]+(?:name|property)=["']article:modified_time["'][^>]+content=/i.test(
      html
    ) || /last.?modified/i.test(html);
  return { published: hasPublished, modified: hasModified };
}

function extractPageText(html: string, maxChars = 6000): string {
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
}

export const AI_ANALYSIS_PROMPT = `You are a senior AEO (Answer Engine Optimization) consultant hired by a website owner who knows nothing about SEO. Your client pays $19 for this audit. They need a report they can act on immediately — every suggestion must be specific to THEIR website, not generic advice.

You will receive:
1. The page's visible text content
2. A technical audit summary with detected issues

RULES (follow strictly):
- NEVER use placeholder text like "[topic]", "[concise answer]", "[brand name]", "[Author Name]", "[company name]", "[insert...]", or any bracketed placeholder. Use actual content from the page.
- Every recommendation must reference something you can see in the provided page content or audit data.
- Write as if talking to a non-technical person. Be clear, direct, and practical.
- Prioritize impact: what will actually move the needle for AI search citations?

Return ONLY valid JSON (no markdown fences, no commentary):

{
  "summary": "2-3 sentence assessment of this specific website's AEO readiness. Include the actual brand/site name.",
  "strengths": ["3-5 strengths found on THIS page. Be specific about what content/pattern you observed."],
  "quickWins": ["2-4 quick fixes that can be done in under 15 minutes. Each should be a single actionable sentence."],
  "actionPlan": [
    {
      "priority": "critical|high|medium",
      "effort": "5 minutes|15 minutes|30 minutes|1 hour",
      "title": "Short action title",
      "whatToDo": "Step-by-step instructions. Include actual content examples or code snippets the user can copy.",
      "why": "One sentence explaining why this matters for AI search visibility."
    }
  ],
  "contentSuggestions": ["2-4 specific content improvements. Reference existing page sections."],
  "schemaSuggestions": ["1-3 JSON-LD schema improvements. Mention specific schema types appropriate for this page."],
  "missingTopics": ["2-3 topics this page SHOULD cover but doesn't. These are content gaps hurting AI search coverage."],
  "customLlmsTxt": "A complete /llms.txt file generated from this page's content. Use real page titles, real URLs, real descriptions.",
  "customLlmsFullTxt": "A complete /llms-full.txt with expanded markdown content extracted from the page. Include the key information sections.",
  "customSchemaJson": "A JSON-LD schema object (stringified) tailored to this page. If the page is about a tool, use SoftwareApplication or WebApplication. If it's documentation, use Article or TechArticle. Fill in every field with real data from the page."
}`;

// ---------- AI Files check ----------

async function checkAiFiles(
  origin: string
): Promise<AeoAuditResult['aiFiles']> {
  const [llmsTxtRes, llmsFullTxtRes, robotsTxtRes, sitemapRes] =
    await Promise.all([
      fetchPage(`${origin}/llms.txt`),
      fetchPage(`${origin}/llms-full.txt`),
      fetchPage(`${origin}/robots.txt`),
      fetchPage(`${origin}/sitemap.xml`),
    ]);

  const llmsTxtExists =
    llmsTxtRes.statusCode >= 200 && llmsTxtRes.statusCode < 400;
  const llmsFullTxtExists =
    llmsFullTxtRes.statusCode >= 200 && llmsFullTxtRes.statusCode < 400;
  const robotsTxtExists =
    robotsTxtRes.statusCode >= 200 && robotsTxtRes.statusCode < 400;
  const sitemapExists =
    sitemapRes.statusCode >= 200 && sitemapRes.statusCode < 400;

  // Parse robots.txt for crawler rules
  const crawlers: AeoAuditResult['aiFiles']['robotsTxt']['crawlers'] = [];
  if (robotsTxtExists && robotsTxtRes.body) {
    const lines = robotsTxtRes.body
      .toLowerCase()
      .split('\n')
      .map((line) => line.split('#')[0].trim())
      .filter(Boolean);
    for (const crawler of AI_CRAWLERS) {
      crawlers.push({
        name: crawler.name,
        userAgent: crawler.userAgent,
        access: resolveRobotsAccess(lines, crawler.userAgent),
      });
    }
  } else {
    for (const crawler of AI_CRAWLERS) {
      crawlers.push({
        name: crawler.name,
        userAgent: crawler.userAgent,
        access: 'unknown',
      });
    }
  }

  return {
    llmsTxt: {
      exists: llmsTxtExists,
      url: `${origin}/llms.txt`,
      statusCode: llmsTxtRes.statusCode || undefined,
    },
    llmsFullTxt: {
      exists: llmsFullTxtExists,
      url: `${origin}/llms-full.txt`,
      statusCode: llmsFullTxtRes.statusCode || undefined,
    },
    sitemap: {
      exists: sitemapExists,
      url: `${origin}/sitemap.xml`,
      statusCode: sitemapRes.statusCode || undefined,
    },
    robotsTxt: {
      exists: robotsTxtExists,
      url: `${origin}/robots.txt`,
      statusCode: robotsTxtRes.statusCode || undefined,
      crawlers,
    },
  };
}

// ---------- Score calculation ----------

function calculateScore(result: AeoAuditResult): number {
  let score = 0;

  // Technical crawlability: 15
  if (
    result.page.statusCode &&
    result.page.statusCode >= 200 &&
    result.page.statusCode < 400
  )
    score += 4;
  if (result.page.title) score += 3;
  if (result.page.metaDescription) score += 3;
  if (result.page.canonical) score += 3;
  if (!result.page.metaRobots?.toLowerCase().includes('noindex')) score += 2;

  // AI files + crawler access: 20
  if (result.aiFiles.llmsTxt.exists) score += 5;
  if (result.aiFiles.llmsFullTxt.exists) score += 3;
  if (result.aiFiles.sitemap.exists) score += 4;
  if (result.aiFiles.robotsTxt.exists) {
    const crawlers = result.aiFiles.robotsTxt.crawlers;
    const allowed = crawlers.filter((c) => c.access === 'allowed').length;
    score += Math.round((allowed / Math.max(crawlers.length, 1)) * 8);
  }

  // Structured data: 20
  if (result.structuredData.hasJsonLd) score += 5;
  if (result.structuredData.schemaTypes.length > 0) score += 5;
  if (
    result.structuredData.schemaTypes.some((t) =>
      /organization|website|webpage/i.test(t)
    )
  )
    score += 5;
  if (
    result.structuredData.schemaTypes.some((t) =>
      /article|blogposting|faqpage|product|howto/i.test(t)
    )
  )
    score += 3;
  if (result.structuredData.parseErrors.length === 0) score += 2;

  // Answer-ready content: 20
  if (result.answerReadyContent.h1Count === 1) score += 5;
  else if (result.answerReadyContent.h1Count > 1) score += 2;
  if (result.answerReadyContent.h2Count >= 2) score += 4;
  if (result.answerReadyContent.hasFaqSection) score += 4;
  if (result.answerReadyContent.hasQuestionHeadings) score += 4;
  if (result.answerReadyContent.hasShortAnswerParagraphs) score += 3;

  // Entity clarity: 15
  if (result.entityClarity.inferredBrandName) score += 4;
  if (result.entityClarity.hasOgSiteName) score += 4;
  if (result.entityClarity.hasOrganizationSchema) score += 5;
  if (
    result.entityClarity.brandMentionCount &&
    result.entityClarity.brandMentionCount >= 2
  )
    score += 2;

  // Trust signals: 10
  if (result.trustSignals.hasAuthor) score += 2;
  if (result.trustSignals.hasPublishedDate) score += 2;
  if (result.trustSignals.hasAboutLink) score += 1;
  if (result.trustSignals.hasContactLink) score += 1;
  if (result.trustSignals.hasPrivacyLink) score += 1;
  if (result.trustSignals.externalLinkCount >= 2) score += 1;
  if (result.trustSignals.hasModifiedDate) score += 2;

  return Math.min(score, 100);
}

// ---------- Recommendations ----------

function generateRecommendations(result: AeoAuditResult): string[] {
  const recs: string[] = [];

  // Crawlability
  if (!result.page.title) recs.push('Add a page title (<title>).');
  if (!result.page.metaDescription)
    recs.push('Add a meta description to summarize your page content.');
  if (!result.page.canonical)
    recs.push('Add a canonical URL to prevent duplicate content issues.');
  if (result.page.metaRobots?.toLowerCase().includes('noindex'))
    recs.push('Remove noindex from meta robots if you want this page indexed.');

  // AI Files
  if (!result.aiFiles.llmsTxt.exists)
    recs.push('Add an LLMs.txt file at your site root.');
  if (!result.aiFiles.llmsFullTxt.exists)
    recs.push(
      'Consider adding an LLMs-full.txt file for deeper content coverage.'
    );
  if (!result.aiFiles.sitemap.exists)
    recs.push('Add a sitemap.xml or reference your sitemap in robots.txt.');
  if (result.aiFiles.robotsTxt.exists) {
    const blocked = result.aiFiles.robotsTxt.crawlers.filter(
      (c) => c.access === 'blocked'
    );
    for (const c of blocked) {
      recs.push(`Review robots.txt rules that block ${c.userAgent}.`);
    }
  } else {
    recs.push('Add a robots.txt file to control crawler access.');
  }

  // Structured data
  if (!result.structuredData.hasJsonLd)
    recs.push('Add JSON-LD structured data to your page.');
  if (result.structuredData.schemaTypes.length === 0)
    recs.push('Add at least Organization or WebSite schema to your pages.');
  if (
    !result.structuredData.schemaTypes.some((t) =>
      /organization|website/i.test(t)
    )
  ) {
    recs.push('Add Organization schema to clarify your brand entity.');
  }
  if (result.structuredData.parseErrors.length > 0)
    recs.push('Fix JSON-LD parse errors on your page.');

  // Answer-ready content
  if (result.answerReadyContent.h1Count !== 1)
    recs.push('Use exactly one H1 heading per page.');
  if (result.answerReadyContent.h2Count < 2)
    recs.push('Add H2 section headings to organize your content structure.');
  if (!result.answerReadyContent.hasFaqSection)
    recs.push('Add an FAQ section to answer common user questions.');
  if (!result.answerReadyContent.hasQuestionHeadings) {
    recs.push(
      'Add question-format headings (e.g. "What is X?") to help answer engines extract Q&A pairs.'
    );
  }
  if (!result.answerReadyContent.hasShortAnswerParagraphs) {
    recs.push('Rewrite key paragraphs to provide concise 40-80 word answers.');
  }

  // Entity clarity
  if (!result.entityClarity.hasOgSiteName)
    recs.push('Add og:site_name meta tag to clarify your brand name.');
  if (!result.entityClarity.hasOrganizationSchema)
    recs.push(
      'Add Organization schema to define your brand entity for AI systems.'
    );

  // Trust signals
  if (!result.trustSignals.hasAuthor)
    recs.push('Add author information to improve content credibility.');
  if (!result.trustSignals.hasPublishedDate)
    recs.push('Add a published date to your content.');
  if (!result.trustSignals.hasAboutLink)
    recs.push('Add an About page link to improve trust signals.');
  if (!result.trustSignals.hasContactLink)
    recs.push('Add a Contact page link to improve trust signals.');
  if (!result.trustSignals.hasPrivacyLink)
    recs.push('Add a Privacy page link to improve trust signals.');
  if (result.trustSignals.externalLinkCount < 2)
    recs.push('Add relevant external references to support your content.');

  // Deduplicate
  return [...new Set(recs)];
}

// ---------- Main server function ----------

export const runAeoAudit = createServerFn({ method: 'POST' })
  .middleware([csrfMiddleware])
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<AeoAuditResult> => {
    await enforceRateLimit('aeoCheck');
    const normalizedUrl = normalizeInputUrl(data.url);
    const checkedAt = new Date().toISOString();

    // Fetch the page
    const pageRes = await fetchPage(normalizedUrl);
    const html = pageRes.body || '';

    // Parse page metadata
    const title = extractTitle(html);
    const metaDescription = extractMeta(html, 'description');
    const canonical = extractCanonical(html);
    const metaRobots = extractMetaRobots(html);

    const pageIssues: string[] = [];
    const pageWarnings: string[] = [];

    if (
      !pageRes.statusCode ||
      pageRes.statusCode < 200 ||
      pageRes.statusCode >= 400
    ) {
      pageIssues.push(`Page returned HTTP ${pageRes.statusCode || 'error'}.`);
    }
    if (pageRes.contentType && !pageRes.contentType.includes('text/html')) {
      pageWarnings.push('Content is not HTML. Some checks are skipped.');
    }
    if (!title) pageIssues.push('No page title found.');
    if (!metaDescription) pageWarnings.push('No meta description found.');
    else if (metaDescription.length < 50)
      pageWarnings.push('Meta description is too short.');
    if (!canonical) pageWarnings.push('No canonical URL found.');
    if (metaRobots?.toLowerCase().includes('noindex')) {
      pageIssues.push('Meta robots contains noindex.');
    }

    // Parse content structure
    const headings = extractHeadings(html);
    const answerIssues: string[] = [];
    const answerWarnings: string[] = [];

    if (headings.h1.length === 0) answerIssues.push('No H1 heading found.');
    if (headings.h1.length > 1)
      answerIssues.push(
        `Multiple H1 headings found (${headings.h1.length}). Use exactly one.`
      );
    if (headings.h2.length < 2)
      answerIssues.push(
        'Fewer than 2 H2 headings found. Add more section structure.'
      );

    const qHeadings = hasQuestionHeadings([...headings.h2, ...headings.h3]);
    const faq = hasFaqSection(html, [...headings.h2, ...headings.h3]);
    const lists = hasLists(html);
    const shortAnswers = hasShortAnswerParagraphs(html);

    if (!faq) answerIssues.push('No FAQ section or Q&A structure detected.');
    if (!qHeadings) answerWarnings.push('No question-format headings found.');
    if (!shortAnswers)
      answerWarnings.push(
        'No concise answer paragraphs (40-80 words) detected.'
      );

    // Parse JSON-LD
    const jsonLdBlocks = extractJsonLd(html);
    const schemaTypes = [
      ...new Set(jsonLdBlocks.flatMap((block) => block.types)),
    ];
    const parseErrors = jsonLdBlocks
      .filter((block) => block.error)
      .map((block) => block.error!);
    const schemaIssues: string[] = [];
    const schemaWarnings: string[] = [];

    if (jsonLdBlocks.length === 0)
      schemaIssues.push('No JSON-LD structured data found.');
    if (
      schemaTypes.length > 0 &&
      !schemaTypes.some((t) => /organization|website/i.test(t))
    ) {
      schemaWarnings.push(
        'No Organization or WebSite schema found in JSON-LD.'
      );
    }
    if (parseErrors.length > 0)
      schemaIssues.push(
        `${parseErrors.length} JSON-LD block(s) failed to parse.`
      );

    // Entity clarity
    const domain = new URL(pageRes.finalUrl || normalizedUrl).hostname;
    const ogSiteName = extractMeta(html, 'og:site_name');
    const inferredName = extractBrandName(title, ogSiteName, domain);
    const hasOrgSchema = schemaTypes.some((t) => /organization/i.test(t));
    const brandMentions = inferredName
      ? (
          html.match(
            new RegExp(
              inferredName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'gi'
            )
          ) || []
        ).length
      : 0;

    const entityIssues: string[] = [];
    const entityWarnings: string[] = [];
    if (!ogSiteName) entityIssues.push('No og:site_name meta tag found.');
    if (!hasOrgSchema) entityIssues.push('No Organization schema found.');
    if (!title) entityIssues.push('No page title to infer entity from.');

    // Trust signals
    const externalLinks = extractExternalLinks(html, domain);
    const dates = hasDate(html);
    const author = hasAuthor(html);
    const aboutLink = hasInternalLink(html, /about/i);
    const contactLink = hasInternalLink(html, /contact/i);
    const privacyLink = hasInternalLink(html, /privacy/i);

    const trustIssues: string[] = [];
    const trustWarnings: string[] = [];
    if (!author) trustIssues.push('No author information found.');
    if (!dates.published) trustIssues.push('No published date found.');
    if (!aboutLink) trustWarnings.push('No About page link found on page.');
    if (!contactLink) trustIssues.push('No Contact page link found on page.');
    if (!privacyLink) trustWarnings.push('No Privacy page link found on page.');

    // Check AI files
    const origin = new URL(pageRes.finalUrl || normalizedUrl).origin;
    const aiFiles = await checkAiFiles(origin);

    // Build result
    const result: AeoAuditResult = {
      normalizedUrl,
      checkedAt,
      score: 0,
      scoreLabel: '',
      page: {
        finalUrl: pageRes.finalUrl,
        statusCode: pageRes.statusCode || undefined,
        contentType: pageRes.contentType,
        title,
        metaDescription,
        canonical,
        metaRobots,
        issues: pageIssues,
        warnings: pageWarnings,
      },
      aiFiles,
      structuredData: {
        hasJsonLd: jsonLdBlocks.length > 0,
        schemaTypes,
        parseErrors,
        issues: schemaIssues,
        warnings: schemaWarnings,
      },
      answerReadyContent: {
        h1Count: headings.h1.length,
        h2Count: headings.h2.length,
        h3Count: headings.h3.length,
        hasFaqSection: faq,
        hasQuestionHeadings: qHeadings,
        hasLists: lists,
        hasShortAnswerParagraphs: shortAnswers,
        issues: answerIssues,
        warnings: answerWarnings,
      },
      entityClarity: {
        inferredBrandName: inferredName,
        hasOgSiteName: !!ogSiteName,
        hasOrganizationSchema: hasOrgSchema,
        brandMentionCount: brandMentions,
        issues: entityIssues,
        warnings: entityWarnings,
      },
      trustSignals: {
        hasAuthor: author,
        hasPublishedDate: dates.published,
        hasModifiedDate: dates.modified,
        hasAboutLink: aboutLink,
        hasContactLink: contactLink,
        hasPrivacyLink: privacyLink,
        externalLinkCount: externalLinks.length,
        issues: trustIssues,
        warnings: trustWarnings,
      },
      recommendations: [],
    };

    result.score = calculateScore(result);
    result.scoreLabel = scoreLabelText(result.score);
    result.recommendations = generateRecommendations(result);

    // AI-powered deep analysis (non-blocking — falls back gracefully)
    const pageText = extractPageText(html);
    result.pageText = pageText;
    const aiContext = [
      `URL: ${result.normalizedUrl}`,
      `Brand/Inferred Name: ${inferredName || 'N/A'}`,
      `Title: ${title || 'N/A'}`,
      `Meta Description: ${metaDescription || 'N/A'}`,
      `H1 headings: ${headings.h1.join(' | ') || 'none'}`,
      `H2 headings: ${headings.h2.join(' | ') || 'none'}`,
      `H3 headings: ${headings.h3.join(' | ') || 'none'}`,
      `Schema types detected: ${schemaTypes.join(', ') || 'none'}`,
      `Has JSON-LD: ${jsonLdBlocks.length > 0 ? 'yes' : 'no'}`,
      `Has FAQ section: ${faq ? 'yes' : 'no'}`,
      `Has author: ${author ? 'yes' : 'no'}`,
      `Has published date: ${dates.published ? 'yes' : 'no'}`,
      `Has About link: ${aboutLink ? 'yes' : 'no'}`,
      `Has Contact link: ${contactLink ? 'yes' : 'no'}`,
      `Has Privacy link: ${privacyLink ? 'yes' : 'no'}`,
      `External links found: ${externalLinks.length}`,
      `Crawler access summary:`,
      ...aiFiles.robotsTxt.crawlers.map((c) => `  ${c.name}: ${c.access}`),
      `Issues to fix:`,
      ...result.recommendations.map((r) => `- ${r}`),
      `--- PAGE CONTENT ---`,
      pageText,
    ].join('\n');

    const aiResult = await runAi({
      feature: 'aeo-analysis',
      systemPrompt: AI_ANALYSIS_PROMPT,
      userPrompt: aiContext,
      maxTokens: 2048,
    });

    if (aiResult) {
      try {
        const parsed = parseAiJson(aiResult.text) as Record<
          string,
          unknown
        > | null;
        if (parsed && typeof parsed.summary === 'string') {
          result.aiAnalysis = {
            summary: String(parsed.summary || ''),
            strengths: Array.isArray(parsed.strengths)
              ? parsed.strengths.map(String)
              : [],
            quickWins: Array.isArray(parsed.quickWins)
              ? parsed.quickWins.map(String)
              : [],
            actionPlan: Array.isArray(parsed.actionPlan)
              ? parsed.actionPlan.map((a: Record<string, unknown>) => ({
                  priority: (['critical', 'high', 'medium', 'low'].includes(
                    String(a.priority)
                  )
                    ? String(a.priority)
                    : 'medium') as AeoActionPriority,
                  effort: String(a.effort || ''),
                  title: String(a.title || ''),
                  whatToDo: String(a.whatToDo || ''),
                  why: String(a.why || ''),
                }))
              : [],
            contentSuggestions: Array.isArray(parsed.contentSuggestions)
              ? parsed.contentSuggestions.map(String)
              : [],
            schemaSuggestions: Array.isArray(parsed.schemaSuggestions)
              ? parsed.schemaSuggestions.map(String)
              : [],
            missingTopics: Array.isArray(parsed.missingTopics)
              ? parsed.missingTopics.map(String)
              : [],
            customLlmsTxt: String(parsed.customLlmsTxt || ''),
            customLlmsFullTxt: String(parsed.customLlmsFullTxt || ''),
            customSchemaJson: String(parsed.customSchemaJson || ''),
          };
        }
      } catch {
        console.error('Failed to parse AI analysis JSON');
      }
    }

    return result;
  });

function scoreLabelText(score: number): string {
  if (score >= 80) return 'Strong technical AEO readiness';
  if (score >= 60) return 'Good foundation with improvement opportunities';
  if (score >= 40) return 'Partial readiness, several important gaps';
  return 'Weak technical AEO readiness';
}

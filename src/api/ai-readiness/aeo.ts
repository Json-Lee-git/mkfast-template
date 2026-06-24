import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  FETCH_TIMEOUT_MS,
  MAX_REDIRECTS,
  normalizeOrigin,
  normalizeUrlKeepPath,
  fetchWithTimeout,
} from './shared';

const inputSchema = z.object({
  url: z.string().trim().min(1, 'Please enter a URL'),
});

const MAX_HTML_SIZE = 2 * 1024 * 1024; // 2 MB
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended',
] as const;

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
}

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
        currentUrl = new URL(location, currentUrl).href;
        redirectCount++;
        continue;
      }
    }

    const ct = res.headers.get('content-type') || '';
    const isHtml = ct.includes('text/html') || ct.includes('application/xhtml');

    if (res.status >= 200 && res.status < 400) {
      try {
        const text = await res.text();
        const sizeBytes = new TextEncoder().encode(text).length;
        const body = sizeBytes <= MAX_HTML_SIZE ? text : text.slice(0, MAX_HTML_SIZE);
        return {
          finalUrl: currentUrl,
          statusCode: res.status,
          contentType: ct || undefined,
          body,
          sizeBytes: Math.min(sizeBytes, MAX_HTML_SIZE),
        };
      } catch {
        return { finalUrl: currentUrl, statusCode: res.status, contentType: ct || undefined };
      }
    }

    return { finalUrl: currentUrl, statusCode: res.status, contentType: ct || undefined };
  }

  return { finalUrl: currentUrl, statusCode: 0 };
}

// ---------- HTML parsing ----------

function extractMeta(html: string, name: string): string | undefined {
  const regex = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
  const alt = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i');
  return (html.match(regex)?.[1] || html.match(alt)?.[1])?.trim();
}

function extractTitle(html: string): string | undefined {
  return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
}

function extractCanonical(html: string): string | undefined {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]?.trim();
}

function extractMetaRobots(html: string): string | undefined {
  return extractMeta(html, 'robots');
}

function extractJsonLd(html: string): Array<{ type?: string; raw?: string }> {
  const results: Array<{ type?: string; raw?: string }> = [];
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = regex.exec(html);
  while (match !== null) {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      const type = parsed['@type'] || undefined;
      results.push({ type, raw });
    } catch {
      results.push({ raw });
    }
    match = regex.exec(html);
  }
  return results;
}

function extractHeadings(html: string): { h1: string[]; h2: string[]; h3: string[] } {
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []).map((h) => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  const h2 = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).map((h) => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  const h3 = (html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || []).map((h) => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  return { h1, h2, h3 };
}

function hasQuestionHeadings(headings: string[]): boolean {
  return headings.some((h) => /^(what|how|why|when|where|who|should|can|does|is|are|do)\b/i.test(h));
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
    } catch { /* skip invalid URLs */ }
    match = regex.exec(html);
  }
  return links;
}

function hasInternalLink(html: string, pattern: RegExp): boolean {
  return pattern.test(html);
}

function extractBrandName(title: string | undefined, ogSiteName: string | undefined, domain: string): string {
  if (ogSiteName) return ogSiteName;
  if (title) {
    const sep = title.match(/^(.+?)\s+[|\-–—]\s+.+$/);
    if (sep) return sep[1].trim();
    return title.trim();
  }
  return domain.replace(/^www\./, '').split('.')[0];
}

function hasAuthor(html: string): boolean {
  return /<meta[^>]+name=["']author["'][^>]+content=/i.test(html)
    || /<a[^>]+rel=["']author["'][^>]/i.test(html)
    || /class=["'][^"']*author[^"']*["']/i.test(html)
    || /\bby\s+<[^>]+>[^<]+<\/[^>]+>/i.test(html);
}

function hasDate(html: string): { published: boolean; modified: boolean } {
  const hasPublished = /<meta[^>]+(?:name|property)=["']article:published_time["'][^>]+content=/i.test(html)
    || /<time[^>]+datetime=["'][^"']+["'][^>]*>/i.test(html)
    || /datetime=["']\d{4}-\d{2}-\d{2}/i.test(html);
  const hasModified = /<meta[^>]+(?:name|property)=["']article:modified_time["'][^>]+content=/i.test(html)
    || /last.?modified/i.test(html);
  return { published: hasPublished, modified: hasModified };
}

// ---------- AI Files check ----------

async function checkAiFiles(origin: string): Promise<AeoAuditResult['aiFiles']> {
  const [llmsTxtRes, llmsFullTxtRes, robotsTxtRes, sitemapRes] = await Promise.all([
    fetchPage(`${origin}/llms.txt`),
    fetchPage(`${origin}/llms-full.txt`),
    fetchPage(`${origin}/robots.txt`),
    fetchPage(`${origin}/sitemap.xml`),
  ]);

  const llmsTxtExists = llmsTxtRes.statusCode >= 200 && llmsTxtRes.statusCode < 400;
  const llmsFullTxtExists = llmsFullTxtRes.statusCode >= 200 && llmsFullTxtRes.statusCode < 400;
  const robotsTxtExists = robotsTxtRes.statusCode >= 200 && robotsTxtRes.statusCode < 400;
  const sitemapExists = sitemapRes.statusCode >= 200 && sitemapRes.statusCode < 400;

  // Parse robots.txt for crawler rules
  const crawlers: AeoAuditResult['aiFiles']['robotsTxt']['crawlers'] = [];
  if (robotsTxtExists && robotsTxtRes.body) {
    const lines = robotsTxtRes.body.toLowerCase().split('\n');
    for (const crawlerName of AI_CRAWLERS) {
      const uaLower = crawlerName.toLowerCase();
      let access: 'allowed' | 'blocked' | 'unknown' = 'unknown';
      let foundSpecific = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('user-agent:')) {
          const agent = line.slice('user-agent:'.length).trim();
          if (agent === uaLower) {
            foundSpecific = true;
            for (let j = i + 1; j < lines.length; j++) {
              const next = lines[j].trim();
              if (next.startsWith('user-agent:')) break;
              if (next.startsWith('disallow:')) {
                const path = next.slice('disallow:'.length).trim();
                if (path === '/' || path === '') access = 'blocked';
              }
              if (next.startsWith('allow:')) {
                const path = next.slice('allow:'.length).trim();
                if (path === '/' || path === '') access = 'allowed';
              }
            }
          }
        }
      }

      if (!foundSpecific) {
        // Check wildcard
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === 'user-agent: *') {
            for (let j = i + 1; j < lines.length; j++) {
              const next = lines[j].trim();
              if (next.startsWith('user-agent:')) break;
              if (next.startsWith('disallow:')) {
                const path = next.slice('disallow:'.length).trim();
                if (path === '/') { access = 'blocked'; break; }
              }
            }
            break;
          }
        }
      }

      if (access === 'unknown' && foundSpecific) access = 'allowed';

      crawlers.push({ name: crawlerName, userAgent: crawlerName, access });
    }
  } else {
    for (const c of AI_CRAWLERS) {
      crawlers.push({ name: c, userAgent: c, access: 'unknown' });
    }
  }

  return {
    llmsTxt: { exists: llmsTxtExists, url: `${origin}/llms.txt`, statusCode: llmsTxtRes.statusCode || undefined },
    llmsFullTxt: { exists: llmsFullTxtExists, url: `${origin}/llms-full.txt`, statusCode: llmsFullTxtRes.statusCode || undefined },
    sitemap: { exists: sitemapExists, url: `${origin}/sitemap.xml`, statusCode: sitemapRes.statusCode || undefined },
    robotsTxt: { exists: robotsTxtExists, url: `${origin}/robots.txt`, statusCode: robotsTxtRes.statusCode || undefined, crawlers },
  };
}

// ---------- Score calculation ----------

function calculateScore(result: AeoAuditResult): number {
  let score = 0;

  // Technical crawlability: 15
  if (result.page.statusCode && result.page.statusCode >= 200 && result.page.statusCode < 400) score += 4;
  if (result.page.title) score += 3;
  if (result.page.metaDescription) score += 3;
  if (result.page.canonical) score += 3;
  if (result.page.metaRobots && !result.page.metaRobots.toLowerCase().includes('noindex')) score += 2;

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
  if (result.structuredData.schemaTypes.some((t) => /organization|website|webpage/i.test(t))) score += 5;
  if (result.structuredData.schemaTypes.some((t) => /article|blogposting|faqpage|product|howto/i.test(t))) score += 3;
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
  if (result.entityClarity.brandMentionCount && result.entityClarity.brandMentionCount >= 2) score += 2;

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
  if (!result.page.metaDescription) recs.push('Add a meta description to summarize your page content.');
  if (!result.page.canonical) recs.push('Add a canonical URL to prevent duplicate content issues.');
  if (result.page.metaRobots?.toLowerCase().includes('noindex')) recs.push('Remove noindex from meta robots if you want this page indexed.');

  // AI Files
  if (!result.aiFiles.llmsTxt.exists) recs.push('Add an LLMs.txt file at your site root.');
  if (!result.aiFiles.llmsFullTxt.exists) recs.push('Consider adding an LLMs-full.txt file for deeper content coverage.');
  if (!result.aiFiles.sitemap.exists) recs.push('Add a sitemap.xml or reference your sitemap in robots.txt.');
  if (result.aiFiles.robotsTxt.exists) {
    const blocked = result.aiFiles.robotsTxt.crawlers.filter((c) => c.access === 'blocked');
    for (const c of blocked) {
      recs.push(`Review robots.txt rules that block ${c.userAgent}.`);
    }
  } else {
    recs.push('Add a robots.txt file to control crawler access.');
  }

  // Structured data
  if (!result.structuredData.hasJsonLd) recs.push('Add JSON-LD structured data to your page.');
  if (result.structuredData.schemaTypes.length === 0) recs.push('Add at least Organization or WebSite schema to your pages.');
  if (!result.structuredData.schemaTypes.some((t) => /organization|website/i.test(t))) {
    recs.push('Add Organization schema to clarify your brand entity.');
  }
  if (result.structuredData.parseErrors.length > 0) recs.push('Fix JSON-LD parse errors on your page.');

  // Answer-ready content
  if (result.answerReadyContent.h1Count !== 1) recs.push('Use exactly one H1 heading per page.');
  if (result.answerReadyContent.h2Count < 2) recs.push('Add H2 section headings to organize your content structure.');
  if (!result.answerReadyContent.hasFaqSection) recs.push('Add an FAQ section to answer common user questions.');
  if (!result.answerReadyContent.hasQuestionHeadings) {
    recs.push('Add question-format headings (e.g. "What is X?") to help answer engines extract Q&A pairs.');
  }
  if (!result.answerReadyContent.hasShortAnswerParagraphs) {
    recs.push('Rewrite key paragraphs to provide concise 40-80 word answers.');
  }

  // Entity clarity
  if (!result.entityClarity.hasOgSiteName) recs.push('Add og:site_name meta tag to clarify your brand name.');
  if (!result.entityClarity.hasOrganizationSchema) recs.push('Add Organization schema to define your brand entity for AI systems.');

  // Trust signals
  if (!result.trustSignals.hasAuthor) recs.push('Add author information to improve content credibility.');
  if (!result.trustSignals.hasPublishedDate) recs.push('Add a published date to your content.');
  if (!result.trustSignals.hasAboutLink) recs.push('Add an About page link to improve trust signals.');
  if (!result.trustSignals.hasContactLink) recs.push('Add a Contact page link to improve trust signals.');
  if (!result.trustSignals.hasPrivacyLink) recs.push('Add a Privacy page link to improve trust signals.');
  if (result.trustSignals.externalLinkCount < 2) recs.push('Add relevant external references to support your content.');

  // Deduplicate
  return [...new Set(recs)];
}

// ---------- Main server function ----------

export const runAeoAudit = createServerFn({ method: 'POST' })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<AeoAuditResult> => {
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

    if (!pageRes.statusCode || pageRes.statusCode < 200 || pageRes.statusCode >= 400) {
      pageIssues.push(`Page returned HTTP ${pageRes.statusCode || 'error'}.`);
    }
    if (pageRes.contentType && !pageRes.contentType.includes('text/html')) {
      pageWarnings.push('Content is not HTML. Some checks are skipped.');
    }
    if (!title) pageIssues.push('No page title found.');
    if (!metaDescription) pageWarnings.push('No meta description found.');
    else if (metaDescription.length < 50) pageWarnings.push('Meta description is too short.');
    if (!canonical) pageWarnings.push('No canonical URL found.');

    // Parse content structure
    const headings = extractHeadings(html);
    const answerIssues: string[] = [];
    const answerWarnings: string[] = [];

    if (headings.h1.length === 0) answerIssues.push('No H1 heading found.');
    if (headings.h1.length > 1) answerIssues.push(`Multiple H1 headings found (${headings.h1.length}). Use exactly one.`);
    if (headings.h2.length < 2) answerIssues.push('Fewer than 2 H2 headings found. Add more section structure.');

    const qHeadings = hasQuestionHeadings([...headings.h2, ...headings.h3]);
    const faq = hasFaqSection(html, [...headings.h2, ...headings.h3]);
    const lists = hasLists(html);
    const shortAnswers = hasShortAnswerParagraphs(html);

    if (!faq) answerIssues.push('No FAQ section or Q&A structure detected.');
    if (!qHeadings) answerWarnings.push('No question-format headings found.');
    if (!shortAnswers) answerWarnings.push('No concise answer paragraphs (40-80 words) detected.');

    // Parse JSON-LD
    const jsonLdBlocks = extractJsonLd(html);
    const schemaTypes = jsonLdBlocks.filter((b) => b.type).map((b) => b.type!);
    const parseErrors = jsonLdBlocks.filter((b) => !b.type).map((b) => b.raw || 'Parse error');
    const schemaIssues: string[] = [];
    const schemaWarnings: string[] = [];

    if (jsonLdBlocks.length === 0) schemaIssues.push('No JSON-LD structured data found.');
    if (schemaTypes.length > 0 && !schemaTypes.some((t) => /organization|website/i.test(t))) {
      schemaWarnings.push('No Organization or WebSite schema found in JSON-LD.');
    }
    if (parseErrors.length > 0) schemaIssues.push(`${parseErrors.length} JSON-LD block(s) failed to parse.`);

    // Entity clarity
    const domain = new URL(pageRes.finalUrl || normalizedUrl).hostname;
    const ogSiteName = extractMeta(html, 'og:site_name');
    const inferredName = extractBrandName(title, ogSiteName, domain);
    const hasOrgSchema = schemaTypes.some((t) => /organization/i.test(t));
    const brandMentions = inferredName ? (html.match(new RegExp(inferredName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length : 0;

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

    return result;
  });

function scoreLabelText(score: number): string {
  if (score >= 80) return 'Strong technical AEO readiness';
  if (score >= 60) return 'Good foundation with improvement opportunities';
  if (score >= 40) return 'Partial readiness, several important gaps';
  return 'Weak technical AEO readiness';
}

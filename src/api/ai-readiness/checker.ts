import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  FETCH_TIMEOUT_MS,
  MAX_REDIRECTS,
  normalizeOrigin,
  validateUrl,
  fetchWithTimeout,
} from './shared';

// ---------- Constants ----------

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_LINKS_TO_CHECK = 20;
const MAX_CONTENT_LENGTH_TO_PARSE = 500_000; // 500 KB for parsing

const AI_CRAWLERS = [
  { name: 'GPTBot', userAgent: 'GPTBot' },
  { name: 'OAI-SearchBot', userAgent: 'OAI-SearchBot' },
  { name: 'ChatGPT-User', userAgent: 'ChatGPT-User' },
  { name: 'ClaudeBot', userAgent: 'ClaudeBot' },
  { name: 'Claude-SearchBot', userAgent: 'Claude-SearchBot' },
  { name: 'PerplexityBot', userAgent: 'PerplexityBot' },
  { name: 'Perplexity-User', userAgent: 'Perplexity-User' },
  { name: 'Google-Extended', userAgent: 'Google-Extended' },
] as const;

// ---------- Zod schemas ----------

const inputSchema = z.object({
  url: z.string().trim().min(1, 'Please enter a URL'),
});

// ---------- Types ----------

type CrawlerAccess = 'allowed' | 'blocked' | 'unknown';

export interface CheckResult {
  normalizedUrl: string;
  checkedAt: string;
  score: number;
  llmsTxt: {
    exists: boolean;
    url: string;
    statusCode?: number;
    contentType?: string;
    sizeBytes?: number;
    structure?: {
      hasH1: boolean;
      hasSummary: boolean;
      sectionCount: number;
      linkCount: number;
      internalLinkCount: number;
      externalLinkCount: number;
      issues: string[];
      warnings: string[];
    };
    links?: {
      checked: number;
      valid: number;
      broken: number;
      redirected: number;
    };
  };
  llmsFullTxt: {
    exists: boolean;
    url: string;
    statusCode?: number;
    sizeBytes?: number;
  };
  sitemap: {
    exists: boolean;
    url?: string;
    statusCode?: number;
  };
  robotsTxt: {
    exists: boolean;
    url: string;
    statusCode?: number;
    crawlers: Array<{
      name: string;
      userAgent: string;
      access: CrawlerAccess;
      note?: string;
    }>;
  };
  recommendations: string[];
}

// ---------- Fetch helpers ----------

async function fetchResource(url: string): Promise<{
  statusCode: number;
  body: string | null;
  contentType: string | null;
  sizeBytes: number;
  finalUrl: string;
}> {
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount < MAX_REDIRECTS) {
    let res: Response;
    try {
      res = await fetchWithTimeout(currentUrl);
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return {
          statusCode: 0,
          body: null,
          contentType: null,
          sizeBytes: 0,
          finalUrl: currentUrl,
        };
      }
      return {
        statusCode: 0,
        body: null,
        contentType: null,
        sizeBytes: 0,
        finalUrl: currentUrl,
      };
    }

    const status = res.status;
    const ct = res.headers.get('content-type') ?? null;

    // Handle redirects
    if ([301, 302, 303, 307, 308].includes(status)) {
      const location = res.headers.get('location');
      if (location) {
        const resolvedUrl = new URL(location, currentUrl).href;
        try {
          validateUrl(resolvedUrl);
        } catch {
          return {
            statusCode: 0,
            body: null,
            contentType: null,
            sizeBytes: 0,
            finalUrl: resolvedUrl,
          };
        }
        currentUrl = resolvedUrl;
        redirectCount++;
        continue;
      }
    }

    // Read body up to size limit
    let body: string | null = null;
    let sizeBytes = 0;
    if (status >= 200 && status < 400) {
      try {
        const text = await res.text();
        sizeBytes = new TextEncoder().encode(text).length;
        if (sizeBytes <= MAX_FILE_SIZE_BYTES) {
          body = text;
        } else {
          body = text.slice(0, MAX_FILE_SIZE_BYTES);
          sizeBytes = MAX_FILE_SIZE_BYTES;
        }
      } catch {
        body = null;
        sizeBytes = 0;
      }
    }

    return {
      statusCode: status,
      body,
      contentType: ct,
      sizeBytes,
      finalUrl: currentUrl,
    };
  }

  return {
    statusCode: 0,
    body: null,
    contentType: null,
    sizeBytes: 0,
    finalUrl: currentUrl,
  };
}

// ---------- LLMs.txt parsing ----------

function parseLlmsTxt(body: string, baseUrl: string) {
  const lines = body.split('\n');
  const issues: string[] = [];
  const warnings: string[] = [];

  let hasH1 = false;
  let hasSummary = false;
  let sectionCount = 0;
  const links: Array<{ url: string; internal: boolean; text: string }> = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // H1: starts with single #
    if (/^#\s/.test(trimmed) && !/^##/.test(trimmed)) {
      hasH1 = true;
    }

    // H2+: section headings
    if (/^##+\s/.test(trimmed)) {
      sectionCount++;
    }

    // Summary: blockquote starting with >
    if (/^>\s/.test(trimmed)) {
      hasSummary = true;
    }

    // Links: [text](url) or [text](url "title")
    const linkRegex = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let match = linkRegex.exec(trimmed);
    while (match !== null) {
      const linkUrl = match[2];
      if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
        const isInternal = linkUrl.startsWith(baseUrl);
        links.push({ url: linkUrl, internal: isInternal, text: match[1] });
      } else if (linkUrl.startsWith('/') || !linkUrl.includes('://')) {
        // Count relative links but flag as warning
        try {
          const resolved = new URL(linkUrl, baseUrl).href;
          const isInternal = resolved.startsWith(baseUrl);
          links.push({ url: resolved, internal: isInternal, text: match[1] });
        } catch {
          // Invalid relative URL, skip
        }
      }
      match = linkRegex.exec(trimmed);
    }
  }

  // Issues
  if (!hasH1) issues.push('Missing H1 title (# Title)');
  if (!hasSummary) issues.push('Missing summary or intro section (> quote)');
  if (sectionCount === 0) issues.push('No section headings found');

  // Warnings
  if (links.length === 0) warnings.push('No links found in LLMs.txt');
  if (body.length === 0 || body.trim().length === 0)
    issues.push('LLMs.txt file is empty');

  // Check for obvious broken markdown
  const unclosedLinks = (body.match(/\[[^\]]*\]\(/g) || []).length;
  const closingParens = (body.match(/\]\([^)]*\)/g) || []).length;
  if (unclosedLinks !== closingParens) {
    issues.push('Possible broken Markdown links detected');
  }

  const internalLinks = links.filter((l) => l.internal);
  const externalLinks = links.filter((l) => !l.internal);

  return {
    hasH1,
    hasSummary,
    sectionCount,
    linkCount: links.length,
    internalLinkCount: internalLinks.length,
    externalLinkCount: externalLinks.length,
    issues,
    warnings,
    links,
  };
}

// ---------- Robots.txt parsing ----------

function parseRobotsTxt(body: string): {
  crawlers: Array<{
    name: string;
    userAgent: string;
    access: CrawlerAccess;
    note?: string;
  }>;
  sitemapUrl?: string;
} {
  const lower = body.toLowerCase();
  const lines = lower.split('\n');

  // Extract sitemap
  let sitemapUrl: string | undefined;
  for (const line of lines) {
    const match = line.match(/^sitemap:\s*(.+)$/i);
    if (match) {
      sitemapUrl = match[1].trim();
      break;
    }
  }

  // Parse user-agent blocks
  const crawlers: Array<{
    name: string;
    userAgent: string;
    access: CrawlerAccess;
    note?: string;
  }> = [];

  for (const crawler of AI_CRAWLERS) {
    const uaLower = crawler.userAgent.toLowerCase();
    let access: CrawlerAccess = 'unknown';
    let foundBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('user-agent:')) {
        const agent = line.slice('user-agent:'.length).trim();
        if (agent !== uaLower) continue;
        foundBlock = true;
        // Look at the following lines for Disallow/Allow rules
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('user-agent:')) break; // next block
          if (nextLine.startsWith('disallow:')) {
            const path = nextLine.slice('disallow:'.length).trim();
            if (path === '/' || path === '') {
              access = 'blocked';
            } else if (path === '/' + crawler.userAgent.toLowerCase()) {
              access = 'blocked';
            }
          }
          if (nextLine.startsWith('allow:')) {
            const path = nextLine.slice('allow:'.length).trim();
            if (path === '/' || path === '') {
              access = 'allowed';
            }
          }
        }
      }
    }

    if (!foundBlock) {
      // Check wildcard user-agent
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === 'user-agent: *') {
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (nextLine.startsWith('user-agent:')) break;
            if (nextLine.startsWith('disallow:')) {
              const path = nextLine.slice('disallow:'.length).trim();
              if (path === '/') {
                access = 'blocked';
                break;
              }
            }
          }
          break;
        }
      }
    }

    if (access === 'unknown' && foundBlock) {
      access = 'allowed'; // explicitly listed but no block found
    }

    crawlers.push({
      name: crawler.name,
      userAgent: crawler.userAgent,
      access,
    });
  }

  return { crawlers, sitemapUrl };
}

// ---------- Sitemap parsing ----------

async function fetchSitemap(
  normalizedUrl: string,
  robotsTxtSitemapUrl?: string
): Promise<{ exists: boolean; url?: string; statusCode?: number }> {
  // Try robots.txt sitemap first, then default
  const urlsToTry: string[] = [];
  if (robotsTxtSitemapUrl) {
    try {
      validateUrl(robotsTxtSitemapUrl);
      urlsToTry.push(robotsTxtSitemapUrl);
    } catch {
      // Skip invalid sitemap URL from robots.txt
    }
  }
  urlsToTry.push(`${normalizedUrl}/sitemap.xml`);

  for (const url of urlsToTry) {
    const result = await fetchResource(url);
    if (result.statusCode >= 200 && result.statusCode < 400) {
      return {
        exists: true,
        url: result.finalUrl,
        statusCode: result.statusCode,
      };
    }
    // If this URL failed, continue to try the next one
  }

  return { exists: false };
}

// ---------- Score calculation ----------

function calculateScore(result: CheckResult): number {
  let score = 0;

  // LLMs.txt exists: 20
  if (result.llmsTxt.exists) score += 20;

  // LLMs.txt structure: 20
  if (result.llmsTxt.structure) {
    const s = result.llmsTxt.structure;
    if (s.hasH1) score += 5;
    if (s.hasSummary) score += 5;
    if (s.sectionCount >= 2) score += 5;
    if (s.linkCount >= 3) score += 5;
    // Cap at 0 if no structure at all
  }

  // LLMs.txt links accessible: 15
  if (result.llmsTxt.links) {
    const l = result.llmsTxt.links;
    if (l.checked > 0) {
      const ratio = l.valid / Math.max(l.checked, 1);
      score += Math.round(ratio * 15);
    }
  }

  // LLMs-full.txt exists: 10
  if (result.llmsFullTxt.exists) score += 10;

  // Sitemap exists: 15
  if (result.sitemap.exists) score += 15;

  // AI crawler access: 20
  if (result.robotsTxt.exists) {
    const crawlers = result.robotsTxt.crawlers;
    const allowed = crawlers.filter((c) => c.access === 'allowed').length;
    const total = crawlers.length;
    score += Math.round((allowed / Math.max(total, 1)) * 20);
  }

  return Math.min(score, 100);
}

// ---------- Recommendations ----------

function generateRecommendations(result: CheckResult): string[] {
  const recs: string[] = [];

  if (!result.llmsTxt.exists) {
    recs.push('Add an /llms.txt file to your site root.');
  }

  if (result.llmsTxt.structure) {
    const s = result.llmsTxt.structure;
    if (!s.hasH1) recs.push('Add an H1 title to your LLMs.txt file.');
    if (!s.hasSummary) {
      recs.push('Add a short site summary at the top of your LLMs.txt file.');
    }
    if (s.sectionCount < 2) {
      recs.push('Group important URLs under clear section headings.');
    }
    if (s.issues.length > 0) {
      for (const issue of s.issues) {
        if (issue.includes('empty')) {
          recs.push('Your LLMs.txt file is empty. Add meaningful content.');
        }
        if (issue.includes('Markdown')) {
          recs.push('Fix broken Markdown links in your LLMs.txt file.');
        }
      }
    }
    if (s.linkCount === 0) {
      recs.push('Add relevant page links to your LLMs.txt file.');
    }
  }

  if (result.llmsTxt.links && result.llmsTxt.links.broken > 0) {
    recs.push('Fix broken links in your LLMs.txt file.');
  }

  if (!result.llmsFullTxt.exists) {
    recs.push(
      'Consider adding an LLMs-full.txt file for deeper content coverage.'
    );
  }

  if (!result.sitemap.exists) {
    recs.push('Add a sitemap.xml or reference your sitemap in robots.txt.');
  }

  if (result.robotsTxt.exists) {
    const blocked = result.robotsTxt.crawlers.filter(
      (c) => c.access === 'blocked'
    );
    for (const c of blocked) {
      recs.push(`Review robots.txt rules that block ${c.userAgent}.`);
    }
  } else {
    recs.push('Add a robots.txt file to control crawler access.');
  }

  // Deduplicate and limit
  const unique = [...new Set(recs)];
  return unique.slice(0, 10);
}

// ---------- Main server function ----------

export const checkAiReadiness = createServerFn({ method: 'POST' })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<CheckResult> => {
    const normalizedUrl = normalizeOrigin(data.url);
    const checkedAt = new Date().toISOString();

    // Fetch all resources in parallel
    const [llmsTxtRes, llmsFullTxtRes, robotsTxtRes] = await Promise.all([
      fetchResource(`${normalizedUrl}/llms.txt`),
      fetchResource(`${normalizedUrl}/llms-full.txt`),
      fetchResource(`${normalizedUrl}/robots.txt`),
    ]);

    // Parse robots.txt for sitemap and crawlers
    let robotsTxtParsed: {
      crawlers: Array<{
        name: string;
        userAgent: string;
        access: CrawlerAccess;
        note?: string;
      }>;
      sitemapUrl?: string;
    } = {
      crawlers: AI_CRAWLERS.map((c) => ({
        name: c.name,
        userAgent: c.userAgent,
        access: 'unknown' as CrawlerAccess,
      })),
    };

    if (robotsTxtRes.body) {
      robotsTxtParsed = parseRobotsTxt(robotsTxtRes.body);
    }

    // Fetch sitemap
    const sitemapRes = await fetchSitemap(
      normalizedUrl,
      robotsTxtParsed.sitemapUrl
    );

    // Parse LLMs.txt
    let structure: CheckResult['llmsTxt']['structure'] | undefined;
    let links: CheckResult['llmsTxt']['links'] | undefined;

    if (
      llmsTxtRes.body &&
      llmsTxtRes.body.length <= MAX_CONTENT_LENGTH_TO_PARSE
    ) {
      const parsed = parseLlmsTxt(llmsTxtRes.body, normalizedUrl);

      structure = {
        hasH1: parsed.hasH1,
        hasSummary: parsed.hasSummary,
        sectionCount: parsed.sectionCount,
        linkCount: parsed.linkCount,
        internalLinkCount: parsed.internalLinkCount,
        externalLinkCount: parsed.externalLinkCount,
        issues: parsed.issues,
        warnings: parsed.warnings,
      };

      // Check link accessibility (first MAX_LINKS_TO_CHECK)
      const linksToCheck = parsed.links.slice(0, MAX_LINKS_TO_CHECK);
      let valid = 0;
      let broken = 0;
      let redirected = 0;

      if (linksToCheck.length > 0) {
        const linkResults = await Promise.allSettled(
          linksToCheck.map(async (link) => {
            try {
              validateUrl(link.url);
            } catch {
              return 'broken';
            }
            const result = await fetchResource(link.url);
            if (result.statusCode >= 200 && result.statusCode < 300) {
              return 'valid';
            } else if (result.statusCode >= 300 && result.statusCode < 400) {
              return 'redirected';
            } else {
              return 'broken';
            }
          })
        );

        for (const r of linkResults) {
          if (r.status === 'fulfilled') {
            if (r.value === 'valid') valid++;
            else if (r.value === 'redirected') redirected++;
            else broken++;
          } else {
            broken++;
          }
        }
      }

      links = {
        checked: linksToCheck.length,
        valid,
        broken,
        redirected,
      };
    }

    // Build result
    const result: CheckResult = {
      normalizedUrl,
      checkedAt,
      score: 0,
      llmsTxt: {
        exists: llmsTxtRes.statusCode >= 200 && llmsTxtRes.statusCode < 400,
        url: `${normalizedUrl}/llms.txt`,
        statusCode: llmsTxtRes.statusCode || undefined,
        contentType: llmsTxtRes.contentType || undefined,
        sizeBytes: llmsTxtRes.body ? llmsTxtRes.sizeBytes : undefined,
        structure,
        links,
      },
      llmsFullTxt: {
        exists:
          llmsFullTxtRes.statusCode >= 200 && llmsFullTxtRes.statusCode < 400,
        url: `${normalizedUrl}/llms-full.txt`,
        statusCode: llmsFullTxtRes.statusCode || undefined,
        sizeBytes: llmsFullTxtRes.body ? llmsFullTxtRes.sizeBytes : undefined,
      },
      sitemap: {
        exists: sitemapRes.exists,
        url: sitemapRes.url,
        statusCode: sitemapRes.statusCode,
      },
      robotsTxt: {
        exists: robotsTxtRes.statusCode >= 200 && robotsTxtRes.statusCode < 400,
        url: `${normalizedUrl}/robots.txt`,
        statusCode: robotsTxtRes.statusCode || undefined,
        crawlers: robotsTxtParsed.crawlers,
      },
      recommendations: [],
    };

    // Calculate score and recommendations
    result.score = calculateScore(result);
    result.recommendations = generateRecommendations(result);

    return result;
  });

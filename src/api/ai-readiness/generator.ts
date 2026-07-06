import { createServerFn } from '@tanstack/react-start';
import { csrfMiddleware } from '@/lib/csrf';
import { enforceRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import {
  MAX_REDIRECTS,
  normalizeOrigin,
  normalizeUrlKeepPath,
  fetchWithTimeout,
} from './shared';
import { runAi, parseAiJson } from './ai';

// ---------- Constants ----------

const MAX_SITEMAP_URLS = 30;
const MAX_TITLE_FETCH_SIZE = 200_000; // 200 KB max per page for title extraction

// ---------- Zod schemas ----------

const sitemapInputSchema = z.object({
  mode: z.literal('sitemap'),
  url: z.string().trim().min(1, 'Please enter a URL'),
});

const manualInputSchema = z.object({
  mode: z.literal('manual'),
  siteName: z.string().trim().min(1, 'Please enter a site name'),
  summary: z.string().trim().optional().default(''),
  sections: z
    .array(
      z.object({
        title: z.string().trim().min(1),
        links: z
          .array(
            z.object({
              title: z.string().trim().min(1),
              url: z.string().trim().min(1),
              description: z.string().trim().optional().default(''),
            })
          )
          .min(1, 'Each section must include at least one link'),
      })
    )
    .min(1, 'Please add at least one section'),
});

const inputSchema = z.discriminatedUnion('mode', [
  sitemapInputSchema,
  manualInputSchema,
]);

// ---------- Types ----------

interface GeneratorResult {
  siteName: string;
  sourceUrls?: string[];
  markdown: string;
  warnings: string[];
}

// ---------- Fetch helpers ----------

async function fetchText(
  url: string
): Promise<{ body: string | null; finalUrl: string; statusCode: number }> {
  let currentUrl = url;
  let redirectCount = 0;

  while (redirectCount < MAX_REDIRECTS) {
    let res: Response;
    try {
      res = await fetchWithTimeout(currentUrl);
    } catch {
      return { body: null, finalUrl: currentUrl, statusCode: 0 };
    }

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (location) {
        try {
          currentUrl = normalizeUrlKeepPath(new URL(location, currentUrl).href);
        } catch {
          return { body: null, finalUrl: currentUrl, statusCode: 0 };
        }
        redirectCount++;
        continue;
      }
    }

    if (res.status >= 200 && res.status < 400) {
      try {
        const text = await res.text();
        return { body: text, finalUrl: currentUrl, statusCode: res.status };
      } catch {
        return { body: null, finalUrl: currentUrl, statusCode: res.status };
      }
    }

    return { body: null, finalUrl: currentUrl, statusCode: res.status };
  }

  return { body: null, finalUrl: currentUrl, statusCode: 0 };
}

// ---------- Sitemap parsing ----------

function extractUrlsFromSitemap(xml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  let match = locRegex.exec(xml);
  while (match !== null) {
    const url = match[1].trim();
    // Validate that the URL is safe before adding
    try {
      const normalized = normalizeUrlKeepPath(url);
      urls.push(normalized);
    } catch {
      // Skip unsafe URLs (private hosts, non-http protocols, etc.)
    }
    match = locRegex.exec(xml);
  }
  return urls;
}

// ---------- Title / meta extraction ----------

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractMetaDescription(html: string): string | null {
  const match =
    html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i
    );
  return match ? match[1].trim() : null;
}

function urlPathToTitle(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, '');
    if (!path || path === '/') return 'Home';
    const segments = path.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    return last.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}

// ---------- Markdown generation ----------

function generateMarkdown(
  siteName: string,
  summary: string,
  sections: Array<{
    title: string;
    links: Array<{ title: string; url: string; description?: string }>;
  }>
): string {
  const lines: string[] = [];

  lines.push(`# ${siteName}`);
  lines.push('');

  if (summary) {
    lines.push(`> ${summary}`);
    lines.push('');
  }

  for (const section of sections) {
    if (!section.links || section.links.length === 0) continue;
    lines.push(`## ${section.title}`);
    lines.push('');
    for (const link of section.links) {
      const desc = link.description ? `: ${link.description}` : '';
      lines.push(`- [${link.title}](${link.url})${desc}`);
    }
    lines.push('');
  }

  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n') + '\n';
}

// ---------- Sitemap mode handler ----------

async function handleSitemapMode(inputUrl: string): Promise<GeneratorResult> {
  const warnings: string[] = [];

  // Determine if input is a sitemap URL or a domain
  const trimmed = inputUrl.trim();
  const isSitemapUrl = trimmed.toLowerCase().endsWith('.xml');

  let sitemapUrl: string;
  if (isSitemapUrl) {
    // Keep the full path for sitemap URLs
    sitemapUrl = normalizeUrlKeepPath(trimmed);
  } else {
    const origin = normalizeOrigin(trimmed);
    sitemapUrl = `${origin}/sitemap.xml`;
  }

  // Fetch sitemap
  const sitemapRes = await fetchText(sitemapUrl);
  if (!sitemapRes.body) {
    throw new Error(
      `Could not fetch sitemap from ${sitemapUrl}. Make sure the URL is correct and the site has a sitemap.`
    );
  }

  const rawUrls = extractUrlsFromSitemap(sitemapRes.body);
  if (rawUrls.length === 0) {
    throw new Error('No URLs found in the sitemap.');
  }

  const sourceUrls = rawUrls.slice(0, MAX_SITEMAP_URLS);
  if (rawUrls.length > MAX_SITEMAP_URLS) {
    warnings.push(
      `Sitemap contains ${rawUrls.length} URLs. Only the first ${MAX_SITEMAP_URLS} were processed.`
    );
  }

  // Infer site name from domain
  const domain = new URL(sitemapUrl).hostname.replace(/^www\./, '');
  let siteName = domain.charAt(0).toUpperCase() + domain.slice(1);

  // Fetch titles for each URL (in parallel batches)
  const BATCH_SIZE = 5;
  const links: Array<{
    title: string;
    url: string;
    description?: string;
  }> = [];

  for (let i = 0; i < sourceUrls.length; i += BATCH_SIZE) {
    const batch = sourceUrls.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (pageUrl) => {
        const res = await fetchText(pageUrl);
        if (!res.body) {
          return null;
        }
        const snippet = res.body.slice(0, MAX_TITLE_FETCH_SIZE);
        const title = extractTitle(snippet) || urlPathToTitle(pageUrl);
        const desc = extractMetaDescription(snippet) || undefined;
        return { title, url: pageUrl, description: desc };
      })
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      if (r.status === 'fulfilled' && r.value !== null) {
        links.push(r.value);
      } else {
        // Skip failed URLs (don't fabricate entries)
      }
    }
  }

  // Try to detect site name from the first page's title
  if (links.length > 0 && links[0].title) {
    const homeTitle = links[0].title;
    const sepMatch = homeTitle.match(/^(.+?)\s+[-|:]\s+.+$/);
    if (sepMatch) {
      siteName = sepMatch[1].trim();
    }
  }

  // Group links into sections
  const mainPages: typeof links = [];
  const otherPages: typeof links = [];

  for (const link of links) {
    try {
      const path = new URL(link.url).pathname;
      if (
        path === '/' ||
        path === '' ||
        path.split('/').filter(Boolean).length <= 1
      ) {
        mainPages.push(link);
      } else {
        otherPages.push(link);
      }
    } catch {
      otherPages.push(link);
    }
  }

  const sections: Array<{
    title: string;
    links: Array<{ title: string; url: string; description?: string }>;
  }> = [];

  if (mainPages.length > 0) {
    sections.push({ title: 'Main Pages', links: mainPages });
  }
  if (otherPages.length > 0) {
    sections.push({ title: 'More Pages', links: otherPages });
  }

  const summary = `A collection of pages from ${siteName}.`;
  const markdown = generateMarkdown(siteName, summary, sections);

  return { siteName, sourceUrls, markdown, warnings };
}

// ---------- Manual mode handler ----------

function handleManualMode(
  data: z.infer<typeof manualInputSchema>
): GeneratorResult {
  const sections = data.sections.map((s) => ({
    title: s.title,
    links: s.links.map((l) => ({
      title: l.title,
      url: normalizeUrlKeepPath(l.url),
      description: l.description || undefined,
    })),
  }));

  const markdown = generateMarkdown(data.siteName, data.summary, sections);
  return { siteName: data.siteName, markdown, warnings: [] };
}

// ---------- Main server function ----------

export const generateLlmsTxt = createServerFn({ method: 'POST' })
  .middleware([csrfMiddleware])
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<GeneratorResult> => {
    await enforceRateLimit('llmsGenerate');
    if (data.mode === 'sitemap') {
      return handleSitemapMode(data.url);
    }
    return handleManualMode(data);
  });

const enhanceInputSchema = z.object({
  markdown: z.string().min(1),
  siteName: z.string().min(1),
});

export interface EnhanceResult {
  markdown: string;
  changes: string[];
}

const ENHANCE_PROMPT = `You are an expert at writing LLMs.txt files for AI search readiness. Given a draft LLMs.txt file, improve it:

1. Polish the site summary line (after "> ") to be concise and informative
2. Improve link descriptions to be useful for AI systems — describe what each page contains, not just its name
3. Add or improve section names if they're vague (e.g. "More Pages" → better grouping)

Return ONLY valid JSON:
{
  "markdown": "the full improved LLMs.txt content",
  "changes": ["change 1", "change 2"]
}

Preserve the exact H1 site name. Keep all links and URLs unchanged.`;

export const enhanceLlmsTxt = createServerFn({ method: 'POST' })
  .middleware([csrfMiddleware])
  .inputValidator(enhanceInputSchema)
  .handler(async ({ data }): Promise<EnhanceResult> => {
    await enforceRateLimit('llmsGenerate');
    const aiResult = await runAi({
      feature: 'llms-polish',
      systemPrompt: ENHANCE_PROMPT,
      userPrompt: `Site: ${data.siteName}\n\nDraft LLMs.txt:\n${data.markdown}`,
      maxTokens: 1200,
    });

    if (aiResult) {
      const parsed = parseAiJson(aiResult.text) as Record<
        string,
        unknown
      > | null;
      if (parsed && typeof parsed.markdown === 'string') {
        return {
          markdown: String(parsed.markdown),
          changes: Array.isArray(parsed.changes)
            ? parsed.changes.map(String)
            : [],
        };
      }
    }

    // Fallback: return original unchanged
    return { markdown: data.markdown, changes: [] };
  });

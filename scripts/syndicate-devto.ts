/**
 * Syndicate blog posts to dev.to with canonical URLs pointing back to aeocheck.xyz.
 *
 * Usage:
 *   DEVTO_API_KEY=EucfxQz3xBubzxJeeuJ2PQJd npx tsx scripts/syndicate-devto.ts
 *
 * Safe to re-run — existing articles (matched by canonical_url) are updated
 * instead of duplicated.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const DEVTO_API = 'https://dev.to/api';
const BASE_URL = 'https://aeocheck.xyz';
const CONTENT_DIR = path.resolve(import.meta.dirname, '../content/blog');

const API_KEY = process.env.DEVTO_API_KEY;
if (!API_KEY) {
  console.error('DEVTO_API_KEY env var is required');
  process.exit(1);
}

interface Frontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  image?: string;
}

interface DevtoArticle {
  id: number;
  title: string;
  canonical_url: string;
  url: string;
  published_at: string;
}

function parseFrontmatter(raw: string): { fm: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');
  const fm: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    fm[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return {
    fm: fm as unknown as Frontmatter,
    body: match[2].trim(),
  };
}

async function listArticles(): Promise<DevtoArticle[]> {
  const res = await fetch(`${DEVTO_API}/articles/me?per_page=100`, {
    headers: {
      'api-key': API_KEY!,
      'User-Agent': 'aeocheck-syndicate/1.0',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`listArticles failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function createArticle(payload: {
  title: string;
  body_markdown: string;
  canonical_url: string;
  description: string;
  tags: string[];
  published: boolean;
  organization_id?: number;
}): Promise<DevtoArticle> {
  const body = new URLSearchParams();
  body.set('article[title]', payload.title);
  body.set('article[body_markdown]', payload.body_markdown);
  body.set('article[canonical_url]', payload.canonical_url);
  body.set('article[description]', payload.description);
  body.set('article[published]', String(payload.published));
  for (const tag of payload.tags.slice(0, 4)) {
    body.append('article[tags][]', tag);
  }
  if (payload.organization_id) {
    body.set('article[organization_id]', String(payload.organization_id));
  }

  const res = await fetch(`${DEVTO_API}/articles`, {
    method: 'POST',
    headers: {
      'api-key': API_KEY!,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'aeocheck-syndicate/1.0',
    },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createArticle failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function updateArticle(
  id: number,
  payload: {
    title: string;
    body_markdown: string;
    canonical_url: string;
    description: string;
    tags: string[];
    published: boolean;
  }
): Promise<DevtoArticle> {
  const body = new URLSearchParams();
  body.set('article[title]', payload.title);
  body.set('article[body_markdown]', payload.body_markdown);
  body.set('article[canonical_url]', payload.canonical_url);
  body.set('article[description]', payload.description);
  body.set('article[published]', String(payload.published));
  for (const tag of payload.tags.slice(0, 4)) {
    body.append('article[tags][]', tag);
  }

  const res = await fetch(`${DEVTO_API}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'api-key': API_KEY!,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'aeocheck-syndicate/1.0',
    },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`updateArticle failed: ${res.status} ${text}`);
  }
  return res.json();
}

function categoryToTags(category: string): string[] {
  const mapping: Record<string, string[]> = {
    Articles: ['seo', 'ai', 'contentstrategy'],
    Guides: ['tutorial', 'seo', 'ai'],
    'How-to': ['tutorial', 'ai', 'productivity'],
    Tutorial: ['tutorial', 'seo'],
  };
  return mapping[category] ?? ['seo', 'ai', 'webdev'];
}

function transformBody(body: string, slug: string, title: string): string {
  // Remove the CTA block at the end (starts with ---\n> **...** followed by ---)
  // Keep the main content, add a "Originally published" link at the bottom
  let cleaned = body;

  // Remove the closing CTA block (---\n> ...\n--- at end)
  // Match the last --- delimited block
  const ctaMatch = cleaned.match(/\n---\n> [\s\S]*?\n---\s*$/);
  if (ctaMatch) {
    cleaned = cleaned.slice(0, cleaned.lastIndexOf(ctaMatch[0]));
  }

  // Strip internal links (keep absolute URLs, make relative links absolute)
  cleaned = cleaned.replace(
    /\]\(\/(tools|compare|blog|guides|glossary|sample-aeo-report|methodology|references|about|contact|press)\/[^)]*\)/g,
    (match) => {
      return match.replace('](/', `](${BASE_URL}/`);
    }
  );

  // Fix any remaining relative links
  cleaned = cleaned.replace(/\]\(\/([^)]+)\)/g, `](${BASE_URL}/$1)`);

  // Add originally published note
  const publishedNote = `\n\n---\n\n*Originally published at [aeocheck.xyz](${BASE_URL}/blog/${slug}) — free AI search readiness tools.*`;

  return cleaned + publishedNote;
}

async function main() {
  console.log('Fetching existing dev.to articles...');
  const existing = await listArticles();
  const byCanonical = new Map<string, DevtoArticle>();
  for (const a of existing) {
    if (a.canonical_url) byCanonical.set(a.canonical_url, a);
  }
  console.log(`Found ${existing.length} existing articles, ${byCanonical.size} with canonical URLs\n`);

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { fm, body } = parseFrontmatter(raw);
    const slug = file.replace('.md', '');
    const canonical = `${BASE_URL}/blog/${slug}`;

    const articleBody = transformBody(body, slug, fm.title);
    const tags = categoryToTags(fm.category);

    const existingArticle = byCanonical.get(canonical);

    if (existingArticle) {
      console.log(`[UPDATE] ${fm.title}`);
      await updateArticle(existingArticle.id, {
        title: fm.title,
        body_markdown: articleBody,
        canonical_url: canonical,
        description: fm.description,
        tags,
        published: true,
      });
      updated++;
    } else {
      console.log(`[CREATE] ${fm.title}`);
      await createArticle({
        title: fm.title,
        body_markdown: articleBody,
        canonical_url: canonical,
        description: fm.description,
        tags,
        published: true,
      });
      created++;
    }

    // dev.to rate limit: ~10 requests per 30 seconds for new articles
    // 35s delay keeps us comfortably under the limit
    console.log('  waiting 35s for rate limit...');
    await new Promise((r) => setTimeout(r, 35_000));
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

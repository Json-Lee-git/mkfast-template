import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { getBlogLastmod, getBlogPageRedirect } from '@/lib/blog';

vi.mock('content-collections', () => ({ allBlogs: [] }));

const routesDirectory = path.resolve('src/routes');

const toolRoutes = [
  'tools.ai-crawler-checker.tsx',
  'tools.robots-txt-ai-crawler-checker.tsx',
  'tools.geo-audit.tsx',
  'tools.ai-overview-readiness-checker.tsx',
  'tools.chatgpt-citation-readiness-checker.tsx',
];

const compareRoutes = [
  'compare.aeo-checker-alternatives.tsx',
  'compare.aeo-checker-vs-seo-tools.tsx',
  'compare.llms-txt-checker-alternatives.tsx',
  'compare.ai-search-readiness-report-worth-it.tsx',
];

function readRoute(fileName: string): string {
  return fs.readFileSync(path.join(routesDirectory, fileName), 'utf8');
}

describe('blog pagination canonicalization', () => {
  it.each([
    'invalid',
    '1.5',
    '0',
    '-1',
    'Infinity',
    '',
    ' ',
    '02',
    '2e0',
    '0x2',
    '+2',
    '2.0',
  ])('redirects invalid page %s to the blog root', (page) => {
    expect(getBlogPageRedirect(page)).toBe('/blog');
  });

  it('redirects page 1 to the blog root', () => {
    expect(getBlogPageRedirect('1')).toBe('/blog');
  });

  it('redirects repeated page parameters to the blog root', () => {
    expect(getBlogPageRedirect('2', 2)).toBe('/blog');
  });

  it('keeps the root and canonical pagination pages unchanged', () => {
    expect(getBlogPageRedirect(null)).toBeUndefined();
    expect(getBlogPageRedirect('2')).toBeUndefined();
    expect(getBlogPageRedirect('999')).toBeUndefined();
  });

  it('reads the raw search string instead of the parsed search object', () => {
    const source = readRoute('blog/index.tsx');

    expect(source).toContain('location.searchStr');
    expect(source).not.toContain('new URLSearchParams(location.search)');
    expect(source).toContain('page: search.page');
    expect(source).not.toContain('Number(search.page)');
    expect(source).toContain('if (page > pagination.totalPages)');
    expect(source).toContain('throw notFound()');
  });
});

describe('sitemap blog dates', () => {
  it('prefers the updated date and falls back to the published date', () => {
    expect(getBlogLastmod({ date: '2026-01-02', updated: '2026-06-07' })).toBe(
      '2026-06-07'
    );
    expect(getBlogLastmod({ date: '2026-01-02' })).toBe('2026-01-02');
  });

  it('uses the shared lastmod helper in the sitemap route', () => {
    const source = readRoute('sitemap[.]xml.ts');

    expect(source).toContain('lastmod: getBlogLastmod(p)');
  });
});

describe('sample report heading', () => {
  it('has one visible H1 with the audit report title', () => {
    const source = readRoute('sample-aeo-report.tsx');
    const headings = source.match(/<h1\b/g) ?? [];

    expect(headings).toHaveLength(1);
    expect(source).toMatch(
      /<h1[^>]*>\s*Sample AI Visibility Audit Report\s*<\/h1>/
    );
  });
});

describe('tool structured data', () => {
  it.each(toolRoutes)('does not output a hidden FAQ schema in %s', (route) => {
    const source = readRoute(route);

    expect(source).not.toContain('faqSchema');
    expect(source).not.toContain('faqItems');
    expect(source).not.toContain("'@type': 'FAQPage'");
  });
});

describe('compare route links and breadcrumbs', () => {
  it.each(compareRoutes)('has no UTM parameters in %s', (route) => {
    expect(readRoute(route)).not.toMatch(
      /utm_(source|medium|campaign|content)=/
    );
  });

  it.each(compareRoutes)('uses Home then the current page in %s', (route) => {
    const source = readRoute(route);
    const breadcrumbCall = source.match(/breadcrumbSchema\(\[([\s\S]*?)\]\)/);

    expect(breadcrumbCall).not.toBeNull();
    expect(breadcrumbCall?.[1]).not.toContain("name: 'Compare'");
    expect(breadcrumbCall?.[1].match(/name:/g)).toHaveLength(2);
  });
});

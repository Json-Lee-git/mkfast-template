import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/env/client', () => ({
  clientEnv: { VITE_BASE_URL: 'https://aeocheck.example/' },
}));

vi.mock('@/config/website', () => ({
  websiteConfig: {
    metadata: {
      name: 'AEOCheck',
      description: 'AI search readiness tools',
      images: { logoLight: '/logo.png' },
    },
    social: {},
  },
}));

vi.mock('@/lib/locale', () => ({
  getLocale: () => 'en',
  localizeHref: (href: string) => href,
  deLocalizeHref: (href: string) => href,
}));

import {
  articleId,
  articleSchema,
  breadcrumbId,
  breadcrumbSchema,
  editorialTeamId,
  jsonLd,
  organizationId,
  organizationSchema,
  schemaReference,
  softwareApplicationSchema,
  webPageId,
  webPageSchema,
  websiteId,
  websiteSchema,
} from '@/lib/ai-visibility-schema';

const ORIGIN = 'https://aeocheck.example';

function expectNoUndefined(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) expectNoUndefined(item);
    return;
  }

  if (value && typeof value === 'object') {
    for (const property of Object.values(value)) {
      expect(property).not.toBeUndefined();
      expectNoUndefined(property);
    }
  }
}

function collectGraphIds(value: unknown): {
  definitions: Map<string, unknown[]>;
  references: Set<string>;
} {
  const definitions = new Map<string, unknown[]>();
  const references = new Set<string>();

  function visit(node: unknown): void {
    if (Array.isArray(node)) {
      for (const item of node) visit(item);
      return;
    }
    if (!node || typeof node !== 'object') return;

    const record = node as Record<string, unknown>;
    const id = typeof record['@id'] === 'string' ? record['@id'] : undefined;
    if (id) {
      if (typeof record['@type'] === 'string') {
        definitions.set(id, [...(definitions.get(id) ?? []), record]);
      } else {
        references.add(id);
      }
    }
    for (const child of Object.values(record)) visit(child);
  }

  visit(value);
  return { definitions, references };
}

describe('schema graph builders', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses stable global and canonical page ids', () => {
    expect(organizationId()).toBe(`${ORIGIN}/#organization`);
    expect(websiteId()).toBe(`${ORIGIN}/#website`);
    expect(webPageId('/about')).toBe(`${ORIGIN}/about#webpage`);
    expect(articleId('/blog/example')).toBe(`${ORIGIN}/blog/example#article`);
    expect(breadcrumbId('/about')).toBe(`${ORIGIN}/about#breadcrumb`);
    expect(schemaReference(organizationId())).toEqual({
      '@id': `${ORIGIN}/#organization`,
    });
  });

  it('links WebSite and its publisher to the Organization node', () => {
    const organization = organizationSchema();
    const website = websiteSchema();

    expect(organization).toMatchObject({
      '@id': `${ORIGIN}/#organization`,
      url: `${ORIGIN}/`,
      logo: {
        '@id': `${ORIGIN}/#logo`,
        url: `${ORIGIN}/logo.png`,
      },
    });
    expect(website).toMatchObject({
      '@id': `${ORIGIN}/#website`,
      publisher: { '@id': `${ORIGIN}/#organization` },
    });
  });

  it('links software to provider, publisher, and website nodes', () => {
    const schema = softwareApplicationSchema({
      name: 'AEO Checker',
      websiteUrl: `${ORIGIN}/tools/aeo-checker?source=home#existing`,
      longDescription: 'Checks AI search readiness.',
      startingPrice: '$0',
      keyFeatures: ['Schema checks'],
    });

    expect(schema).toMatchObject({
      '@id': `${ORIGIN}/tools/aeo-checker#software-application`,
      provider: {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#organization`,
      },
      publisher: { '@id': `${ORIGIN}/#organization` },
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
      },
    });
  });

  it('builds connected page and article nodes without undefined values', () => {
    const page = webPageSchema({
      path: '/references',
      type: 'CollectionPage',
      name: 'References',
      description: 'Sources',
    });
    const article = articleSchema({
      path: '/guides/aeo-audit',
      type: 'TechArticle',
      headline: 'AEO Audit Guide',
      description: 'A guide',
    });

    expect(page).toMatchObject({
      '@id': `${ORIGIN}/references#webpage`,
      url: `${ORIGIN}/references`,
      isPartOf: { '@id': `${ORIGIN}/#website` },
      publisher: {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#organization`,
      },
    });
    expect(article).toMatchObject({
      '@id': `${ORIGIN}/guides/aeo-audit#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${ORIGIN}/guides/aeo-audit#webpage`,
        url: `${ORIGIN}/guides/aeo-audit`,
        isPartOf: { '@id': `${ORIGIN}/#website` },
      },
      author: { '@id': `${ORIGIN}/#organization` },
      publisher: { '@id': `${ORIGIN}/#organization` },
      isPartOf: { '@id': `${ORIGIN}/#website` },
    });
    expectNoUndefined(page);
    expectNoUndefined(article);
    expect(() => JSON.parse(jsonLd([page, article]).children)).not.toThrow();
  });

  it('keeps the editorial team distinct from the primary organization', () => {
    const article = articleSchema({
      path: '/blog/example',
      type: 'Article',
      headline: 'Example',
      description: 'Example article',
      authorName: 'AI Search Readiness Editorial Team',
      authorDescription: 'Technical editorial team',
      reviewedBy: 'AI Search Readiness Editorial Team',
    });

    expect(editorialTeamId()).not.toBe(organizationId());
    expect(article.author).toMatchObject({
      '@type': 'Organization',
      '@id': `${ORIGIN}/#editorial-team`,
      name: 'AI Search Readiness Editorial Team',
      url: `${ORIGIN}/about`,
    });
    expect(article).not.toHaveProperty('reviewedBy');
  });

  it('adds a breadcrumb id only when a path is supplied', () => {
    const items = [{ name: 'Home', url: `${ORIGIN}/` }];

    expect(breadcrumbSchema(items, '/about')).toMatchObject({
      '@id': `${ORIGIN}/about#breadcrumb`,
    });
    expect(breadcrumbSchema(items)).not.toHaveProperty('@id');
  });

  it('keeps graph references resolvable within a standalone document', () => {
    const article = articleSchema({
      path: '/guides/aeo-audit',
      type: 'Article',
      headline: 'AEO Audit Guide',
      description: 'A guide',
    });
    const software = softwareApplicationSchema({
      name: 'AEO Checker',
      websiteUrl: `${ORIGIN}/tools/aeo-checker`,
      longDescription: 'Checks readiness.',
      startingPrice: '$0',
      keyFeatures: ['Schema checks'],
    });
    const { definitions, references } = collectGraphIds([article, software]);

    for (const reference of references) {
      expect(definitions.has(reference)).toBe(true);
    }
    for (const nodes of definitions.values()) {
      const serialized = new Set(nodes.map((node) => JSON.stringify(node)));
      expect(serialized.size).toBe(1);
    }
  });

  it('escapes script-closing text while preserving parsed content', () => {
    const dangerous = '</script><script>alert(1)</script>';
    const script = jsonLd({ description: dangerous });

    expect(script.children).not.toContain('</script>');
    expect(JSON.parse(script.children)).toEqual({ description: dangerous });
  });
});

describe('migrated route contracts', () => {
  const routes = [
    'src/routes/(pages)/about.tsx',
    'src/routes/(pages)/methodology.tsx',
    'src/routes/(pages)/references.tsx',
    'src/routes/blog/$slug.tsx',
    'src/routes/guides.query-fan-out.tsx',
    'src/routes/guides.ai-search-readiness-checklist.tsx',
    'src/routes/guides.aeo-audit.tsx',
  ];

  it.each(routes)('does not inline publisher or isPartOf in %s', (route) => {
    const source = fs.readFileSync(path.resolve(route), 'utf8');

    expect(source).not.toMatch(/publisher\s*:\s*\{/);
    expect(source).not.toMatch(/isPartOf\s*:\s*\{/);
  });

  it('uses the JSON-LD helper and graph references on the blog index', () => {
    const source = fs.readFileSync(
      path.resolve('src/routes/blog/index.tsx'),
      'utf8'
    );

    expect(source).toContain('jsonLd(blogJsonLd)');
    expect(source).toContain('publisher: schemaReference(organizationId())');
    expect(source).toContain('isPartOf: schemaReference(websiteId())');
  });
});

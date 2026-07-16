import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  AI_READINESS_SCORE_CATEGORIES,
  AI_READINESS_SCORE_NAME,
  AI_READINESS_SCORE_TOTAL,
} from '@/lib/ai-readiness-score-model';

const scopedFiles = [
  'content/pages/about.md',
  'content/pages/press.md',
  'content/pages/references.md',
  'content/pages/methodology.md',
  'src/routes/(pages)/methodology.tsx',
  'src/lib/ai-visibility-schema.ts',
  'src/routes/playbooks.tsx',
  'src/routes/compare.aeo-checker-alternatives.tsx',
  'src/routes/__root.tsx',
  'src/lib/rss.ts',
  'public/og.svg',
  'docs/growth/aeocheck-entity-sheet.md',
];

function read(file: string): string {
  return fs.readFileSync(path.resolve(file), 'utf8');
}

describe('AEOCheck brand and methodology content contract', () => {
  it('uses AEOCheck as the brand and not the category phrase as a name', () => {
    for (const file of scopedFiles) {
      const source = read(file);
      const legacyAlternateName = ['AI', 'Search', 'Readiness', 'Tools'].join(
        ' '
      );
      expect(source, file).not.toContain(
        `alternateName: ['${legacyAlternateName}']`
      );
    }

    expect(read('content/pages/press.md')).toContain('Product name: AEOCheck');
    expect(read('public/og.svg')).toContain('AEOCheck');
    expect(read('src/routes/__root.tsx')).toContain('AEOCheck RSS Feed');
  });

  it('publishes the six real score categories and exclusions', () => {
    const methodology = read('content/pages/methodology.md').replace(
      /\s+/g,
      ' '
    );

    expect(methodology).toContain('Technical crawlability: 15 points');
    expect(methodology).toContain('How the AI Search Readiness Score is built');
    expect(methodology).toContain('AI files and crawler access: 20 points');
    expect(methodology).toContain('Schema: 20 points');
    expect(methodology).toContain('Answer-ready content: 20 points');
    expect(methodology).toContain('Entity clarity: 15 points');
    expect(methodology).toContain('Trust signals: 10 points');
    expect(methodology).toContain(
      'Recommendations are generated from findings but do not add or subtract points.'
    );
    expect(methodology).toContain(
      'AI-generated analysis shown in a report is also not scored'
    );
    expect(methodology).toContain(
      'does not currently publish an explicit algorithm version identifier'
    );
    expect(methodology).toContain('not an algorithm version');
    expect(read('src/routes/(pages)/methodology.tsx')).toContain(
      'Last reviewed: July 16, 2026'
    );
  });

  it('uses one shared public score model', () => {
    expect(AI_READINESS_SCORE_NAME).toBe('AI Search Readiness Score');
    expect(AI_READINESS_SCORE_CATEGORIES).toHaveLength(6);
    expect(AI_READINESS_SCORE_TOTAL).toBe(100);
    expect(
      Object.fromEntries(
        AI_READINESS_SCORE_CATEGORIES.map(({ id, weight }) => [id, weight])
      )
    ).toEqual({
      technical: 15,
      files: 20,
      schema: 20,
      content: 20,
      entity: 15,
      trust: 10,
    });
  });

  it('keeps methodology review dates aligned', () => {
    const markdown = read('content/pages/methodology.md');
    const route = read('src/routes/(pages)/methodology.tsx');

    expect(markdown).toContain('updated: 2026-07-16');
    expect(markdown).toContain('Last reviewed: July 16, 2026');
    expect(route).toContain("const PAGE_DATE = '2026-07-16T00:00:00.000Z'");
    expect(route).toContain('Last reviewed: July 16, 2026');
  });

  it('does not expose an unsupported research credential for the byline', () => {
    const blogRoute = read('src/routes/blog/$slug.tsx');
    const schema = read('src/lib/ai-visibility-schema.ts');

    expect(blogRoute).toContain('AEOCheck organizational editorial byline');
    expect(schema).toContain('AEOCheck organizational editorial byline');
  });

  it('documents paragraph thresholds, bands, and current limitations', () => {
    const methodology = read('content/pages/methodology.md').replace(
      /\s+/g,
      ' '
    );

    expect(methodology).toContain('20-100 words');
    expect(methodology).toContain('at least two qualifying paragraphs');
    expect(methodology).toContain('80-100');
    expect(methodology).toContain('60-79');
    expect(methodology).toContain('40-59');
    expect(methodology).toContain('0-39');
    expect(methodology).toContain('does not test WAF');
    expect(methodology).toContain(
      'does not run dedicated Googlebot or Bingbot'
    );
    expect(methodology).toContain('judge schema completeness');
    expect(methodology).toContain('award points for tables and list markup');
    expect(read('src/api/ai-readiness/aeo.ts')).not.toContain('40-80 word');
    expect(read('src/routes/report.$token.tsx')).not.toContain('40-80 word');
  });

  it('reuses the global organization builder for the playbooks publisher', () => {
    const playbooks = read('src/routes/playbooks.tsx');

    expect(playbooks).toContain('publisher: organizationSchema()');
    expect(playbooks).not.toMatch(/publisher\s*:\s*\{\s*['"]@type['"]/);
  });
});

import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const TARGET_FILES = [
  'content/blog/ai-crawlers-search-readiness.md',
  'content/blog/llms-txt-complete-guide.md',
  'content/blog/ai-search-vs-seo.md',
  'src/routes/compare.llms-txt-checker-alternatives.tsx',
];

const BLOG_FILES = readdirSync(resolve(process.cwd(), 'content/blog'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => `content/blog/${file}`);

const UNSUPPORTED_CLAIMS = [
  /~35%/i,
  /~20%/i,
  /approximately\s+(?:35|20)%/i,
  /\bhundreds\b/i,
  /\b2 out of 13\b/i,
  /\b2 of 13\b/i,
  /analysis of 500 websites/i,
  /more consistently/i,
  /most accidental/i,
  /4-8 week/i,
  /weeks to months/i,
  /2 of 12/i,
];

describe('production content claims', () => {
  it.each(TARGET_FILES)('%s excludes unsupported claims', (file) => {
    const content = readFileSync(resolve(process.cwd(), file), 'utf8');

    for (const claim of UNSUPPORTED_CLAIMS) {
      expect(content).not.toMatch(claim);
    }
  });

  it.each(BLOG_FILES)('%s does not promise an AI citation timeline', (file) => {
    const content = readFileSync(resolve(process.cwd(), file), 'utf8');

    expect(content).not.toMatch(/4-8 week/i);
    expect(content).not.toMatch(/cit(?:ed|ation)[^\n.]*weeks to months/i);
    expect(content).not.toMatch(/entity graph[^\n|]*\d+[-–]\d+ weeks/i);
    expect(content).not.toMatch(/trust building[^\n|]*\d+[-–]\d+ weeks/i);
  });

  it('does not make unsupported majority or most-common crawler claims', () => {
    const content = readFileSync(
      resolve(process.cwd(), 'content/blog/ai-crawlers-search-readiness.md'),
      'utf8'
    );

    expect(content).not.toMatch(/\bmajority\b/i);
    expect(content).not.toMatch(/\bmost common\b/i);
  });
});

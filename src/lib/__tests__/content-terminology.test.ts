import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const SRC_ROOT = path.resolve(import.meta.dirname, '../..');
const PRODUCT_NAME = 'AI Visibility Fix Pack';

function productionSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === '__tests__' ? [] : productionSourceFiles(entryPath);
    }

    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

describe('content terminology', () => {
  const sourceFiles = productionSourceFiles(SRC_ROOT);

  it('does not call a readiness score an AI Visibility Score', () => {
    const violations = sourceFiles.flatMap((file) => {
      const source = readFileSync(file, 'utf8').replaceAll(PRODUCT_NAME, '');
      const hasDeprecatedName = /AI Visibility Score/i.test(source);
      const hasVagueReadinessName =
        /readiness[- ]based (?:AI )?visibility score/i.test(source);

      return hasDeprecatedName || hasVagueReadinessName
        ? [path.relative(SRC_ROOT, file)]
        : [];
    });

    expect(violations).toEqual([]);
  });

  it('keeps the LLMs.txt tool score independently named', () => {
    const source = readFileSync(
      path.join(SRC_ROOT, 'routes/tools.llms-txt-checker.tsx'),
      'utf8'
    );

    expect(source).toContain('LLMs.txt Readiness Score (0-100)');
    expect(source).not.toContain('AI Search Readiness Score (0-100)');
  });
});

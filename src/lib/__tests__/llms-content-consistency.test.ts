import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) =>
  readFileSync(resolve(process.cwd(), path), 'utf8');

const llms = readProjectFile('public/llms.txt');
const llmsFull = readProjectFile('public/llms-full.txt');
const blogGuide = readProjectFile('content/blog/llms-txt-complete-guide.md');
const llmsGuide = readProjectFile('src/routes/guides.llms-txt-file.tsx');
const aeoGuide = readProjectFile('src/routes/guides.aeo-audit.tsx');

const coreToolUrls = [
  '/tools/llms-txt-checker',
  '/tools/llms-txt-generator',
  '/tools/aeo-checker',
  '/tools/query-fan-out-tool',
];

const specializedEntryPointUrls = [
  '/tools/chatgpt-visibility-checker',
  '/tools/ai-crawler-checker',
  '/tools/robots-txt-ai-crawler-checker',
  '/tools/geo-audit',
  '/tools/ai-overview-readiness-checker',
  '/tools/chatgpt-citation-readiness-checker',
];

describe('LLMs content consistency', () => {
  it('classifies four core tools and six specialized entry points', () => {
    expect(coreToolUrls).toHaveLength(4);
    expect(specializedEntryPointUrls).toHaveLength(6);

    const llmsCoreSection = llms
      .split('## Core tools')[1]
      .split('## Specialized audit entry points')[0];
    const llmsSpecializedSection = llms
      .split('## Specialized audit entry points')[1]
      .split('## Reports and services')[0];
    const fullCoreSection = llmsFull
      .split('## Four Core Tools')[1]
      .split('## Six Specialized Audit Entry Points')[0];
    const fullSpecializedSection = llmsFull
      .split('## Six Specialized Audit Entry Points')[1]
      .split('## Reports, Services, and Supporting Pages')[0];

    for (const url of coreToolUrls) {
      expect(llmsCoreSection).toContain(`https://aeocheck.xyz${url}`);
      expect(fullCoreSection).toContain(`https://aeocheck.xyz${url}`);
    }

    for (const url of specializedEntryPointUrls) {
      expect(llmsSpecializedSection).toContain(`https://aeocheck.xyz${url}`);
      expect(fullSpecializedSection).toContain(`https://aeocheck.xyz${url}`);
    }

    expect(llms).toContain('## Core tools');
    expect(llms).toContain('## Specialized audit entry points');
    expect(llmsFull).toContain('## Four Core Tools');
    expect(llmsFull).toContain('## Six Specialized Audit Entry Points');
  });

  it('does not retain known misleading claims', () => {
    const content = [llms, llmsFull, blogGuide, llmsGuide, aeoGuide].join('\n');

    expect(content).not.toMatch(/\bfive tools\b/i);
    expect(content).not.toMatch(/No file\s*\|\s*Connection refused/i);
    expect(content).not.toMatch(/Cursor maintains[^\n]*LLMs\.txt/i);
  });

  it('links only to tool routes that exist in the generated route tree', () => {
    const routeTree = readProjectFile('src/routeTree.gen.ts');
    const toolUrls = [llms, llmsFull]
      .flatMap((content) => [
        ...content.matchAll(/https:\/\/aeocheck\.xyz(\/tools\/[a-z0-9-]+)/g),
      ])
      .map((match) => match[1]);

    expect(new Set(toolUrls).size).toBe(10);
    for (const url of new Set(toolUrls)) {
      expect(routeTree).toContain(`path: '${url}'`);
    }
  });

  it('keeps the real product name separate from the score name', () => {
    const machineContent = [llms, llmsFull].join('\n').replace(/\s+/g, ' ');

    expect(machineContent).toContain('AI Visibility Fix Pack');
    expect(machineContent).toContain('AI Search Readiness Score');
    expect(machineContent).not.toContain('AI Search Readiness Fix Pack');
  });
});

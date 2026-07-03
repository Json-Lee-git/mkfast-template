import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  generateGrowthAssetMarkdown,
  slugifyTarget,
  type GrowthTarget,
} from './growth-asset-generator.ts';

describe('growth asset generator', () => {
  it('creates URL-safe slugs from keyword targets', () => {
    assert.equal(
      slugifyTarget('AI Search Readiness Audit Checklist'),
      'ai-search-readiness-audit-checklist'
    );
    assert.equal(
      slugifyTarget('LLMs.txt generator alternatives'),
      'llms-txt-generator-alternatives'
    );
  });

  it('renders every acquisition section needed for non-manual growth work', () => {
    const target: GrowthTarget = {
      keyword: 'GEO audit tools',
      intent: 'Compare tools before choosing an audit workflow',
      funnel: 'BOFU',
      pageType: 'Compare page',
      targetUrl: '/compare/geo-audit-tools',
      audience: 'B2B SaaS marketers',
      painPoint:
        'They need to understand whether AI systems can parse and cite their product pages.',
    };

    const markdown = generateGrowthAssetMarkdown(target, {
      productName: 'AEOCheck',
      primaryCta: 'Run the free AEO checker',
    });

    assert.match(markdown, /^# GEO Audit Tools Growth Asset/m);
    assert.match(markdown, /## BOFU Page Brief/);
    assert.match(markdown, /## Mini Audit Checklist/);
    assert.match(markdown, /## External Distribution Drafts/);
    assert.match(markdown, /## Outreach Templates/);
    assert.match(markdown, /## GEO Questions To Monitor/);
    assert.match(markdown, /## Daily Growth Log/);
    assert.match(markdown, /Run the free AEO checker/);
  });

  it('renders configured GEO monitoring questions', () => {
    const markdown = generateGrowthAssetMarkdown({
      keyword: 'GEO audit tools',
      intent: 'Compare tools before choosing an audit workflow',
      funnel: 'BOFU',
      pageType: 'Compare page',
      targetUrl: '/compare/geo-audit-tools',
      questions: [
        'What are the best GEO audit tools for B2B SaaS websites?',
        'How do I check whether AI search engines can understand my product pages?',
      ],
    });

    assert.match(markdown, /What are the best GEO audit tools/);
    assert.match(markdown, /AI search engines can understand my product pages/);
  });

  it('falls back to practical GEO monitoring questions when none are configured', () => {
    const markdown = generateGrowthAssetMarkdown({
      keyword: 'AI search readiness audit checklist',
      intent: 'Understand what to inspect before running an audit',
      funnel: 'MOFU',
      pageType: 'Blog guide',
      targetUrl: '/blog/ai-search-readiness-audit-checklist',
    });

    assert.match(
      markdown,
      /What should be included in an AI search readiness audit/
    );
    assert.match(
      markdown,
      /Which tools can check whether a website is ready for AI search/
    );
  });

  it('does not generate ranking, traffic, revenue, or AI citation guarantees', () => {
    const markdown = generateGrowthAssetMarkdown({
      keyword: 'AEO checker alternatives',
      intent: 'Compare AEO checker options',
      funnel: 'BOFU',
      pageType: 'Compare page',
      targetUrl: '/compare/aeo-checker-alternatives',
    });

    const bannedPhrases = [
      'guaranteed rankings',
      'guaranteed AI citations',
      'guaranteed traffic',
      'guaranteed revenue',
      'will rank',
      'will get cited',
    ];

    for (const phrase of bannedPhrases) {
      assert.equal(markdown.toLowerCase().includes(phrase), false, phrase);
    }
  });
});

import { describe, expect, it } from 'vitest';
import type { AeoAuditResult } from '@/api/ai-readiness/aeo';
import { calculateAiReadinessScore } from '@/lib/ai-readiness-score-model';

function emptyResult(): AeoAuditResult {
  return {
    normalizedUrl: 'https://example.com/',
    checkedAt: '2026-07-16T00:00:00.000Z',
    score: 0,
    scoreLabel: '',
    page: {
      finalUrl: 'https://example.com/',
      metaRobots: 'noindex',
      issues: [],
      warnings: [],
    },
    aiFiles: {
      llmsTxt: { exists: false, url: 'https://example.com/llms.txt' },
      llmsFullTxt: {
        exists: false,
        url: 'https://example.com/llms-full.txt',
      },
      sitemap: { exists: false },
      robotsTxt: {
        exists: false,
        url: 'https://example.com/robots.txt',
        crawlers: [],
      },
    },
    structuredData: {
      hasJsonLd: false,
      schemaTypes: [],
      parseErrors: [],
      issues: [],
      warnings: [],
    },
    answerReadyContent: {
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      hasFaqSection: false,
      hasQuestionHeadings: false,
      hasLists: false,
      hasShortAnswerParagraphs: false,
      issues: [],
      warnings: [],
    },
    entityClarity: {
      hasOgSiteName: false,
      hasOrganizationSchema: false,
      issues: [],
      warnings: [],
    },
    trustSignals: {
      hasAuthor: false,
      hasPublishedDate: false,
      hasModifiedDate: false,
      hasAboutLink: false,
      hasContactLink: false,
      hasPrivacyLink: false,
      externalLinkCount: 0,
      issues: [],
      warnings: [],
    },
    recommendations: [],
  };
}

function fullResult(): AeoAuditResult {
  const result = emptyResult();
  result.page = {
    ...result.page,
    statusCode: 200,
    title: 'Example',
    metaDescription: 'Description',
    canonical: 'https://example.com/',
    metaRobots: 'index,follow',
  };
  result.aiFiles = {
    llmsTxt: { exists: true, url: 'https://example.com/llms.txt' },
    llmsFullTxt: {
      exists: true,
      url: 'https://example.com/llms-full.txt',
    },
    sitemap: { exists: true },
    robotsTxt: {
      exists: true,
      url: 'https://example.com/robots.txt',
      crawlers: [
        { name: 'One', userAgent: 'One', access: 'allowed' },
        { name: 'Two', userAgent: 'Two', access: 'allowed' },
      ],
    },
  };
  result.structuredData = {
    ...result.structuredData,
    hasJsonLd: true,
    schemaTypes: ['Organization', 'Article'],
    parseErrors: [],
  };
  result.answerReadyContent = {
    ...result.answerReadyContent,
    h1Count: 1,
    h2Count: 2,
    hasFaqSection: true,
    hasQuestionHeadings: true,
    hasShortAnswerParagraphs: true,
  };
  result.entityClarity = {
    ...result.entityClarity,
    inferredBrandName: 'Example',
    hasOgSiteName: true,
    hasOrganizationSchema: true,
    brandMentionCount: 2,
  };
  result.trustSignals = {
    ...result.trustSignals,
    hasAuthor: true,
    hasPublishedDate: true,
    hasModifiedDate: true,
    hasAboutLink: true,
    hasContactLink: true,
    hasPrivacyLink: true,
    externalLinkCount: 2,
  };
  return result;
}

describe('AI Search Readiness Score behavior', () => {
  it('scores a fully satisfied result at 100', () => {
    expect(calculateAiReadinessScore(fullResult())).toBe(100);
  });

  it('scores each category at its published maximum', () => {
    const full = fullResult();
    const categoryResults = [
      { key: 'page', expected: 15 },
      { key: 'aiFiles', expected: 20 },
      { key: 'structuredData', expected: 20 },
      { key: 'answerReadyContent', expected: 20 },
      { key: 'entityClarity', expected: 15 },
      { key: 'trustSignals', expected: 10 },
    ] as const;

    for (const { key, expected } of categoryResults) {
      const result = emptyResult();
      Object.assign(result[key], full[key]);
      expect(calculateAiReadinessScore(result), key).toBe(expected);
    }
  });

  it('uses the lower mutually exclusive score for multiple H1 elements', () => {
    const result = emptyResult();
    result.answerReadyContent.h1Count = 2;

    expect(calculateAiReadinessScore(result)).toBe(2);
  });

  it('prorates crawler access and handles an empty crawler list', () => {
    const result = emptyResult();
    result.aiFiles.robotsTxt = {
      exists: true,
      url: 'https://example.com/robots.txt',
      crawlers: [
        { name: 'One', userAgent: 'One', access: 'allowed' },
        { name: 'Two', userAgent: 'Two', access: 'blocked' },
      ],
    };
    expect(calculateAiReadinessScore(result)).toBe(4);

    result.aiFiles.robotsTxt.crawlers = [];
    expect(calculateAiReadinessScore(result)).toBe(0);
  });

  it('does not award indexability or parseability when checks fail', () => {
    const result = emptyResult();

    expect(calculateAiReadinessScore(result)).toBe(0);
  });

  it('awards parseability only when JSON-LD exists without parse errors', () => {
    const result = emptyResult();
    result.structuredData.hasJsonLd = true;
    expect(calculateAiReadinessScore(result)).toBe(7);

    result.structuredData.parseErrors = ['Invalid JSON'];
    expect(calculateAiReadinessScore(result)).toBe(5);
  });
});

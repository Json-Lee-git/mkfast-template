import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import {
  FETCH_TIMEOUT_MS,
  isPrivateOrLocalHostname,
  fetchWithTimeout,
} from './shared';

const inputSchema = z.object({
  url: z.string().trim().min(1, 'Please enter a URL'),
});

export interface AeoAuditResult {
  normalizedUrl: string;
  checkedAt: string;
  score: number;
  scoreLabel: string;
  page: {
    finalUrl: string;
    statusCode?: number;
    contentType?: string;
    title?: string;
    metaDescription?: string;
    canonical?: string;
    metaRobots?: string;
    issues: string[];
    warnings: string[];
  };
  aiFiles: {
    llmsTxt: { exists: boolean; url: string; statusCode?: number };
    llmsFullTxt: { exists: boolean; url: string; statusCode?: number };
    sitemap: { exists: boolean; url?: string; statusCode?: number };
    robotsTxt: {
      exists: boolean;
      url: string;
      statusCode?: number;
      crawlers: Array<{
        name: string;
        userAgent: string;
        access: 'allowed' | 'blocked' | 'unknown';
        note?: string;
      }>;
    };
  };
  structuredData: {
    hasJsonLd: boolean;
    schemaTypes: string[];
    parseErrors: string[];
    issues: string[];
    warnings: string[];
  };
  answerReadyContent: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hasFaqSection: boolean;
    hasQuestionHeadings: boolean;
    hasLists: boolean;
    hasShortAnswerParagraphs: boolean;
    issues: string[];
    warnings: string[];
  };
  entityClarity: {
    inferredBrandName?: string;
    hasOgSiteName: boolean;
    hasOrganizationSchema: boolean;
    brandMentionCount?: number;
    issues: string[];
    warnings: string[];
  };
  trustSignals: {
    hasAuthor: boolean;
    hasPublishedDate: boolean;
    hasModifiedDate: boolean;
    hasAboutLink: boolean;
    hasContactLink: boolean;
    hasPrivacyLink: boolean;
    externalLinkCount: number;
    issues: string[];
    warnings: string[];
  };
  recommendations: string[];
}

// ---------- MOCK DATA ----------

const MOCK: AeoAuditResult = {
  normalizedUrl: 'https://example.com',
  checkedAt: new Date().toISOString(),
  score: 62,
  scoreLabel: 'Good foundation with improvement opportunities',
  page: {
    finalUrl: 'https://example.com/',
    statusCode: 200,
    contentType: 'text/html',
    title: 'Example Site | Home',
    metaDescription: 'An example website for demonstration purposes.',
    canonical: 'https://example.com/',
    metaRobots: 'index, follow',
    issues: [],
    warnings: ['Meta description could be more descriptive (currently 42 chars).'],
  },
  aiFiles: {
    llmsTxt: { exists: false, url: 'https://example.com/llms.txt', statusCode: 404 },
    llmsFullTxt: { exists: false, url: 'https://example.com/llms-full.txt', statusCode: 404 },
    sitemap: { exists: true, url: 'https://example.com/sitemap.xml', statusCode: 200 },
    robotsTxt: {
      exists: true,
      url: 'https://example.com/robots.txt',
      statusCode: 200,
      crawlers: [
        { name: 'GPTBot', userAgent: 'GPTBot', access: 'allowed' },
        { name: 'OAI-SearchBot', userAgent: 'OAI-SearchBot', access: 'allowed' },
        { name: 'ChatGPT-User', userAgent: 'ChatGPT-User', access: 'blocked' },
        { name: 'ClaudeBot', userAgent: 'ClaudeBot', access: 'allowed' },
        { name: 'Claude-SearchBot', userAgent: 'Claude-SearchBot', access: 'unknown' },
        { name: 'PerplexityBot', userAgent: 'PerplexityBot', access: 'allowed' },
        { name: 'Perplexity-User', userAgent: 'Perplexity-User', access: 'unknown' },
        { name: 'Google-Extended', userAgent: 'Google-Extended', access: 'allowed' },
      ],
    },
  },
  structuredData: {
    hasJsonLd: true,
    schemaTypes: ['Organization', 'WebSite'],
    parseErrors: [],
    issues: [],
    warnings: ['Consider adding Article or BlogPosting schema on editorial pages.'],
  },
  answerReadyContent: {
    h1Count: 1,
    h2Count: 4,
    h3Count: 6,
    hasFaqSection: false,
    hasQuestionHeadings: false,
    hasLists: true,
    hasShortAnswerParagraphs: true,
    issues: ['No FAQ section found. Consider adding answers to common questions.'],
    warnings: [
      'No question-format headings (e.g. "What is X?") found. These help answer engines extract Q&A pairs.',
    ],
  },
  entityClarity: {
    inferredBrandName: 'Example',
    hasOgSiteName: false,
    hasOrganizationSchema: true,
    issues: ['No og:site_name meta tag found.'],
    warnings: [],
  },
  trustSignals: {
    hasAuthor: false,
    hasPublishedDate: false,
    hasModifiedDate: false,
    hasAboutLink: true,
    hasContactLink: false,
    hasPrivacyLink: true,
    externalLinkCount: 3,
    issues: [
      'No author information found.',
      'No published or modified date found.',
      'Missing Contact page link.',
    ],
    warnings: [],
  },
  recommendations: [
    'Add an LLMs.txt file at your site root.',
    'Add a short site summary at the top of your LLMs.txt file.',
    'Consider adding an LLMs-full.txt file for deeper content coverage.',
    'Review robots.txt rules that block ChatGPT-User.',
    'Add FAQPage schema if this page answers common questions.',
    'Add an FAQ section with question-format headings to improve answer engine extraction.',
    'Add og:site_name meta tag to clarify your brand identity.',
    'Add author information and published dates to improve trust signals.',
    'Add a Contact page link to improve trust signals.',
    'Add Article or BlogPosting schema on editorial pages.',
  ],
};

// ---------- Server function (mock for PR 1) ----------

export const runAeoAudit = createServerFn({ method: 'POST' })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<AeoAuditResult> => {
    return MOCK;
  });

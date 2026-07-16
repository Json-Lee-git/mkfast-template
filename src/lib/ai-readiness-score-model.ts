export const AI_READINESS_SCORE_NAME = 'AI Search Readiness Score';

export const AI_READINESS_SCORE_CATEGORIES = [
  { id: 'technical', name: 'Technical crawlability', weight: 15 },
  { id: 'files', name: 'AI files and crawler access', weight: 20 },
  { id: 'schema', name: 'Schema', weight: 20 },
  { id: 'content', name: 'Answer-ready content', weight: 20 },
  { id: 'entity', name: 'Entity clarity', weight: 15 },
  { id: 'trust', name: 'Trust signals', weight: 10 },
] as const;

export const AI_READINESS_SCORE_POINTS = {
  technical: {
    successfulStatus: 4,
    title: 3,
    metaDescription: 3,
    canonical: 3,
    indexable: 2,
  },
  files: {
    llmsTxt: 5,
    llmsFullTxt: 3,
    sitemap: 4,
    crawlerAccess: 8,
  },
  schema: {
    jsonLd: 5,
    detectedType: 5,
    entityType: 5,
    contentType: 3,
    parseable: 2,
  },
  content: {
    oneH1: 5,
    multipleH1: 2,
    twoH2: 4,
    faq: 4,
    questionHeadings: 4,
    conciseAnswers: 3,
  },
  entity: {
    inferredBrand: 4,
    ogSiteName: 4,
    organizationSchema: 5,
    repeatedBrand: 2,
  },
  trust: {
    author: 2,
    publishedDate: 2,
    aboutLink: 1,
    contactLink: 1,
    privacyLink: 1,
    externalReferences: 1,
    modifiedDate: 2,
  },
} as const;

export const AI_READINESS_SCORE_TOTAL = AI_READINESS_SCORE_CATEGORIES.reduce(
  (total, category) => total + category.weight,
  0
);

export function getAiReadinessCategoryWeight(
  id: (typeof AI_READINESS_SCORE_CATEGORIES)[number]['id']
): number {
  return AI_READINESS_SCORE_CATEGORIES.find((category) => category.id === id)!
    .weight;
}

export interface AiReadinessScoreInput {
  page: {
    statusCode?: number;
    title?: string;
    metaDescription?: string;
    canonical?: string;
    metaRobots?: string;
  };
  aiFiles: {
    llmsTxt: { exists: boolean };
    llmsFullTxt: { exists: boolean };
    sitemap: { exists: boolean };
    robotsTxt: {
      exists: boolean;
      crawlers: Array<{ access: 'allowed' | 'blocked' | 'unknown' }>;
    };
  };
  structuredData: {
    hasJsonLd: boolean;
    schemaTypes: string[];
    parseErrors: string[];
  };
  answerReadyContent: {
    h1Count: number;
    h2Count: number;
    hasFaqSection: boolean;
    hasQuestionHeadings: boolean;
    hasShortAnswerParagraphs: boolean;
  };
  entityClarity: {
    inferredBrandName?: string;
    hasOgSiteName: boolean;
    hasOrganizationSchema: boolean;
    brandMentionCount?: number;
  };
  trustSignals: {
    hasAuthor: boolean;
    hasPublishedDate: boolean;
    hasModifiedDate: boolean;
    hasAboutLink: boolean;
    hasContactLink: boolean;
    hasPrivacyLink: boolean;
    externalLinkCount: number;
  };
}

export function calculateAiReadinessScore(
  result: AiReadinessScoreInput
): number {
  if (AI_READINESS_SCORE_TOTAL !== 100) {
    throw new Error('AI readiness score category weights must total 100');
  }

  const points = AI_READINESS_SCORE_POINTS;
  let score = 0;

  if (
    result.page.statusCode &&
    result.page.statusCode >= 200 &&
    result.page.statusCode < 400
  ) {
    score += points.technical.successfulStatus;
  }
  if (result.page.title) score += points.technical.title;
  if (result.page.metaDescription) score += points.technical.metaDescription;
  if (result.page.canonical) score += points.technical.canonical;
  if (!result.page.metaRobots?.toLowerCase().includes('noindex')) {
    score += points.technical.indexable;
  }

  if (result.aiFiles.llmsTxt.exists) score += points.files.llmsTxt;
  if (result.aiFiles.llmsFullTxt.exists) score += points.files.llmsFullTxt;
  if (result.aiFiles.sitemap.exists) score += points.files.sitemap;
  if (result.aiFiles.robotsTxt.exists) {
    const crawlers = result.aiFiles.robotsTxt.crawlers;
    const allowed = crawlers.filter((crawler) => crawler.access === 'allowed');
    score += Math.round(
      (allowed.length / Math.max(crawlers.length, 1)) *
        points.files.crawlerAccess
    );
  }

  if (result.structuredData.hasJsonLd) score += points.schema.jsonLd;
  if (result.structuredData.schemaTypes.length > 0) {
    score += points.schema.detectedType;
  }
  if (
    result.structuredData.schemaTypes.some((type) =>
      /organization|website|webpage/i.test(type)
    )
  ) {
    score += points.schema.entityType;
  }
  if (
    result.structuredData.schemaTypes.some((type) =>
      /article|blogposting|faqpage|product|howto/i.test(type)
    )
  ) {
    score += points.schema.contentType;
  }
  if (
    result.structuredData.hasJsonLd &&
    result.structuredData.parseErrors.length === 0
  ) {
    score += points.schema.parseable;
  }

  if (result.answerReadyContent.h1Count === 1) {
    score += points.content.oneH1;
  } else if (result.answerReadyContent.h1Count > 1) {
    score += points.content.multipleH1;
  }
  if (result.answerReadyContent.h2Count >= 2) score += points.content.twoH2;
  if (result.answerReadyContent.hasFaqSection) score += points.content.faq;
  if (result.answerReadyContent.hasQuestionHeadings) {
    score += points.content.questionHeadings;
  }
  if (result.answerReadyContent.hasShortAnswerParagraphs) {
    score += points.content.conciseAnswers;
  }

  if (result.entityClarity.inferredBrandName) {
    score += points.entity.inferredBrand;
  }
  if (result.entityClarity.hasOgSiteName) score += points.entity.ogSiteName;
  if (result.entityClarity.hasOrganizationSchema) {
    score += points.entity.organizationSchema;
  }
  if ((result.entityClarity.brandMentionCount ?? 0) >= 2) {
    score += points.entity.repeatedBrand;
  }

  if (result.trustSignals.hasAuthor) score += points.trust.author;
  if (result.trustSignals.hasPublishedDate) score += points.trust.publishedDate;
  if (result.trustSignals.hasAboutLink) score += points.trust.aboutLink;
  if (result.trustSignals.hasContactLink) score += points.trust.contactLink;
  if (result.trustSignals.hasPrivacyLink) score += points.trust.privacyLink;
  if (result.trustSignals.externalLinkCount >= 2) {
    score += points.trust.externalReferences;
  }
  if (result.trustSignals.hasModifiedDate) score += points.trust.modifiedDate;

  return Math.min(score, AI_READINESS_SCORE_TOTAL);
}

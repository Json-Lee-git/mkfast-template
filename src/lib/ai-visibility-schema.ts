import { websiteConfig } from '@/config/website';
import { getBaseUrl, getCanonicalUrl } from '@/lib/urls';

type ListItem = {
  name: string;
  url: string;
  description?: string;
};

type FAQItem = {
  q: string;
  a: string;
};

type AITool = {
  name: string;
  websiteUrl: string;
  longDescription: string;
  startingPrice: string;
  keyFeatures: string[];
};

type SchemaReference = {
  '@id': string;
};

type SchemaAbout = string | SchemaReference;

export type WebPageSchemaInput = {
  path: string;
  type: 'WebPage' | 'AboutPage' | 'CollectionPage';
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  about?: SchemaAbout | SchemaAbout[];
};

export type ArticleSchemaInput = {
  path: string;
  type: 'Article' | 'TechArticle';
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  inLanguage?: string;
  authorName?: string;
  authorDescription?: string;
  reviewedBy?: string;
  about?: SchemaAbout | SchemaAbout[];
};

const EDITORIAL_TEAM_NAME = 'AI Search Readiness Editorial Team';

function siteOrigin(): string {
  return new URL(getBaseUrl()).origin;
}

function organizationNode() {
  const origin = siteOrigin();
  const logoPath = websiteConfig.metadata?.images?.logoLight ?? '/logo.png';

  return {
    '@type': 'Organization',
    '@id': organizationId(),
    name: websiteConfig.metadata?.name,
    url: `${origin}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${origin}/#logo`,
      url: new URL(logoPath, `${origin}/`).toString(),
    },
  };
}

function websiteNode() {
  const origin = siteOrigin();

  return {
    '@type': 'WebSite',
    '@id': websiteId(),
    name: websiteConfig.metadata?.name,
    url: `${origin}/`,
    publisher: organizationNode(),
  };
}

export function organizationId(): string {
  return `${siteOrigin()}/#organization`;
}

export function websiteId(): string {
  return `${siteOrigin()}/#website`;
}

export function editorialTeamId(): string {
  return `${siteOrigin()}/#editorial-team`;
}

export function webPageId(path: string): string {
  return `${getCanonicalUrl(path)}#webpage`;
}

export function articleId(path: string): string {
  return `${getCanonicalUrl(path)}#article`;
}

export function breadcrumbId(path: string): string {
  return `${getCanonicalUrl(path)}#breadcrumb`;
}

export function schemaReference(id: string): SchemaReference {
  return { '@id': id };
}

export function jsonLd(value: unknown) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(value).replace(/</g, '\\u003c'),
  };
}

export function organizationSchema() {
  const sameAs = Object.values(websiteConfig.social ?? {}).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    ...organizationNode(),
    description: websiteConfig.metadata?.description,
    foundingDate: '2026-02-15',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: getCanonicalUrl('/contact'),
        availableLanguage: ['en'],
      },
    ],
    publishingPrinciples: getCanonicalUrl('/methodology'),
    correctionsPolicy: getCanonicalUrl('/contact'),
    subjectOf: [
      {
        '@type': 'WebPage',
        '@id': webPageId('/methodology'),
        name: 'Methodology',
        url: getCanonicalUrl('/methodology'),
      },
      {
        '@type': 'WebPage',
        '@id': webPageId('/references'),
        name: 'References',
        url: getCanonicalUrl('/references'),
      },
      {
        '@type': 'WebPage',
        '@id': webPageId('/press'),
        name: 'Press and Media Kit',
        url: getCanonicalUrl('/press'),
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    ...websiteNode(),
    description: websiteConfig.metadata?.description,
  };
}

export function webPageSchema(input: WebPageSchemaInput) {
  const canonicalUrl = getCanonicalUrl(input.path);

  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    '@id': webPageId(input.path),
    name: input.name,
    description: input.description,
    url: canonicalUrl,
    isPartOf: websiteNode(),
    publisher: organizationNode(),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.about ? { about: input.about } : {}),
  };
}

function articleContributor(name: string, description?: string) {
  if (name === EDITORIAL_TEAM_NAME) {
    return {
      '@type': 'Organization',
      '@id': editorialTeamId(),
      name,
      description: 'AEOCheck organizational editorial byline',
      url: getCanonicalUrl('/about'),
    };
  }

  if (name === websiteConfig.metadata?.name) {
    return schemaReference(organizationId());
  }

  return {
    '@type': 'Organization',
    name,
    ...(description ? { description } : {}),
    url: getCanonicalUrl('/about'),
  };
}

export function articleSchema(input: ArticleSchemaInput) {
  const canonicalUrl = getCanonicalUrl(input.path);
  const author = input.authorName
    ? articleContributor(input.authorName, input.authorDescription)
    : schemaReference(organizationId());
  const reviewedBy = input.reviewedBy
    ? input.reviewedBy === input.authorName
      ? undefined
      : articleContributor(input.reviewedBy)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    '@id': articleId(input.path),
    headline: input.headline,
    description: input.description,
    url: canonicalUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': webPageId(input.path),
      url: canonicalUrl,
      isPartOf: websiteNode(),
    },
    isPartOf: schemaReference(websiteId()),
    author,
    publisher: organizationNode(),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    ...(reviewedBy ? { reviewedBy } : {}),
    ...(input.about ? { about: input.about } : {}),
  };
}

export function itemListSchema(path: string, items: ListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: getCanonicalUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function definedTermSchema(term: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.name,
    description: term.description,
    url: term.url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'AI Search Readiness Glossary',
      url: getCanonicalUrl('/glossary'),
    },
  };
}

export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: ListItem[], path?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    ...(path ? { '@id': breadcrumbId(path) } : {}),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function softwareApplicationSchema(tool: AITool) {
  const price = tool.startingPrice.match(/[\d.]+/)?.[0] ?? '0';
  const softwareUrl = new URL(tool.websiteUrl);
  softwareUrl.search = '';
  softwareUrl.hash = '';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${softwareUrl.toString()}#software-application`,
    name: tool.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: tool.websiteUrl,
    description: tool.longDescription,
    provider: organizationNode(),
    publisher: schemaReference(organizationId()),
    isPartOf: websiteNode(),
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: tool.keyFeatures,
  };
}

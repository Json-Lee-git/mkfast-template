import { websiteConfig } from '@/config/website';
import { getCanonicalUrl } from '@/lib/urls';

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

type ToolComparison = {
  slug: string;
  title: string;
  metaDescription: string;
  toolA: string;
  toolB: string;
};

type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
};

export function jsonLd(value: unknown) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(value).replace(/</g, '\\u003c'),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: websiteConfig.metadata?.name,
    url: getCanonicalUrl('/'),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: websiteConfig.metadata?.name,
    description: websiteConfig.metadata?.description,
    url: getCanonicalUrl('/'),
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

export function breadcrumbSchema(items: ListItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: tool.websiteUrl,
    description: tool.longDescription,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: tool.keyFeatures,
  };
}

export function comparisonPageSchema(comparison: ToolComparison) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: comparison.title,
    description: comparison.metaDescription,
    url: getCanonicalUrl(`/compare/${comparison.slug}`),
    about: [
      { '@type': 'SoftwareApplication', name: comparison.toolA },
      { '@type': 'SoftwareApplication', name: comparison.toolB },
    ],
  };
}

export function definedTermSchema(term: GlossaryTerm) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    url: getCanonicalUrl(`/glossary/${term.slug}`),
    inDefinedTermSet: getCanonicalUrl('/glossary'),
  };
}

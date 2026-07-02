import { websiteConfig } from '@/config/website';
import { getCanonicalUrl, getImageUrl } from '@/lib/urls';

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
    '@type': 'Organization',
    name: websiteConfig.metadata?.name,
    alternateName: ['AI Search Readiness Tools'],
    description: websiteConfig.metadata?.description,
    url: getCanonicalUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: getImageUrl(
        websiteConfig.metadata?.images?.logoLight ?? '/logo.png'
      ),
    },
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
        name: 'Methodology',
        url: getCanonicalUrl('/methodology'),
      },
      {
        '@type': 'WebPage',
        name: 'References',
        url: getCanonicalUrl('/references'),
      },
      {
        '@type': 'WebPage',
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
    '@type': 'WebSite',
    name: websiteConfig.metadata?.name,
    alternateName: ['AI Search Readiness Tools'],
    description: websiteConfig.metadata?.description,
    url: getCanonicalUrl('/'),
    publisher: {
      '@type': 'Organization',
      name: websiteConfig.metadata?.name,
      url: getCanonicalUrl('/'),
    },
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

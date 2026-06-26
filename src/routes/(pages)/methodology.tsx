import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { MarkdownPage } from '@/components/page/markdown-page';
import { websiteConfig } from '@/config/website';
import {
  jsonLd,
  organizationSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { getPageBySlug } from '@/lib/pages';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';

const PAGE_DATE = '2026-06-26T00:00:00.000Z';

export const Route = createFileRoute('/(pages)/methodology')({
  loader: () => {
    const page = getPageBySlug('methodology');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    const metadata = seo('/methodology', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    const url = getCanonicalUrl('/methodology');
    return {
      ...metadata,
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd(websiteSchema()),
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          name: p.title,
          headline: p.title,
          description: p.description,
          url,
          datePublished: p.date ? new Date(p.date).toISOString() : PAGE_DATE,
          dateModified: PAGE_DATE,
          author: {
            '@type': 'Organization',
            name: websiteConfig.metadata?.name,
            url: getCanonicalUrl('/'),
          },
          publisher: {
            '@type': 'Organization',
            name: websiteConfig.metadata?.name,
            url: getCanonicalUrl('/'),
          },
          about: [
            'Answer engine optimization',
            'AI search readiness',
            'Structured data',
            'AI crawler access',
          ],
          mainEntityOfPage: url,
        }),
      ],
    };
  },
  component: MethodologyPage,
});

function MethodologyPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <MarkdownPage page={page} />
    </Container>
  );
}

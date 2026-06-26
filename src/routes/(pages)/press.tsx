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

export const Route = createFileRoute('/(pages)/press')({
  loader: () => {
    const page = getPageBySlug('press');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    const metadata = seo('/press', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    const url = getCanonicalUrl('/press');
    return {
      ...metadata,
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd(websiteSchema()),
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: p.title,
          description: p.description,
          url,
          datePublished: p.date ? new Date(p.date).toISOString() : PAGE_DATE,
          dateModified: PAGE_DATE,
          isPartOf: {
            '@type': 'WebSite',
            name: websiteConfig.metadata?.name,
            url: getCanonicalUrl('/'),
          },
          about: {
            '@type': 'Organization',
            name: websiteConfig.metadata?.name,
            url: getCanonicalUrl('/'),
          },
        }),
      ],
    };
  },
  component: PressPage,
});

function PressPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <MarkdownPage page={page} />
    </Container>
  );
}

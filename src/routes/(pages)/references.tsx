import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { MarkdownPage } from '@/components/page/markdown-page';
import { websiteConfig } from '@/config/website';
import {
  breadcrumbSchema,
  jsonLd,
  organizationSchema,
  webPageSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { getPageBySlug } from '@/lib/pages';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';

const PAGE_DATE = '2026-06-26T00:00:00.000Z';

export const Route = createFileRoute('/(pages)/references')({
  loader: () => {
    const page = getPageBySlug('references');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    const metadata = seo('/references', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    const path = '/references';
    return {
      ...metadata,
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd(websiteSchema()),
        jsonLd(
          webPageSchema({
            path,
            type: 'CollectionPage',
            name: p.title,
            description: p.description,
            datePublished: p.date ? new Date(p.date).toISOString() : PAGE_DATE,
            dateModified: PAGE_DATE,
            about: [
              'Search documentation',
              'Schema.org',
              'AI crawler documentation',
              'LLMs.txt',
            ],
          })
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: 'Home', url: getCanonicalUrl('/') },
              { name: p.title, url: getCanonicalUrl(path) },
            ],
            path
          )
        ),
      ],
    };
  },
  component: ReferencesPage,
});

function ReferencesPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <MarkdownPage page={page} />
    </Container>
  );
}

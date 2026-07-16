import { createFileRoute, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { MarkdownPage } from '@/components/page/markdown-page';
import { getPageBySlug } from '@/lib/pages';
import { websiteConfig } from '@/config/website';
import { seo } from '@/lib/seo';
import {
  breadcrumbSchema,
  jsonLd,
  organizationId,
  organizationSchema,
  schemaReference,
  webPageSchema,
  websiteSchema,
} from '@/lib/ai-visibility-schema';
import { getCanonicalUrl } from '@/lib/urls';

export const Route = createFileRoute('/(pages)/about')({
  loader: () => {
    const page = getPageBySlug('about');
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.page;
    if (!p) return {};
    const metadata = seo('/about', {
      title: `${p.title} | ${websiteConfig.metadata?.name}`,
      description: p.description,
    });
    const path = '/about';
    return {
      ...metadata,
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd(websiteSchema()),
        jsonLd(
          webPageSchema({
            path,
            type: 'AboutPage',
            name: p.title,
            description: p.description,
            datePublished: p.date ? new Date(p.date).toISOString() : undefined,
            dateModified: '2026-06-26T00:00:00.000Z',
            about: schemaReference(organizationId()),
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
  component: AboutPage,
});

function AboutPage() {
  const { page } = Route.useLoaderData();
  if (!page) throw notFound();
  return (
    <Container className="py-16 px-4">
      <MarkdownPage page={page} />
    </Container>
  );
}

import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { Markdown } from '@/components/markdown/markdown';
import { getGlossaryBySlug } from '@/lib/glossary';
import {
  breadcrumbSchema,
  definedTermSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';
import { seo } from '@/lib/seo';
import { getCanonicalUrl } from '@/lib/urls';
import { IconArrowLeft } from '@tabler/icons-react';

export const Route = createFileRoute('/glossary/$slug')({
  loader: async ({ params }) => {
    const term = getGlossaryBySlug(params.slug);
    if (!term) throw notFound();
    return term;
  },
  head: ({ loaderData }) => {
    const term = loaderData;
    if (!term) return {};
    const path = `/glossary/${term.slug}`;
    return {
      ...seo(path, {
        title: `${term.title} - AI Search Readiness Glossary`,
        description: term.description,
        type: 'article',
      }),
      scripts: [
        jsonLd(
          definedTermSchema({
            name: term.title,
            description: term.description,
            url: getCanonicalUrl(path),
          })
        ),
        jsonLd(
          breadcrumbSchema([
            { name: 'Home', url: getCanonicalUrl('/') },
            { name: 'Glossary', url: getCanonicalUrl('/glossary') },
            { name: term.title, url: getCanonicalUrl(path) },
          ])
        ),
      ],
    };
  },
  component: GlossaryTermPage,
});

function GlossaryTermPage() {
  const term = Route.useLoaderData();
  if (!term) throw notFound();

  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/glossary"
          className="mb-6 inline-flex items-center gap-2 text-gray-500 dark:text-zinc-400 text-sm hover:text-gray-700 dark:hover:text-zinc-300"
        >
          <IconArrowLeft size={16} />
          All glossary terms
        </Link>

        <article>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
            {term.title}
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-zinc-400">
            {term.description}
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
            <Markdown
              content={term.content}
              className="prose prose-neutral dark:prose-invert max-w-none"
            />
          </div>
        </article>
      </div>
    </Container>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { getGlossaryTerms } from '@/lib/glossary';
import { seo } from '@/lib/seo';
import { IconArrowRight } from '@tabler/icons-react';

export const Route = createFileRoute('/glossary/')({
  loader: () => getGlossaryTerms(),
  head: () => ({
    ...seo('/glossary', {
      title: 'AI Search Readiness Glossary — LLMs.txt, AEO, AI Crawlers & More',
      description:
        'A comprehensive glossary of AI search readiness terms: LLMs.txt, AEO, AI crawlers, structured data, answer-ready content, and more.',
    }),
  }),
  component: GlossaryIndexPage,
});

function GlossaryIndexPage() {
  const terms = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              AI Search Readiness Glossary
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Clear definitions for terms in AI search, LLMs.txt, AEO, structured
              data, AI crawlers, and answer-ready content optimization.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-2">
              {terms.map((term) => (
                <Link
                  key={term.slug}
                  to="/glossary/$slug"
                  params={{ slug: term.slug }}
                  className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-5 py-4 transition-all hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm group"
                >
                  <span className="font-medium text-gray-800 dark:text-zinc-200">
                    {term.title}
                  </span>
                  <IconArrowRight
                    size={16}
                    className="text-gray-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

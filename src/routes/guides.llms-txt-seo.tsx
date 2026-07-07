import { seo } from '@/lib/seo';
import { faqSchema, jsonLd, websiteSchema } from '@/lib/ai-visibility-schema';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import { IconArrowRight } from '@tabler/icons-react';

const faqItems = [
  {
    q: 'Does LLMs.txt help with SEO?',
    a: 'LLMs.txt is not a confirmed ranking factor. It does not directly improve Google rankings, and Google says there are no special files required for AI Overviews or AI Mode. It may still help some AI-powered products understand your site structure better as optional context.',
  },
  {
    q: 'What is LLMs.txt GEO?',
    a: 'GEO stands for Generative Engine Optimization. It is the practice of optimizing content for AI-powered search and response engines. An LLMs.txt file is one low-cost GEO tactic: it gives AI models a structured summary of your site content.',
  },
  {
    q: 'Does LLMs.txt help with ChatGPT or Perplexity?',
    a: 'There is no guarantee, but an LLMs.txt file makes your site easier for AI systems to parse. ChatGPT, Perplexity, and other AI products may use it to understand what your site is about and which pages matter. It is a signal, not a promise.',
  },
  {
    q: 'Should I replace my SEO strategy with LLMs.txt?',
    a: 'No. LLMs.txt should not replace normal SEO, sitemaps, internal linking, structured data, or crawlable content. It is a supplementary file, not a replacement for established SEO practices.',
  },
  {
    q: 'Will Google use my LLMs.txt for ranking?',
    a: 'There is no evidence that Google uses LLMs.txt as a ranking signal. Google has its own crawl and indexing infrastructure, and its AI features documentation says there are no extra technical requirements, special schema, or AI-specific files required for AI Overviews or AI Mode.',
  },
  {
    q: 'Does adding LLMs.txt guarantee I appear in ChatGPT responses?',
    a: "No. There is no guarantee that adding an LLMs.txt file will cause any AI model to cite your website. It is one of many signals and is not a confirmed input to any major AI product's citation system.",
  },
  {
    q: 'Is LLMs.txt worth the effort?',
    a: 'For most sites, yes. It takes ten minutes to create and costs nothing. The upside is that your site becomes easier for AI systems to understand. The downside is ten minutes of your time. It is one of the lowest-risk SEO experiments you can run.',
  },
];

function LLMsTxtSEO() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Does LLMs.txt Help SEO?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Understand whether LLMs.txt helps SEO, AI search readiness,
              crawler access, and AI-readable site structure. Learn the
              limitations before adding one.
            </p>
            <p className="mt-3 text-xs text-gray-400 dark:text-zinc-500">
              Last updated: June 25, 2026
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16">
        <Container>
          <article className="mx-auto max-w-3xl prose prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-zinc-100 prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>Short answer</h2>
            <p>
              <strong>
                LLMs.txt is an emerging convention, not a confirmed ranking
                factor. There is no guarantee it will improve your SEO or
                increase AI citations.
              </strong>
            </p>
            <p>
              Google also says there are no special files required for AI
              Overviews or AI Mode. LLMs.txt may still be a useful, low-cost
              technical readiness step - especially for documentation sites,
              SaaS products, developer tools, and content-heavy sites - but it
              should not replace your existing SEO work.
            </p>

            <h2>What LLMs.txt can do</h2>
            <ul>
              <li>
                Provide a structured, AI-readable summary of your site's key
                pages.
              </li>
              <li>
                Help AI crawlers and language models understand your site's
                content and organization at a glance.
              </li>
              <li>
                Signal that you are aware of AI-readable content conventions.
              </li>
              <li>
                Serve as a low-cost, low-risk experiment with almost no
                downside.
              </li>
            </ul>

            <h2>What LLMs.txt cannot do</h2>
            <ul>
              <li>
                Guarantee that AI models will cite or reference your site.
              </li>
              <li>
                Replace traditional SEO signals like backlinks, content quality,
                or structured data.
              </li>
              <li>
                Override a poor user experience, thin content, or technical SEO
                problems.
              </li>
              <li>Force any AI system to treat your site differently.</li>
              <li>Improve your Google search rankings.</li>
            </ul>

            <h2>Why marketers and SEOs are testing it</h2>
            <p>
              AI-powered search is changing how people discover information.
              ChatGPT, Perplexity, Gemini, and other AI products increasingly
              surface web content in their responses. Marketers and SEO
              professionals are testing LLMs.txt not because it is a proven
              tactic, but because it is a low-effort way to prepare for an
              AI-mediated search landscape that is still taking shape.
            </p>

            <h2>When it is worth adding</h2>
            <ul>
              <li>
                You run a documentation site, API reference, or developer tool.
              </li>
              <li>
                Your site has a lot of structured content that AI systems could
                benefit from.
              </li>
              <li>
                You want to take a small, low-risk technical step without
                overpromising results.
              </li>
              <li>
                You already have solid SEO fundamentals and are looking for
                marginal improvements.
              </li>
            </ul>

            <h2>When it is not worth overthinking</h2>
            <ul>
              <li>Your site is a simple brochure page with only a few URLs.</li>
              <li>
                You have significant technical SEO issues that need attention
                first.
              </li>
              <li>You expect guaranteed results from adding one file.</li>
              <li>
                You are considering replacing your sitemap or structured data
                with LLMs.txt.
              </li>
            </ul>

            <h2>How to check your current setup</h2>
            <p>
              The fastest way is to use our free LLMs.txt Checker. It will tell
              you whether your site already has an LLMs.txt file, whether it is
              well-structured, whether your LLMs-full.txt and sitemap are
              present, and whether AI crawlers can access your site. If you are
              comparing validation options, start with the{' '}
              <a href="/compare/llms-txt-checker-alternatives?utm_source=guide&utm_medium=organic&utm_campaign=seo-llms-txt-validator&utm_content=llms-txt-seo-inline">
                LLMs.txt checker and validator comparison
              </a>{' '}
              before choosing a workflow.
            </p>
          </article>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-950/40 dark:via-zinc-900 dark:to-zinc-950 px-8 py-14 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Check your site's LLMs.txt readiness
            </h2>
            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Run a free technical check on your site in seconds.
            </p>
            <div className="mt-8">
              <a
                href="/tools/llms-txt-checker?utm_source=guide&utm_medium=organic&utm_campaign=seo-llms-txt-seo&utm_content=cta-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Run the LLMs.txt Checker <IconArrowRight size={16} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      {/* Real-world example */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Who uses LLMs.txt in production?
            </h2>
            <p className="mt-6 text-gray-500 dark:text-zinc-400">
              Anthropic (the company behind Claude) maintains an LLMs.txt at{' '}
              <code>anthropic.com/llms.txt</code>. It links to their main site,
              research blog, documentation, and the Claude app. Stripe's
              documentation site also serves one at{' '}
              <code>docs.stripe.com/llms.txt</code>, mapping their entire API
              reference surface. These companies are not adding LLMs.txt as an
              SEO tactic - they are using it to make their content more
              accessible to AI systems that consume web content directly. If
              Stripe and Anthropic see value in it, the file is past the
              "experiment" stage.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
            <FAQ items={faqItems} className="mt-8" />
          </div>
        </Container>
      </section>

      <div className="h-8" />
    </div>
  );
}

export const Route = createFileRoute('/guides/llms-txt-seo')({
  head: () => ({
    ...seo('/guides/llms-txt-seo', {
      title: "Does LLMs.txt Help SEO? What It Can and Can't Do",
      description:
        'Understand whether LLMs.txt helps SEO, AI search readiness, crawler access, and AI-readable site structure. Learn the limitations before adding one.',
      type: 'article',
    }),
    scripts: [jsonLd(websiteSchema()), jsonLd(faqSchema(faqItems))],
  }),
  component: LLMsTxtSEO,
});

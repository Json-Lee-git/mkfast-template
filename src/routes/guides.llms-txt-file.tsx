import { seo } from '@/lib/seo';
import { jsonLd, websiteSchema } from '@/lib/ai-visibility-schema';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import { IconArrowRight } from '@tabler/icons-react';

const faqItems = [
  {
    q: 'Is LLMs.txt an official standard?',
    a: 'No. LLMs.txt is an emerging convention proposed by the community. It is not a W3C standard, an RFC, or a confirmed ranking factor. It is a lightweight, low-cost way to provide AI-readable site summaries that some AI systems may choose to consume.',
  },
  {
    q: 'How is LLMs.txt different from robots.txt?',
    a: 'robots.txt controls which crawlers are allowed to access your site. LLMs.txt provides structured, AI-readable content about your site. They serve different purposes: robots.txt is about access control, LLMs.txt is about content discovery.',
  },
  {
    q: 'What is the difference between LLMs.txt and sitemap.xml?',
    a: 'A sitemap.xml lists every URL on your site for search engines. An LLMs.txt file highlights your most important pages with descriptions so AI models understand what matters. Sitemap is a directory. LLMs.txt is a curated guide.',
  },
  {
    q: 'What is the LLMs.txt format?',
    a: 'LLMs.txt uses standard Markdown. It starts with an H1 heading for your site name, followed by a blockquote summary, then section headings with links and short descriptions. No special syntax. No XML. Just Markdown anyone can write.',
  },
  {
    q: 'Where can I find an LLMs.txt example?',
    a: 'We have a full LLMs.txt template and real-world examples in our best practices guide. You can also generate a draft from your own sitemap using the free LLMs.txt Generator.',
  },
  {
    q: 'How do I create an LLMs.txt file for my website?',
    a: 'Write a Markdown file with your site name, summary, and key pages. Save it as llms.txt and upload it to your site root. Or use our free LLMs.txt Generator to build one automatically from your sitemap.',
  },
  {
    q: 'Where should I put my LLMs.txt file?',
    a: 'At the root of your website so it is accessible at /llms.txt. For static sites, drop it in your public folder. For CMS platforms, upload it through your file manager. Make sure it returns a 200 status code.',
  },
  {
    q: 'Should every website create an LLMs.txt file?',
    a: 'Not necessarily. It is most relevant for documentation sites, SaaS products, developer tools, content-heavy sites, and structured knowledge sites. If your site is a simple brochure page, the effort may outweigh the benefit.',
  },
];

function LLMsTxtFileGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              What Is an LLMs.txt File?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Learn what an LLMs.txt file is, how it works, what to include, and
              how to create one for your website.
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
            <h2>What is an LLMs.txt file?</h2>
            <p>
              An LLMs.txt file is a Markdown file placed at the root of your
              website that provides a structured, AI-readable summary of your
              site content. It helps large language models and AI crawlers
              understand what your site is about, what pages matter most, and
              how your content is organized.
            </p>
            <p>
              LLMs.txt is an emerging convention — not an official standard or a
              confirmed ranking factor. It is a low-cost technical preparation
              step that some AI systems may use to improve how they discover and
              represent your content.
            </p>

            <h2>Where should it be placed?</h2>
            <p>
              Place your LLMs.txt file at the root of your website so it is
              accessible at:
            </p>
            <pre className="rounded-xl bg-gray-100 dark:bg-zinc-900 p-4 text-sm">
              https://yourdomain.com/llms.txt
            </pre>
            <p>
              The file should be publicly accessible and served with a{' '}
              <code>text/plain</code> or <code>text/markdown</code> content
              type.
            </p>

            <h2>Basic LLMs.txt format</h2>
            <p>
              LLMs.txt uses standard Markdown formatting. A minimal example:
            </p>
            <pre className="rounded-xl bg-gray-100 dark:bg-zinc-900 p-4 text-sm overflow-x-auto">
              {`# Site Name

> A short summary of what this website provides.

## Main Pages

- [Home](https://example.com/): Landing page.
- [Pricing](https://example.com/pricing): Plans and pricing.
- [Docs](https://example.com/docs): Documentation.`}
            </pre>

            <h2>LLMs.txt example</h2>
            <p>
              A more complete LLMs.txt file might include multiple sections,
              descriptions for key links, and an optional reference to an
              expanded LLMs-full.txt file:
            </p>
            <pre className="rounded-xl bg-gray-100 dark:bg-zinc-900 p-4 text-sm overflow-x-auto">
              {`# Example SaaS

> API-first analytics platform for engineering teams.

## Core Pages

- [Home](https://example.com/): Product overview.
- [Pricing](https://example.com/pricing): Plans.
- [Docs](https://example.com/docs): Technical docs.
- [API Reference](https://example.com/api): REST API docs.

## Resources

- [Blog](https://example.com/blog): Engineering blog.
- [Guides](https://example.com/guides): Tutorials.
- [Changelog](https://example.com/changelog): Updates.

## Optional

- [LLMs-full.txt](https://example.com/llms-full.txt): Full expanded content.`}
            </pre>

            <h2>LLMs.txt vs robots.txt</h2>
            <p>
              <strong>robots.txt</strong> is a machine-readable file that tells
              crawlers which parts of your site they may or may not access. It
              is part of the Robots Exclusion Protocol and is well-established.
            </p>
            <p>
              <strong>LLMs.txt</strong> is a human-and-AI-readable Markdown file
              that describes your site content and structure. It does not
              control access — it helps AI systems understand your site once
              they have access.
            </p>
            <p>Think of it this way:</p>
            <ul>
              <li>
                robots.txt = &quot;You may or may not enter these rooms.&quot;
              </li>
              <li>LLMs.txt = &quot;Here is a map of the building.&quot;</li>
            </ul>

            <h2>LLMs.txt vs sitemap.xml</h2>
            <p>
              <strong>sitemap.xml</strong> is an XML file that lists URLs on
              your site for search engine crawlers. It is machine-readable and
              widely supported by Google, Bing, and other search engines.
            </p>
            <p>
              <strong>LLMs.txt</strong> is a Markdown file that adds human
              context — descriptions, structure, and priorities — to the pages
              it references. It is designed more for AI comprehension than for
              search engine indexing.
            </p>

            <h2>Who should create one?</h2>
            <p>An LLMs.txt file is most useful for:</p>
            <ul>
              <li>Documentation sites</li>
              <li>SaaS products</li>
              <li>Developer tools</li>
              <li>API documentation</li>
              <li>Content-heavy websites</li>
              <li>Structured knowledge sites</li>
              <li>Open-source projects</li>
              <li>Technical content libraries</li>
            </ul>

            <h2>What not to expect from it</h2>
            <p>
              LLMs.txt is not a confirmed ranking factor. There is no guarantee
              that adding one will increase AI citations, improve your search
              rankings, or get your brand mentioned by ChatGPT or other AI
              products. It is a low-cost, low-risk technical preparation step —
              nothing more, nothing less.
            </p>
          </article>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-950/40 dark:via-zinc-900 dark:to-zinc-950 px-8 py-14 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Ready to check your LLMs.txt?
            </h2>
            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Use the free checker to validate your existing file, sitemap, and
              AI crawler access.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/tools/llms-txt-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                LLMs.txt Checker <IconArrowRight size={16} />
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
              Real-world example: Cursor
            </h2>
            <p className="mt-6 text-gray-500 dark:text-zinc-400">
              The AI code editor Cursor maintains an LLMs.txt file at{' '}
              <code>cursor.com/llms.txt</code>. It uses concise sections
              ("Product," "Documentation," "Community") with one-line
              descriptions for each link. The file is under 30 lines, follows
              every best practice, and shows exactly how a SaaS tool should
              structure its AI-readable summary. Open it for inspiration — it is
              a textbook example of the format in production.
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

export const Route = createFileRoute('/guides/llms-txt-file')({
  head: () => ({
    ...seo('/guides/llms-txt-file', {
      title:
        'What Is an LLMs.txt File? Examples, Format, and How to Create One',
      description:
        'Learn what an LLMs.txt file is, how it works, what to include, and how to create one for your website.',
      type: 'article',
    }),
    scripts: [jsonLd(websiteSchema())],
  }),
  component: LLMsTxtFileGuidePage,
});

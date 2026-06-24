import { seo } from '@/lib/seo';
import { jsonLd, websiteSchema } from '@/lib/ai-visibility-schema';
import { createFileRoute } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { FAQ } from '@/components/ai-visibility/faq';
import { IconArrowRight } from '@tabler/icons-react';

const faqItems = [
  {
    q: 'Is LLMs-full.txt required if I already have LLMs.txt?',
    a: 'No. LLMs-full.txt is entirely optional. Many sites will only need the standard LLMs.txt. LLMs-full.txt is for sites that want to provide much deeper, expanded content — typically documentation or knowledge bases.',
  },
  {
    q: 'How large can an LLMs-full.txt file be?',
    a: 'There is no official limit, but practical considerations matter. Very large files may be ignored, partially read, or truncated by AI systems. If your full content exceeds a few megabytes, consider whether all of it really needs to be in a single file.',
  },
  {
    q: 'Should I put all my documentation in LLMs-full.txt?',
    a: 'Only if your documentation is well-structured and the file remains manageable. For very large documentation sites, consider listing only the most important sections or using LLMs.txt as the summary and LLMs-full.txt for expanded depth on key pages.',
  },
];

function LLMsFullTxtGuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-950 dark:to-zinc-950" />
        <Container className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              What Is LLMs-full.txt?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-zinc-400">
              Learn what LLMs-full.txt is, when documentation sites may use it,
              and how it differs from a standard LLMs.txt file.
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16">
        <Container>
          <article className="mx-auto max-w-3xl prose prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-zinc-100 prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <h2>What is LLMs-full.txt?</h2>
            <p>
              LLMs-full.txt is an expanded, comprehensive version of the
              standard LLMs.txt file. While LLMs.txt provides a structured
              summary and map of your site, LLMs-full.txt can contain the full
              Markdown content of your most important pages — making deeper
              content directly available to AI systems that support it.
            </p>
            <p>
              LLMs.txt is an emerging convention, not a confirmed standard or
              ranking factor. LLMs-full.txt follows the same convention as an
              optional expanded companion file.
            </p>
            <p>Like LLMs.txt, it is placed at the root of your site:</p>
            <pre className="rounded-xl bg-gray-100 dark:bg-zinc-900 p-4 text-sm">
              https://yourdomain.com/llms-full.txt
            </pre>

            <h2>LLMs.txt vs LLMs-full.txt</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-zinc-800">
                    <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                      Aspect
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                      LLMs.txt
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500 dark:text-zinc-400">
                      LLMs-full.txt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-zinc-800/50">
                    <td className="py-2.5 font-medium text-gray-700 dark:text-zinc-300">
                      Purpose
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Site summary and map
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Full expanded content
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-zinc-800/50">
                    <td className="py-2.5 font-medium text-gray-700 dark:text-zinc-300">
                      Content
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Headings, links, short descriptions
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Full page content in Markdown
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-zinc-800/50">
                    <td className="py-2.5 font-medium text-gray-700 dark:text-zinc-300">
                      Size
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Typically a few KB
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Can be several MB
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-zinc-800/50">
                    <td className="py-2.5 font-medium text-gray-700 dark:text-zinc-300">
                      Best for
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Most websites
                    </td>
                    <td className="py-2.5 text-gray-600 dark:text-zinc-400">
                      Docs, APIs, knowledge bases
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>When LLMs-full.txt makes sense</h2>
            <p>LLMs-full.txt is most useful for:</p>
            <ul>
              <li>
                <strong>Documentation sites</strong> — making full technical
                documentation directly available to AI systems.
              </li>
              <li>
                <strong>API docs</strong> — providing complete API reference
                content for AI-assisted development.
              </li>
              <li>
                <strong>Developer tools</strong> — giving AI models access to
                usage guides and SDK documentation.
              </li>
              <li>
                <strong>SaaS knowledge bases</strong> — helping AI systems
                answer support questions with full context.
              </li>
              <li>
                <strong>Open-source projects</strong> — including README,
                contributing guides, and changelogs.
              </li>
              <li>
                <strong>Technical content libraries</strong> — deep educational
                or reference content.
              </li>
            </ul>

            <h2>When it may be too large or unnecessary</h2>
            <p>
              If your full content exceeds several megabytes, the file may be
              ignored or truncated by AI systems. Very large files also increase
              bandwidth costs and may slow down AI crawler processing.
            </p>
            <p>
              For most websites — marketing sites, e-commerce stores, personal
              blogs, simple SaaS landing pages — the standard LLMs.txt is
              sufficient. LLMs-full.txt is an advanced option for content-heavy,
              documentation-oriented sites.
            </p>

            <h2>Examples of good use cases</h2>
            <ul>
              <li>
                A documentation platform that wants AI tools to have access to
                its full API reference.
              </li>
              <li>
                An open-source library providing complete README, contributing
                guide, and changelog in one AI-readable file.
              </li>
              <li>
                A SaaS knowledge base making its support articles directly
                available for AI-assisted customer support.
              </li>
            </ul>

            <h2>How to check whether your site has one</h2>
            <p>
              Use our free LLMs.txt Checker. Enter your website URL and it will
              check for both LLMs.txt and LLMs-full.txt, along with sitemap,
              robots.txt, and AI crawler access — all in a single technical
              report.
            </p>
          </article>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-zinc-800/50 py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-blue-950/40 dark:via-zinc-900 dark:to-zinc-950 px-8 py-14 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
              Check if your site has an LLMs-full.txt
            </h2>
            <p className="mt-3 text-gray-500 dark:text-zinc-400">
              Run the free LLMs.txt Checker to see your full AI Search Readiness
              report.
            </p>
            <div className="mt-8">
              <a
                href="/tools/llms-txt-checker"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] dark:bg-zinc-50 dark:text-gray-900 dark:hover:bg-zinc-200"
              >
                Run the LLMs.txt Checker <IconArrowRight size={16} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
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

export const Route = createFileRoute('/guides/llms-full-txt')({
  head: () => ({
    ...seo('/guides/llms-full-txt', {
      title:
        'What Is LLMs-full.txt? When to Use It and How It Differs from LLMs.txt',
      description:
        'Learn what LLMs-full.txt is, when documentation sites may use it, and how it differs from a standard LLMs.txt file.',
      type: 'article',
    }),
    scripts: [jsonLd(websiteSchema())],
  }),
  component: LLMsFullTxtGuidePage,
});

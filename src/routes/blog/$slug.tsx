import { m } from '@/locale/paraglide/messages';
import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { Markdown } from '@/components/markdown/markdown';
import { getPostBySlug, getBlogRedirect } from '@/lib/blog';
import { websiteConfig } from '@/config/website';
import { getCanonicalUrl, getImageUrl } from '@/lib/urls';
import { getLocale, localeConfig } from '@/lib/locale';
import { seo } from '@/lib/seo';
import { IconArrowLeft } from '@tabler/icons-react';
import { formatDate } from '@/lib/formatter';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
} from '@/lib/ai-visibility-schema';

/** Extract FAQ Q&A pairs from a "## Frequently asked questions" section. */
function extractFaqFromContent(content: string): { q: string; a: string }[] {
  const faqSection = content.match(
    /## Frequently asked questions\n\n([\s\S]*?)(?:\n---\n|$)/
  );
  if (!faqSection) return [];

  const items: { q: string; a: string }[] = [];
  const blocks = faqSection[1].split(/\n### /);
  for (const block of blocks) {
    const trimmed = block.trim();
    const nl = trimmed.indexOf('\n');
    if (nl === -1) continue;
    const q = trimmed.slice(0, nl).trim();
    const a = trimmed.slice(nl + 1).trim();
    if (q && a) items.push({ q, a });
  }
  return items;
}

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    const redirectTo = getBlogRedirect(params.slug);
    if (redirectTo) throw redirect({ to: redirectTo, statusCode: 301 });
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData;
    if (!post) return {};
    const path = `/blog/${params.slug}`;
    const title = `${post.title} | ${websiteConfig.metadata?.name}`;
    const description =
      post.description ?? websiteConfig.metadata?.description ?? '';
    const image = post.image ? getImageUrl(post.image) : undefined;
    const modifiedDate = new Date(post.updated ?? post.date).toISOString();
    const authorName = post.author ?? 'AI Search Readiness Editorial Team';
    const authorTitle = post.authorTitle ?? 'Technical editorial team';
    const metadata = seo(path, {
      title,
      description,
      image,
      type: 'article',
    });
    const articleJsonLd = articleSchema({
      path,
      type: 'Article',
      headline: post.title,
      description,
      inLanguage: localeConfig[getLocale()].hreflang,
      image,
      datePublished: new Date(post.date).toISOString(),
      dateModified: modifiedDate,
      authorName,
      authorDescription: authorTitle,
      reviewedBy: post.reviewedBy,
    });
    const breadcrumbJsonLd = breadcrumbSchema(
      [
        {
          name: 'Home',
          url: getCanonicalUrl('/'),
        },
        {
          name: 'Blog',
          url: getCanonicalUrl('/blog'),
        },
        {
          name: post.title,
          url: getCanonicalUrl(path),
        },
      ],
      path
    );

    const scripts = [jsonLd(breadcrumbJsonLd), jsonLd(articleJsonLd)];

    // Add FAQPage schema if content has an FAQ section
    const faqItems = extractFaqFromContent(post.content);
    if (faqItems.length > 0) {
      scripts.push(jsonLd(faqSchema(faqItems)));
    }

    return { ...metadata, scripts };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  if (!post || !websiteConfig.blog?.enable) throw notFound();
  const authorName = post.author ?? 'AI Search Readiness Editorial Team';
  const authorTitle = post.authorTitle ?? 'Technical editorial team';
  const showUpdated = post.updated && post.updated !== post.date;
  return (
    <Container className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          search={{ page: 1 }}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <IconArrowLeft className="size-4" />
          {m.blog_all_posts()}
        </Link>

        <article>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium capitalize">
              {post.category}
            </span>
            <span>By {authorName}</span>
            <span>{formatDate(new Date(post.date))}</span>
            {showUpdated && (
              <span>Updated {formatDate(new Date(post.updated ?? ''))}</span>
            )}
          </div>
          <p className="mb-4 text-muted-foreground text-sm">{authorTitle}</p>

          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

          {post.description && (
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {post.description}
            </p>
          )}

          <div className="mt-6 pt-10 border-t border-border">
            <Markdown
              content={post.content}
              className="prose prose-neutral dark:prose-invert max-w-none"
            />
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <Link
              to="/blog"
              search={{ page: 1 }}
              className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
            >
              <IconArrowLeft className="size-4" />
              {m.blog_all_posts()}
            </Link>
          </div>
        </article>
      </div>
    </Container>
  );
}

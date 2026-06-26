import { createFileRoute } from '@tanstack/react-router';
import { getBaseUrl } from '@/lib/urls';
import { getSortedPosts } from '@/lib/blog';
import { getGlossaryTerms } from '@/lib/glossary';
import { websiteConfig } from '@/config/website';
import {
  baseLocale,
  isLocalizedPath,
  localeConfig,
  locales,
  localizeHref,
} from '@/lib/locale';

/**
 * Dynamic sitemap.xml
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = getBaseUrl().replace(/\/$/, '');
        const staticUrls: {
          path: string;
          changefreq?: string;
          priority?: string;
        }[] = [
          { path: '/', changefreq: 'daily', priority: '1.0' },
          {
            path: '/tools/llms-txt-checker',
            changefreq: 'weekly',
            priority: '0.9',
          },
          {
            path: '/tools/llms-txt-generator',
            changefreq: 'weekly',
            priority: '0.9',
          },
          {
            path: '/tools/aeo-checker',
            changefreq: 'weekly',
            priority: '0.9',
          },
          {
            path: '/tools/query-fan-out-tool',
            changefreq: 'weekly',
            priority: '0.8',
          },
          {
            path: '/guides/llms-txt-file',
            changefreq: 'monthly',
            priority: '0.8',
          },
          {
            path: '/guides/llms-txt-seo',
            changefreq: 'monthly',
            priority: '0.7',
          },
          {
            path: '/guides/llms-full-txt',
            changefreq: 'monthly',
            priority: '0.7',
          },
          {
            path: '/guides/aeo-audit',
            changefreq: 'monthly',
            priority: '0.8',
          },
          {
            path: '/guides/query-fan-out',
            changefreq: 'monthly',
            priority: '0.7',
          },
          {
            path: '/glossary',
            changefreq: 'weekly',
            priority: '0.7',
          },
          { path: '/about', changefreq: 'monthly' },
          { path: '/methodology', changefreq: 'monthly' },
          { path: '/references', changefreq: 'monthly' },
          { path: '/press', changefreq: 'monthly' },
          { path: '/contact', changefreq: 'monthly' },
          { path: '/terms', changefreq: 'monthly' },
          { path: '/privacy', changefreq: 'monthly' },
          { path: '/cookie', changefreq: 'monthly' },
        ];

        if (websiteConfig.blog?.enable) {
          staticUrls.push({ path: '/blog', changefreq: 'weekly' });
        }

        const alternates = (path: string) => {
          if (!isLocalizedPath(path)) {
            return '';
          }
          const localeLinks = locales
            .map((locale) => {
              const href = `${base}${localizeHref(path, { locale })}`;
              return `\n    <xhtml:link rel="alternate" hreflang="${localeConfig[locale].hreflang}" href="${href}" />`;
            })
            .join('');
          const defaultHref = `${base}${localizeHref(path, {
            locale: baseLocale,
          })}`;
          return `${localeLinks}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}" />`;
        };

        const urlEntry = (
          path: string,
          opts?: { changefreq?: string; priority?: string; lastmod?: string }
        ) => {
          const loc = isLocalizedPath(path)
            ? localizeHref(path, { locale: baseLocale })
            : path;
          const lastmod = opts?.lastmod
            ? `\n    <lastmod>${opts.lastmod}</lastmod>`
            : '';
          const changefreq = opts?.changefreq
            ? `\n    <changefreq>${opts.changefreq}</changefreq>`
            : '';
          const priority = opts?.priority
            ? `\n    <priority>${opts.priority}</priority>`
            : '';
          return `  <url>\n    <loc>${base}${loc}</loc>${alternates(path)}${lastmod}${changefreq}${priority}\n  </url>`;
        };

        const staticPart = staticUrls
          .map((u) =>
            urlEntry(u.path, { changefreq: u.changefreq, priority: u.priority })
          )
          .join('\n');

        let blogPart = '';
        if (websiteConfig.blog?.enable) {
          const posts = getSortedPosts(baseLocale);
          blogPart = posts
            .map((p) =>
              urlEntry(`/blog/${p.slug}`, {
                changefreq: 'weekly',
                lastmod: new Date(p.date).toISOString().slice(0, 10),
              })
            )
            .join('\n');
        }

        const glossaryPart = getGlossaryTerms(baseLocale)
          .map((term) =>
            urlEntry(`/glossary/${term.slug}`, {
              changefreq: 'monthly',
              priority: '0.6',
            })
          )
          .join('\n');

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPart}
${blogPart ? `\n${blogPart}` : ''}
${glossaryPart ? `\n${glossaryPart}` : ''}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});

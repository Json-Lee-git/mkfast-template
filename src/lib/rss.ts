import { websiteConfig } from '@/config/website';
import { getSortedPosts, type BlogPost } from '@/lib/blog';
import { getBaseUrl, getCanonicalUrl } from '@/lib/urls';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rssItem(post: BlogPost): string {
  const url = getCanonicalUrl('/blog/' + post.slug);
  const date = new Date(post.date).toUTCString();
  return (
    '<item>' +
    '<title>' +
    esc(post.title) +
    '</title>' +
    '<link>' +
    url +
    '</link>' +
    '<guid isPermaLink="true">' +
    url +
    '</guid>' +
    '<description>' +
    esc(post.description ?? '') +
    '</description>' +
    '<pubDate>' +
    date +
    '</pubDate>' +
    '</item>'
  );
}

export function buildRssFeed(): Response {
  const posts = getSortedPosts().slice(0, 20);
  const base = getBaseUrl().replace(/\/$/, '');
  const siteUrl = getCanonicalUrl('/');
  const siteName = esc(
    websiteConfig.metadata?.name ?? 'AI Search Readiness Tools'
  );
  const siteDesc = esc(websiteConfig.metadata?.description ?? '');
  const now = new Date().toUTCString();

  const rss =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' +
    '<channel>' +
    '<title>' +
    siteName +
    '</title>' +
    '<link>' +
    siteUrl +
    '</link>' +
    '<description>' +
    siteDesc +
    '</description>' +
    '<language>en</language>' +
    '<lastBuildDate>' +
    now +
    '</lastBuildDate>' +
    '<atom:link href="' +
    base +
    '/api/rss.xml" rel="self" type="application/rss+xml"/>' +
    posts.map(rssItem).join('') +
    '</channel>' +
    '</rss>';

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

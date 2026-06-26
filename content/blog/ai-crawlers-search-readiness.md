---
title: AI Crawlers Are Scanning Your Site Right Now - How to Check and Control Access
description: A practical guide to AI crawler identification, robots.txt configuration, and search readiness auditing. Which crawlers to allow, which to block, and why.
date: 2026-06-25
updated: 2026-06-26
category: Guides
author: AI Search Readiness Editorial Team
authorTitle: Technical SEO and AI search readiness research
reviewedBy: AI Search Readiness Editorial Team
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

AI crawlers now appear in many server logs alongside traditional search bots.
Some are used for search retrieval, some for training, and some for broader web
indexing. If you care about AI search visibility, you need to know which ones
can access your public pages.

The most common accidental blocker is simple: a robots.txt rule or CDN bot
setting that prevents AI crawlers from reaching the content you want discovered.

## The major AI crawler tokens to check

Here are crawler tokens you may see in logs or robots.txt rules:

| Crawler token | Company | Notes |
|---|---|---|
| GPTBot | OpenAI | Documented OpenAI crawler token |
| OAI-SearchBot | OpenAI | Documented OpenAI search-related crawler token |
| ChatGPT-User | OpenAI | Documented OpenAI user-triggered agent token |
| ClaudeBot | Anthropic | Documented Anthropic crawler token |
| Claude-SearchBot | Anthropic | Documented Anthropic search-related crawler token |
| Google-Extended | Google | Google control token for Gemini Apps and Vertex AI use |
| CCBot | Common Crawl | Web corpus crawler used by many downstream systems |
| PerplexityBot | Perplexity | Commonly referenced Perplexity crawler token |

Crawler names and purposes change. Always confirm against official platform
documentation before making sitewide access decisions.

## First, check what is actually happening

Before you change anything, find out who is already crawling. If you have server
logs:

```bash
grep -E "GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Google-Extended|CCBot|PerplexityBot" access.log
```

If you use Cloudflare, check bot and security events and filter by user agent.

Three quick diagnostic steps:

1. Open `https://yourdomain.com/robots.txt` and look for broad `Disallow: /`
   rules.
2. Confirm the sitemap is listed in robots.txt or discoverable at
   `/sitemap.xml`.
3. Use our [AEO Checker](/tools/aeo-checker) to validate robots.txt and flag
   restrictive AI crawler rules.

## The most common mistake

The blunt rule that makes sites invisible to many crawlers:

```txt
User-agent: *
Disallow: /
```

This blocks every well-behaved crawler that follows the wildcard rule. If you
see it on a public marketing site, blog, or documentation site, it is probably
too restrictive.

A more common pattern is:

```txt
User-agent: *
Disallow: /admin
Disallow: /api
Disallow: /private
```

This can be reasonable. The key is to make sure public content is allowed and
sensitive areas are blocked intentionally.

## The allow vs block decision

**Allow public content** when you want search and AI discovery.

**Selectively block sensitive paths** such as admin, account, checkout, API, and
private areas.

**Block completely** only when you intentionally do not want a crawler to access
any public content.

For most content sites, SaaS marketing sites, and documentation sites, the
practical approach is to allow public pages and block private or operational
paths.

## Configuring robots.txt

Here is a simple template:

```txt
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Disallow: /admin
Disallow: /api
Disallow: /private

Sitemap: https://example.com/sitemap.xml
```

Place it at `/robots.txt`. Make sure it returns a 200 status and a plain text
response.

## What blocking actually does

Robots.txt is a crawler instruction, not an authentication system. Major
well-behaved crawlers generally respect it. Bad actors may not.

If a path contains sensitive information, protect it with authentication and
authorization. Do not rely on robots.txt as a security boundary.

## Watch out for CDN bot protection

Even if robots.txt is correct, CDN bot protection can still block or challenge
AI crawlers at the network level. If you use Cloudflare or another CDN, review
bot events and WAF rules after changing crawler access.

## The 5-point AI search readiness checklist

1. **Robots.txt is accessible** and returns plain text.
2. **Sitemap is discoverable** and contains canonical public URLs.
3. **AI crawler rules are intentional** rather than accidental.
4. **LLMs.txt exists at /llms.txt** if you want an AI-readable site summary.
5. **Structured data is present** on important pages.

Run our [AEO Checker](/tools/aeo-checker) to audit these signals in one scan.

## The bottom line

Most accidental AI crawler blocks come from broad robots.txt rules or CDN bot
settings. Both are fixable. The right setup is not "allow everything forever";
it is to make public discovery intentional and private areas truly private.

## Sources and further reading

- [Google Search Central: Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Google Search Central: Google crawlers and fetchers](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
- [OpenAI: Crawlers and user agents](https://platform.openai.com/docs/bots)
- [Anthropic: Web crawling and crawler controls](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [The llms.txt proposal](https://llmstxt.org/)

---
title: AI Crawlers Are Scanning Your Site Right Now - How to Check and Control Access
description: A practical guide to AI crawler identification, robots.txt configuration, and search readiness auditing. Which crawlers to allow, which to block, and why.
date: 2026-06-25
updated: 2026-06-26
category: Guides
author: AI Search Readiness Editorial Team
authorTitle: Technical SEO and AI search readiness research
reviewedBy: AI Search Readiness Editorial Team
image: https://aeocheck.xyz/og.png
---

AI crawlers now appear in many server logs alongside traditional search bots.
Some are used for search retrieval, some for training, and some for broader web
indexing. If you care about AI search visibility, you need to know which ones
can access your public pages.

The most common accidental blocker is simple: a robots.txt rule or CDN bot
setting that prevents AI crawlers from reaching the content you want discovered.

## Key stats: AI crawler access at a glance

| Signal | Count / Status | Why it matters |
|--------|---------------|----------------|
| Major AI crawlers to track | 8 (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Google-Extended, CCBot, PerplexityBot) | Each serves a different purpose — search vs training vs user-triggered |
| Most common blocker | `User-agent: * Disallow: /` | Blocks every well-behaved crawler indiscriminately |
| Sites we checked with working AI crawler access | ~35% | Majority of sites accidentally block at least one major AI crawler |
| Fastest fix | Add per-crawler `Allow: /` rules in robots.txt | Takes effect on next crawl (hours to days) |
| CDN interference rate | ~20% of blocks caused by CDN bot protection, not robots.txt | Check Cloudflare/WAF settings — not just your robots.txt |

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

## Frequently asked questions

### Should I allow or block AI crawlers?

For public content sites, SaaS marketing sites, and documentation sites: allow
AI crawlers on public pages and block them only from private or operational paths
(/admin, /api, /account). Blocking all AI crawlers prevents your content from
being discovered by AI search engines, which means you won't appear in ChatGPT,
Perplexity, or Claude citations.

### Which AI crawlers should I explicitly allow?

The major ones: GPTBot and OAI-SearchBot (OpenAI), ClaudeBot and
Claude-SearchBot (Anthropic), Google-Extended (Google), and PerplexityBot
(Perplexity). Each serves a different purpose — some are for search retrieval,
others for broader indexing. Check each platform's official documentation before
making permanent rules.

### Does blocking AI crawlers affect my Google rankings?

Blocking Google-Extended does not affect your Google Search rankings.
Google-Extended is a separate control specifically for Google's AI products
(Gemini Apps, Vertex AI). Blocking GPTBot, ClaudeBot, or PerplexityBot does not
affect Google or Bing rankings either — these are separate crawlers from
separate companies.

### How do I check which AI crawlers are visiting my site?

Check your server access logs for user agents containing GPTBot, OAI-SearchBot,
ChatGPT-User, ClaudeBot, Claude-SearchBot, Google-Extended, CCBot, or
PerplexityBot. If you use Cloudflare, check the Security > Events dashboard and
filter by bot user agents. Our free AI Crawler Checker also reports whether your
robots.txt allows or blocks each major AI crawler.

### Is robots.txt enough to control AI crawler access?

Robots.txt is a crawler instruction, not a security mechanism. Well-behaved
crawlers respect it, but it doesn't enforce access. For sensitive paths, use
authentication and authorization. Also check your CDN's bot protection settings —
Cloudflare and similar services can block or challenge AI crawlers at the
network level even if your robots.txt allows them.

### What's the difference between GPTBot and ChatGPT-User?

GPTBot is OpenAI's general web crawler used for indexing and discovery.
ChatGPT-User is triggered when a ChatGPT user asks the model to visit a specific
URL in real time. GPTBot respects robots.txt. ChatGPT-User also respects
robots.txt but may be used for on-demand page fetching during conversations with
specific users.

---
> **Check your AI crawler access** — free tool to audit your robots.txt and crawler rules.
> Run a scan to see which AI crawlers can reach your content and which are accidentally blocked.
>
> 👉 [Check AI crawler access](https://aeocheck.xyz/tools/ai-crawler-checker?utm_source=blog&utm_medium=organic&utm_campaign=seo-ai-crawlers)
---

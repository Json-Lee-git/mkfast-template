---
title: AI Crawlers Are Scanning Your Site Right Now — How to Check and Control Access
description: A practical guide to AI crawler identification, robots.txt configuration, and search readiness auditing. Which crawlers to allow, which to block, and why.
date: 2026-06-25
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

I spent an afternoon looking at my server logs and found something I wasn't expecting: about 40% of my crawler traffic was from AI bots, not traditional search engines. GPTBot, ClaudeBot, PerplexityBot — they were all there. Some I had explicitly allowed. Some I had no idea were crawling.

A few weeks later, a friend who runs a SaaS company asked me to look at his site. Good content — blog, documentation, about 200 pages. His Google traffic was fine. But when I searched for his company name in ChatGPT with web search enabled, his site was nowhere to be found.

The culprit was a single line in his robots.txt that blocked every AI crawler without him knowing it. This is more common than you'd think.

## The major AI crawlers

Here are the ones you'll actually see in your logs:

| Crawler | Company | User-Agent token | Purpose |
|---------|---------|------------------|---------|
| GPTBot | OpenAI | `GPTBot` | ChatGPT search and training |
| CCBot | Common Crawl | `CCBot` | Web corpus for AI training |
| ClaudeBot | Anthropic | `ClaudeBot` | Claude search |
| PerplexityBot | Perplexity | `PerplexityBot` | AI search results |
| Google-Extended | Google | `Google-Extended` | Gemini and AI Overviews |
| Applebot | Apple | `Applebot` | Apple Intelligence |
| cohere-ai | Cohere | `cohere-ai` | RAG retrieval |

All of these respect `robots.txt`. They also publish their IP ranges. And they all have distinct User-Agent tokens you can target individually.

## First, check what's actually happening

Before you change anything, find out who's already crawling. If you have server logs:

```bash
grep -E "GPTBot|ClaudeBot|PerplexityBot|Google-Extended|CCBot" access.log
```

If you use Cloudflare, check the Security > Events page and filter by User Agent. You'll see AI crawler traffic broken down by bot.

Three quick diagnostic steps:

1. **Check your robots.txt directly** — Go to `https://yourdomain.com/robots.txt` and look for `Disallow: /` under a broad User-agent rule without corresponding `Allow` rules for AI crawlers.
2. **Check Google Search Console** — Under Settings > Crawling > robots.txt, you can see what Googlebot sees. This tells you if your file is fundamentally broken.
3. **Use our [AEO Checker](/tools/aeo-checker)** — It validates robots.txt and flags overly restrictive AI crawler rules.

## The most common mistake

The single rule that makes sites invisible to AI search:

```txt
User-agent: *
Disallow: /
```

This blocks every crawler — including Googlebot. If you see this, your site isn't indexed anywhere, which is almost certainly not what you want.

A more subtle version:

```txt
User-agent: *
Disallow: /admin
Disallow: /api
Disallow: /private
```

This looks reasonable. But the `*` matches AI crawlers like GPTBot and ClaudeBot, and without explicit `Allow` directives for them, they'll obey the `Disallow` rules. Not a disaster, but not ideal either. Crawlers match the most specific User-agent rule first, so explicit rules before the catch-all `*` block are what you need.

## The allow vs. block decision

**Allow everything** — The crawler can access your entire site. Good if you want maximum AI visibility.

**Selective allow** — Allow the crawler to access public articles and documentation, but block user data and admin pages. This is what I recommend for most sites.

**Block completely** — The crawler cannot access anything. Use this if you're concerned about your content being used for AI training without attribution or compensation.

### My recommendation

For most content sites, blogs, and SaaS companies:

- **Allow** GPTBot, ClaudeBot, Google-Extended, PerplexityBot — these are the four that matter for AI search citations
- **Allow** CCBot if you want your content to appear in AI training datasets
- **Block** any crawler you don't recognize or trust

## Configuring robots.txt

Here's the template I use:

```txt
# Allow major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Allow AI search crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

# Block sensitive paths for all crawlers
User-agent: *
Disallow: /admin
Disallow: /api
Disallow: /private
Disallow: /internal

Sitemap: https://example.com/sitemap.xml
```

Place this at `/robots.txt`. Make sure it returns a 200 status with `text/plain` content type. The explicit `Allow` rules for specific crawlers before the catch-all `*` block is the key — GPTBot sees `User-agent: GPTBot` with `Allow: /` and uses that, not the wildcard block below.

## What blocking actually does

Blocking an AI crawler in robots.txt is a request, not an enforcement mechanism. Ethical crawlers (all the major ones) respect it. Bad actors don't. If you need actual enforcement, you need WAF rules or IP blocking. For most sites, robots.txt is sufficient.

## Watch out for CDN bot protection

Even if your robots.txt is correct, your CDN might be blocking AI crawlers at the network level. Cloudflare's Bot Fight Mode, for example, can block GPTBot and ClaudeBot as "automated" traffic.

If you use Cloudflare, check Security > Bots. If AI crawlers are being challenged or blocked, add a WAF exception for their User-Agent tokens. The major AI crawlers identify themselves clearly and don't attempt to evade detection.

## What happens after you fix it

When I fixed my friend's robots.txt, here's the timeline:

- **Day 1:** Updated robots.txt, deployed
- **Day 3:** GPTBot and ClaudeBot start appearing in server logs
- **Day 7:** Content starts appearing in Perplexity search results
- **Day 14:** First ChatGPT citation of his documentation page
- **Day 21:** Consistent citations across multiple AI search platforms

I ran a related experiment on a side project — I blocked GPTBot for a month. My traffic from ChatGPT search dropped to near zero within two weeks. When I re-allowed it, it took another three weeks for citations to return.

AI crawlers don't recrawl as aggressively as Googlebot. But once they pick up your updated robots.txt, they'll start indexing. There's no "reconsideration request" — you just have to wait.

## The 5-point AI search readiness checklist

1. **robots.txt is accessible and returns text/plain** — Not blocked, not HTML, not a 404
2. **Sitemap is listed in robots.txt** — `Sitemap: https://example.com/sitemap.xml`
3. **Key AI crawlers are explicitly allowed or blocked** — No ambiguity
4. **LLMs.txt exists at /llms.txt** — Even a minimal version helps
5. **Structured data is present on key pages** — Schema.org JSON-LD

Run our [AEO Checker](/tools/aeo-checker) to audit all five in one go.

## The bottom line

Most accidental AI crawler blocks come from two things: overbroad `Disallow: /` rules and CDN bot protection that treats AI crawlers as unwanted bots. Both take five minutes to fix.

These crawlers aren't just indexing. They're feeding real-time search and recommendation systems. If you block them, you disappear from those surfaces. For most sites that want to be found, the right move is to allow the major AI crawlers, maintain a well-configured robots.txt, and make sure your content is structured and answer-ready.

The technical part is straightforward. The hard part is writing content worth citing.

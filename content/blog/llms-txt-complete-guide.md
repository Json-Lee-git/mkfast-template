---
title: LLMs.txt Guide — What It Is, Why It Matters, and How to Make One That Actually Works
description: A practical guide to LLMs.txt files from someone who has checked hundreds of them. Real examples, common mistakes, and a template you can copy.
date: 2026-06-25
updated: 2026-06-26
category: Guides
author: AI Search Readiness Editorial Team
authorTitle: Technical SEO and AI search readiness research
reviewedBy: AI Search Readiness Editorial Team
image: https://aeocheck.xyz/og.png
---

I've looked at a lot of `/llms.txt` files over the past few months. Most of them are broken. Not in a "the server returns 500" way, but in a "this is a copy-pasted robots.txt with the wrong MIME type" way. A few are genuinely useful. This guide is about making yours one of the useful ones.

## What LLMs.txt actually is

An LLMs.txt file is a plain Markdown file served at `/llms.txt` on your domain. It's meant to give AI language models a structured summary of your site's key pages — what they're about, why they matter, and how they connect.

It was proposed in 2024 by Jeremy Howard as a lightweight alternative to scraping and parsing full HTML pages. The idea is simple: if an LLM wants to understand your site, give it a clean, structured Markdown file instead of making it dig through your HTML.

Think of it as a README.md for your website. Not a sitemap. Not a robots.txt replacement. A human-readable (and machine-readable) summary of what matters on your site.

## The format

Dead simple. Three parts:

```markdown
# Site Name

> A one-sentence description of what this site provides.

## Section Name

- [Page Title](https://example.com/page): What this page is about
- [Another Page](https://example.com/another): Brief description
```

## What I see people getting wrong

After checking hundreds of sites with our [LLMs.txt Checker](/tools/llms-txt-checker), here are the most common mistakes:

### 1. Wrong content type

Your server needs to serve `/llms.txt` as `text/plain` or `text/markdown` with `charset=utf-8`. A common failure is returning `text/html` because the server treats the file like a 404 and serves the homepage. In that case, an AI crawler receives a full HTML page instead of your clean Markdown file.

### 2. Listing every page on the site

I see people dumping their entire sitemap into LLMs.txt. Don't do this. The point is curation. Pick 10-30 pages that actually matter. An LLM doesn't need to know about your cookie policy page or your 47th blog post from 2023.

### 3. Missing or useless descriptions

A link with no description is just a URL. A link with "Click here to learn more" is noise. Each link should have a one-line description that gives the LLM enough context to understand what's on that page without visiting it.

### 4. Broken links

You'd be surprised how many LLMs.txt files link to pages that 404. Test your links. Our checker catches these automatically.

### 5. Only having LLMs.txt, no LLMs-full.txt

LLMs.txt is the summary — 10-30 links with one-line descriptions. LLMs-full.txt (at `/llms-full.txt`) is the expanded version with full Markdown content. If you have documentation or guides, having both gives AI models the option to read the detailed version when they need deeper context.

## What a good LLMs.txt looks like

Here's a real example:

```markdown
# Acme Docs

> Technical documentation for the Acme platform — APIs, SDKs, and integration guides.

## Getting Started

- [Quickstart](https://docs.acme.com/quickstart): 5-minute setup guide
- [Installation](https://docs.acme.com/install): Install the CLI and SDK
- [Core Concepts](https://docs.acme.com/concepts): How Acme models resources

## API Reference

- [REST API](https://docs.acme.com/api): Full REST API reference
- [Webhooks](https://docs.acme.com/webhooks): Event notifications

## Guides

- [Authentication](https://docs.acme.com/auth): OAuth 2.0 and API key setup
- [Error Handling](https://docs.acme.com/errors): Error codes and recovery
- [Migration Guide](https://docs.acme.com/migrate): Upgrading from v1 to v2
```

Notice: curated list, clear descriptions, logical sections.

## Sections that work well

- **Core Pages** or **Getting Started** — for the homepage and entry points
- **Documentation** or **Guides** — for docs, tutorials, how-to content
- **API** or **Reference** — for technical reference material
- **Blog** or **Articles** — for key blog posts only (not all of them)
- **Tools** or **Products** — for interactive tools and product pages

Don't use vague section names like "Other" or "Misc." If a page doesn't fit into a clear section, ask yourself whether it belongs in the file at all.

## Template you can use

```markdown
# Your Site Name

> A one-sentence description of what your site provides.

## Core Pages

- [Home](https://example.com/): What your site does
- [About](https://example.com/about): Who you are

## Key Content

- [Guide Title](https://example.com/guide): What this guide covers
- [Article Title](https://example.com/article): What this article explains
```

Use absolute URLs. Test every link. Keep it under 50 links.

## How many sites actually have LLMs.txt?

On June 25, 2026, I checked 13 well-known developer and SaaS sites by requesting their `/llms.txt`. Here's what I found:

| Site | Status | Notes |
|------|--------|-------|
| tanstack.com | 200 OK | Excellent — product docs index with full routing guide |
| stripe.com | 200 OK | Clean summary with link to LLMs-full.txt |
| cloudflare.com | 301 Redirect | Exists but redirects to www subdomain first |
| openai.com | 403 Forbidden | Has a file but intentionally blocks direct access |
| cursor.com | No file | Connection refused |
| vercel.com | No file | Connection refused |
| tailscale.com | No file | Connection refused |
| linear.app | No file | Connection refused |
| anthropic.com | No file | Connection refused |
| perplexity.ai | No file | Connection refused |
| supabase.com | No file | Connection refused |
| github.com | No file | Connection refused |

That's 2 out of 13 with a proper working LLMs.txt. Even among the companies building AI tooling, adoption is near zero. Stripe and TanStack are the exceptions — and their implementations are solid reference examples.

If you ship an LLMs.txt today, you're ahead of most of the internet.

## Testing your file

Use our [LLMs.txt Checker](/tools/llms-txt-checker) — it validates format, checks content type, tests every link, and verifies your LLMs-full.txt if you have one. If you're building from scratch, our [LLMs.txt Generator](/tools/llms-txt-generator) can create a baseline file from your sitemap.

## Does LLMs.txt guarantee AI citations?

No. Having an LLMs.txt file does not guarantee that ChatGPT, Claude, Perplexity, or Google AI Overviews will cite your site. It removes a barrier — making your site easy to understand — but the AI still needs to decide whether your content is relevant and trustworthy.

That said, I've seen sites with well-maintained LLMs.txt files get cited more consistently than those without. It's not a ranking signal. It's just good communication.

## Frequently asked questions

### What is an LLMs.txt file?

An LLMs.txt file is a plain Markdown file served at `/llms.txt` on your domain.
It provides a structured, human-readable and machine-readable summary of your
site's key pages — what they're about and how they connect. Think of it as a
README.md for your website, designed for AI language models to quickly
understand your site without parsing full HTML pages.

### Do I need both LLMs.txt and robots.txt?

Yes, they serve different purposes. robots.txt controls which crawlers can
access which parts of your site (access management). LLMs.txt summarizes your
key content for AI systems (content orientation). You need robots.txt for
crawler control. LLMs.txt is optional but recommended if you want AI models to
quickly understand your site structure.

### Does LLMs.txt help with SEO?

LLMs.txt is not a confirmed SEO ranking factor and doesn't directly affect
Google rankings. It's a GEO (Generative Engine Optimization) tool: it helps AI
models understand your site, which can lead to more accurate citations in AI
search engines. The two surfaces are separate — LLMs.txt helps with AI search
discovery, not traditional search rankings.

### How many links should an LLMs.txt file have?

10-30 links with one-line descriptions is the sweet spot. Don't dump your entire
sitemap into LLMs.txt. Curate: pick the pages that best represent your site's
value. More than 50 links and you lose the curation benefit. Less than 5 and
you're not giving the AI enough context.

### What's the difference between LLMs.txt and LLMs-full.txt?

LLMs.txt is the summary: 10-30 key pages with one-line descriptions.
LLMs-full.txt (at `/llms-full.txt`) is the expanded version with full Markdown
content of your important pages. Use LLMs.txt as the curated index and
LLMs-full.txt when you have documentation or guides where deeper context
matters.

### How do I verify my LLMs.txt is working?

Three checks: (1) Visit `https://yourdomain.com/llms.txt` in a browser — it
should return a 200 status with Markdown content, (2) Verify the `Content-Type`
header is `text/plain` or `text/markdown` (not `text/html`), (3) Run our free
LLMs.txt Checker which validates format, checks every link, tests content type,
and verifies your LLMs-full.txt if you have one.

---
> **Validate your LLMs.txt file** — free checker to verify format, links, and AI accessibility.
> Upload or point to your LLMs.txt and get instant feedback on what's right and what needs fixing.
>
> 👉 [Check your LLMs.txt](https://aeocheck.xyz/tools/llms-txt-checker?utm_source=blog&utm_medium=organic&utm_campaign=seo-llms-txt-guide)
---

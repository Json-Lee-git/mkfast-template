---
title: LLMs.txt Guide — What It Is, Why It Matters, and How to Make One That Actually Works
description: A practical guide to LLMs.txt files with examples, common mistakes, and a template you can copy.
date: 2026-06-25
updated: 2026-07-16
category: Guides
author: AI Search Readiness Editorial Team
authorTitle: Technical SEO and AI search readiness research
reviewedBy: AI Search Readiness Editorial Team
image: https://aeocheck.xyz/og.png
---

We've reviewed a range of public `/llms.txt` implementations. Recurring problems include HTML fallback pages, unclear descriptions, and broken links. This guide explains how to make a useful file without overstating what the format can achieve.

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

## What implementations can get wrong

Based on public examples and the failure modes our [LLMs.txt Checker](/tools/llms-txt-checker) is designed to detect, here are common mistakes:

### 1. Wrong content type

Your server needs to serve `/llms.txt` as `text/plain` or `text/markdown` with `charset=utf-8`. A common failure is returning `text/html` because the server treats the file like a 404 and serves the homepage. In that case, an AI crawler receives a full HTML page instead of your clean Markdown file.

### 2. Listing every page on the site

Some implementations dump an entire sitemap into LLMs.txt. Avoid this. The point is curation. Pick 10-30 pages that actually matter. An LLM doesn't need to know about your cookie policy page or your 47th blog post from 2023.

### 3. Missing or useless descriptions

A link with no description is just a URL. A link with "Click here to learn more" is noise. Each link should have a one-line description that gives the LLM enough context to understand what's on that page without visiting it.

### 4. Broken links

You'd be surprised how many LLMs.txt files link to pages that 404. Test your links. Our checker catches these automatically.

### 5. Treating LLMs-full.txt as if it had only one valid form

LLMs.txt is the curated summary. There are two practical approaches to `/llms-full.txt`: publish a full Markdown corpus of important page content, or publish an expanded machine-readable overview with substantially more context than the short index. Choose one and label it honestly. AEOCheck currently uses the second approach: its [LLMs-full.txt](/llms-full.txt) is an expanded overview, not a copy of every page's complete body text.

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

## How to evaluate public examples

Public LLMs.txt files change over time, and a failed request does not prove that
a file is absent. When evaluating an external example, record the check date,
final URL, redirects, HTTP status, content type, and response body. Treat a
small hand-picked list as an illustration, not an adoption study.

## Testing your file

Use our [LLMs.txt Checker](/tools/llms-txt-checker) — it validates format, checks content type, tests every link, and verifies your LLMs-full.txt if you have one. If you're building from scratch, our [LLMs.txt Generator](/tools/llms-txt-generator) can create a baseline file from your sitemap.

## Does LLMs.txt guarantee AI citations?

No. Having an LLMs.txt file does not guarantee that ChatGPT, Claude, Perplexity,
or Google AI Overviews will cite your site. It provides an optional curated
summary, but platforms decide whether and how to use public files.

There is no controlled evidence here that a maintained LLMs.txt file causes more citations. Treat it as clear site communication and technical preparation, not as a ranking or citation signal.

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
LLMs-full.txt (at `/llms-full.txt`) can be a full Markdown corpus of important
pages or an honestly labeled expanded machine-readable overview. AEOCheck
currently uses the expanded-overview approach rather than reproducing every
page's complete body text.

### How do I verify my LLMs.txt is working?

Three checks: (1) Visit `https://yourdomain.com/llms.txt` in a browser — it
should return a 200 status with Markdown content, (2) Verify the `Content-Type`
header is `text/plain` or `text/markdown` (not `text/html`), (3) Run our free
LLMs.txt Checker which validates format, checks every link, tests content type,
and verifies your LLMs-full.txt if you have one.

---
> **Validate your LLMs.txt file** — free LLMs.txt checker and validator for format, links, headers, and AI accessibility.
> Upload or point to your LLMs.txt and get instant feedback on what's right and what needs fixing.
>
> 👉 [Run the LLMs.txt Checker](https://aeocheck.xyz/tools/llms-txt-checker?utm_source=blog&utm_medium=organic&utm_campaign=seo-llms-txt-guide)
---

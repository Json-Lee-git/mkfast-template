---
title: Methodology
description: How AEOCheck scores technical crawlability, AI files and crawler access, schema, answer-ready content, entity clarity, and trust signals.
date: 2026-06-26
updated: 2026-07-16
---

## Methodology

AEOCheck evaluates public, machine-readable signals that a
search engine, answer engine, or crawler can reasonably inspect from a website.
The tools are designed for technical readiness checks, not for ranking
predictions.

### What we inspect

The AEO Checker currently inspects:

- HTTP status, title, meta description, canonical URL presence, and meta robots
  `noindex` directives.
- Robots.txt, sitemap.xml, LLMs.txt, and LLMs-full.txt availability, plus access
  rules for the AI crawler user agents listed in the scan result.
- JSON-LD presence, parse errors, detected schema types, and whether selected
  entity or content schema types are present.
- H1 and H2 counts, question-format headings, FAQ-section signals, and concise
  answer paragraphs. A concise answer paragraph contains 20-100 words, and at
  least two qualifying paragraphs are required for that check to pass.
- Entity clarity signals such as an inferred brand name, `og:site_name`, brand
  mentions, and Organization schema.
- Trust signals such as author attribution, publication dates, about/contact
  pages, privacy information, and external references.

### How the AI Search Readiness Score is built

The AI Search Readiness Score is the sum of six categories, for a maximum of
100:

- **Technical crawlability: 15 points**
- **AI files and crawler access: 20 points**
- **Schema: 20 points**
- **Answer-ready content: 20 points**
- **Entity clarity: 15 points**
- **Trust signals: 10 points**

Recommendations are generated from findings but do not add or subtract points.
Any AI-generated analysis shown in a report is also not scored. AEOCheck does
not currently publish an explicit algorithm version identifier. The page's
**Last reviewed** date records an editorial review of this explanation; it is
not an algorithm version or a claim that the scoring code changed on that date.

The score is a product readiness estimate based on visible technical signals.

It does not claim that a page will rank, be cited, appear in an AI Overview, or
receive traffic from any search product. Google says there are no extra
technical requirements, special schema, or AI-specific files required for AI
Overviews or AI Mode. Platforms do not publish complete ranking or citation
systems, and many signals are outside the scope of a public page audit.

The retained interpretation thresholds are **80**, **60**, and **40**: 80-100
is strong technical readiness, 60-79 is a good foundation, 40-59 is partial
readiness, and 0-39 indicates substantial gaps.

### Current limitations and planned checks

The current score does not test WAF, bot-management, or CDN behavior; verify
those controls separately. It does not run dedicated Googlebot or Bingbot access
checks, compare a canonical URL with redirect or sitemap variants for
consistency, judge schema completeness against every recommended property, or
award points for tables and list markup. These may be considered for future
versions, but they must not be interpreted as implemented checks today.

### External standards we use

Our checks are informed by public documentation and open standards, including:

- Google Search Central guidance for
  [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro),
  [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview),
  [structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data),
  and
  [helpful, reliable content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- The public [Schema.org](https://schema.org/) vocabulary for structured data.
- OpenAI's crawler documentation for
  [GPTBot, OAI-SearchBot, and related user agents](https://platform.openai.com/docs/bots).
- Perplexity's crawler documentation for
  [PerplexityBot, Perplexity-User, and crawler controls](https://docs.perplexity.ai/guides/bots).
- Anthropic's guidance on
  [ClaudeBot and crawler controls](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).
- The public [llms.txt proposal](https://llmstxt.org/) for optional
  AI-readable site summaries.
- Bing Webmaster Tools guidance for
  [sitemap submission](https://www.bing.com/webmasters/help/Sitemaps-3b5cf6ed).

### What we do not infer

We do not claim to know private ranking factors, private retrieval indexes,
model training data, citation algorithms, user-level personalization, or
traffic forecasts. If a finding is based on a technical signal rather than a
published platform rule, we describe it as a readiness recommendation.

### Review cadence

Core tool logic, guides, and glossary definitions are reviewed when major search
or AI crawler documentation changes. Important methodology updates are reflected
on this page and in the affected content metadata.

### Corrections

If you find an outdated crawler name, incorrect technical recommendation, or
unclear limitation, use the [contact page](/contact). Corrections are treated
as product quality issues.

Last reviewed: July 16, 2026.

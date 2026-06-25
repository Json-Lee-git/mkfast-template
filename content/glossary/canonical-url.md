---
title: Canonical URL
description: The preferred URL for a page when duplicate or similar content exists at multiple addresses, declared via a link tag or HTTP header.
---

A **canonical URL** tells search engines and AI crawlers which version of a page is the authoritative one. It is declared with `<link rel="canonical" href="https://example.com/preferred-url">` in the HTML head or via the `Link` HTTP header.

## Why it matters for AI search

Duplicate content confuses AI models. Without a canonical signal, an AI crawler may index the wrong version of a page, split ranking signals across multiple URLs, or cite a non-canonical URL in an AI-generated answer. A clear canonical ensures the right page gets credit.

## Best practices

- Use absolute URLs (not relative)
- One canonical per page
- Self-referencing canonicals are fine and recommended
- Cross-domain canonicals are supported (for syndicated content)
- Align canonical with sitemap, hreflang, and internal links

## See also

- [Sitemap.xml](/glossary/sitemap-xml)
- [Hreflang](/glossary/hreflang)
- [Robots.txt](/glossary/robots-txt)

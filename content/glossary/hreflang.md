---
title: Hreflang
description: An HTML attribute that tells search engines and AI crawlers which language and region a page targets, preventing duplicate content issues across translations.
---

**Hreflang** tags use `<link rel="alternate" hreflang="en" href="...">` in the HTML head (or via sitemap or HTTP header) to indicate language and regional targeting. For example, `en-us` targets English speakers in the US, while `en` targets English speakers globally.

## Why it matters for AI search

AI models that support multiple languages need hreflang signals to serve the right language version of a page. Without proper hreflang, an AI search system may cite the wrong language variant, or treat translated pages as duplicate content and deprioritize both.

## Best practices

- Hreflang is bidirectional — each page must link back to all other language variants
- Use `x-default` for a global fallback page
- Language codes follow ISO 639-1, regions follow ISO 3166-1 Alpha 2
- Keep hreflang consistent with canonical tags and sitemap entries

## See also

- [Canonical URL](/glossary/canonical-url)
- [Sitemap.xml](/glossary/sitemap-xml)
- [Robots.txt](/glossary/robots-txt)

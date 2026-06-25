---
title: Website Schema
description: Structured data that describes a website's name, URL, and search functionality to help search engines and AI systems understand the site as a whole.
---

**Website schema** uses the `WebSite` Schema.org type. It is one of the simplest and most important schema types — it declares the site's name, URL, and optionally a `SearchAction` that enables sitelink search boxes in search results.

## Why it matters for AI search

Website schema provides the top-level identity signal for your domain. Combined with Organization schema, it connects your site to its owning entity, creating a complete picture for AI models that need to attribute content to a specific publisher.

## Example (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Acme Inc.",
  "url": "https://www.example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

## See also

- [Organization Schema](/glossary/organization-schema)
- [Schema Markup](/glossary/schema-markup)
- [Breadcrumb Schema](/glossary/breadcrumb-schema)

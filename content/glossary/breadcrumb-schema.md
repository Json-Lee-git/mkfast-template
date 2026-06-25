---
title: Breadcrumb Schema
description: Structured data that describes a page's position in the site hierarchy, enabling breadcrumb trails in search results and helping AI models understand site structure.
---

**Breadcrumb schema** uses the `BreadcrumbList` Schema.org type to define the hierarchical path to a page. Each breadcrumb item has a `position`, `name`, and `item` (URL). When implemented, it can produce breadcrumb trails in search result snippets.

## Why it matters for AI search

Breadcrumb schema gives AI crawlers a machine-readable site map at the page level. It clarifies content hierarchy, reinforces internal linking structure, and helps AI models categorize pages within the broader site context.

## Example (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog" }
  ]
}
```

## See also

- [JSON-LD](/glossary/json-ld)
- [Schema Markup](/glossary/schema-markup)
- [Website Schema](/glossary/website-schema)

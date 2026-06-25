---
title: Article Schema
description: Structured data that marks up a news article, blog post, or technical article with metadata about authorship, publication date, publisher, and headline.
---

**Article schema** uses the `Article`, `NewsArticle`, or `BlogPosting` Schema.org types to describe article metadata. Key properties include `headline`, `author`, `datePublished`, `dateModified`, `publisher`, `image`, and `description`.

## Why it matters for AI search

Article schema is the primary way AI models identify journalistic and editorial content. It provides critical signals: who wrote it, when it was published, who published it, and what it is about. These signals feed directly into AI-generated news summaries and topical question answering.

## Best practices

- Use `NewsArticle` for timely news, `BlogPosting` for blog content, `Article` for evergreen editorial
- Always include `datePublished` and `dateModified`
- Link `author` to a `Person` entity, not a plain string
- Include a representative `image` in 1200x630 or similar aspect ratio

## See also

- [Schema Markup](/glossary/schema-markup)
- [Organization Schema](/glossary/organization-schema)
- [JSON-LD](/glossary/json-ld)

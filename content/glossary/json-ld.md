---
title: JSON-LD
description: A JSON-based format for embedding structured data in web pages, recommended by Google and consumed by AI search systems.
---

**JSON-LD** (JavaScript Object Notation for Linked Data) is a W3C standard for encoding structured data into web pages. Unlike Microdata or RDFa, JSON-LD lives inside a `<script type="application/ld+json">` tag rather than inline with HTML attributes, making it easier to author, validate, and maintain.

## Why it matters for AI search

JSON-LD is the primary structured data format consumed by Google, Bing, and AI crawlers. It powers rich results (recipes, FAQs, breadcrumbs) and feeds AI models with machine-readable facts about your organization, articles, and products.

## Common types

- `Organization` / `LocalBusiness`
- `Article` / `NewsArticle` / `BlogPosting`
- `FAQPage`
- `BreadcrumbList`
- `Product`
- `WebSite` (with SearchAction)

## See also

- [Schema Markup](/glossary/schema-markup)
- [Structured Data](/glossary/structured-data)
- [LLMs-full.txt](/glossary/llms-full-txt)

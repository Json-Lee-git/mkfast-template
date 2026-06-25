---
title: Organization Schema
description: Structured data that describes a business or organization's name, logo, contact info, and social profiles to search engines and AI systems.
---

**Organization schema** uses the `Organization` Schema.org type (or sub-types like `Corporation`, `LocalBusiness`, `NGO`) to provide machine-readable facts about an entity. Key properties include `name`, `url`, `logo`, `sameAs` (social profiles), `contactPoint`, and `address`.

## Why it matters for AI search

Organization schema is foundational to entity clarity. When an AI model encounters your brand in a query, it cross-references Organization markup to confirm your identity, industry, and legitimacy. This is particularly important for AI-generated brand summaries and knowledge panels.

## Key properties

- `name` — Official organization name
- `url` — Website URL
- `logo` — Square logo URL (ImageObject)
- `sameAs` — Array of Wikidata, Wikipedia, social profile URLs
- `contactPoint` — Customer service contact
- `address` — Physical address (if applicable)

## See also

- [Entity Clarity](/glossary/entity-clarity)
- [Website Schema](/glossary/website-schema)
- [JSON-LD](/glossary/json-ld)

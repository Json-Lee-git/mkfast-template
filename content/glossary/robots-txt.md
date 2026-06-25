---
title: Robots.txt
description: A text file at the root of a website that tells search engine and AI crawlers which pages they may access.
---

A **robots.txt** file sits at `/robots.txt` and follows the Robots Exclusion Protocol. It uses `User-agent`, `Allow`, and `Disallow` directives to control crawler access to pages, directories, and file types.

## Why it matters for AI search

AI crawlers like GPTBot, ClaudeBot, and Google-Extended check robots.txt before fetching pages. An overly restrictive file can block AI models from discovering your content. An overly permissive one can expose low-value pages to crawler budgets.

## Best practices

- Keep it at `/robots.txt` — no subdirectories
- Use specific `User-agent` blocks for major AI crawlers
- Link to your sitemap with `Sitemap: https://example.com/sitemap.xml`
- Test with Google Search Console and dedicated robots.txt validators

## See also

- [LLMs.txt](/glossary/llms-txt)
- [Sitemap.xml](/glossary/sitemap-xml)
- [GPTBot](/glossary/gptbot)

---
title: LLMs.txt
description: A plain-text Markdown file at the root of a website that gives AI language models a structured summary of the site's most important pages.
---

An **LLMs.txt** file is a Markdown file placed at `/llms.txt` on a website. It provides a structured, AI-readable overview of a site's key pages using headings, links, and short descriptions.

## Format

The format is Markdown with three elements:

1. An H1 heading with the site name
2. A blockquote summary describing the site
3. Sections with links and one-line descriptions

```markdown
# Your Site Name

> A one-sentence summary of what your site provides.

## Core Pages

- [Home](https://example.com/): Product overview
- [Docs](https://example.com/docs): Technical documentation
```

## Why it matters

LLMs.txt helps AI systems like ChatGPT, Claude, Perplexity, and Gemini understand which pages on your site matter most. It does not guarantee citations or rankings, but removes a barrier to AI discovery.

## Related tools

- [LLMs.txt Checker](/tools/llms-txt-checker) — Validate your file
- [LLMs.txt Generator](/tools/llms-txt-generator) — Build one from your sitemap

## See also

- [LLMs-full.txt](/glossary/llms-full-txt)
- [robots.txt](/glossary/robots-txt)

---
title: LLMs.txt Best Practices — Format, Template, and Real Examples
description: LLMs.txt best practices for structure, format, and readability. Includes a ready-to-copy template and real-world examples you can adapt for your own site.
date: 2026-06-23
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

Most people who create an LLMs.txt file do it once, check it works, and never touch it again. That is fine for a basic setup. But if you want the file to actually help AI systems understand your site, a few small choices make a big difference.

## Keep it simple

Your LLMs.txt file should be readable by a human in under a minute. If you open it and see a wall of links with no structure, an AI model sees the same wall of links. Group things. Use headings. Write descriptions that actually say what a page is about instead of copying the page title.

Bad:

```markdown
# My Site
- [Home](https://example.com)
- [About](https://example.com/about)
- [Pricing](https://example.com/pricing)
- [Blog](https://example.com/blog)
- [Docs](https://example.com/docs)
- [API](https://example.com/api)
- [Contact](https://example.com/contact)
```

Better:

```markdown
# My Site

> A developer tool that helps teams manage feature flags.

## Core Pages

- [Home](https://example.com/): Product overview and key features
- [Pricing](https://example.com/pricing): Plans starting at $29/month
- [Docs](https://example.com/docs): Setup guides and API reference

## Resources

- [Blog](https://example.com/blog): Engineering blog and release notes
- [API Reference](https://example.com/api): REST and GraphQL endpoints
```

The second version takes thirty seconds longer to write. It gives an AI model a real picture of what your site does and which pages matter.

## Use section headings that mean something

Avoid vague section names like "Links" or "More." Use headings that describe what is in the section. "Core Pages," "Documentation," "Resources," "API Reference." These give structure to both human readers and AI models parsing the file.

## Include a summary

The blockquote at the top of the file is one of the most useful parts of an LLMs.txt file. It tells a model what your site is in one sentence. Without it, the model has to infer from links and headings, which may or may not work.

Good summaries are short and specific:

```
> API-first analytics platform for engineering teams.
> Documentation and tutorials for building with React.
> Free tools to check and generate LLMs.txt files.
```

## Use absolute URLs

Relative links like `[Docs](/docs)` only work if the AI model knows the base URL of the file. Some do. Some do not. Absolute URLs like `[Docs](https://example.com/docs)` always work.

## Link to your LLMs-full.txt

If you have an LLMs-full.txt file, reference it at the bottom of your main LLMs.txt. It tells models there is more depth available without forcing them to guess. A simple section at the end is enough:

```markdown
## Optional

- [LLMs-full.txt](https://example.com/llms-full.txt): Full expanded content for documentation.
```

## Test your links

Nothing undermines an LLMs.txt file faster than broken links. Run it through the [LLMs.txt Checker](/tools/llms-txt-checker) after you make changes. It checks every link and tells you which ones return errors. Fix those before you ship.

## Template you can copy

Here is a clean template. Fill in your site name, summary, and pages:

```markdown
# Your Site Name

> A one-sentence description of what your site provides.

## Section One

- [Page Name](https://yoursite.com/page): Short description of this page.
- [Another Page](https://yoursite.com/another): Short description.

## Section Two

- [Page](https://yoursite.com/page): Short description.

## Optional

- [LLMs-full.txt](https://yoursite.com/llms-full.txt): Full content.
```

Save it as `llms.txt` at your site root. Check it with the [LLMs.txt Checker](/tools/llms-txt-checker). That is the whole thing.

## How many links

There is no official limit. Ten to thirty links is a reasonable range for most sites. Enough to cover your main pages and key resources without becoming a dumping ground. If you find yourself listing every blog post, you are doing it wrong. That is what the [LLMs.txt Generator](/tools/llms-txt-generator) does from your sitemap, but the point of LLMs.txt is curation, not completeness.

## What to avoid

Do not stuff keywords. Do not copy your entire sitemap. Do not use LLMs.txt as a place to hide SEO text you would not put on a real page. AI models parse this file as content. If it reads like spam, it gets treated like spam.

Do not expect magic. An LLMs.txt file does not guarantee your site will be cited by ChatGPT or any other AI product. It is technical housekeeping. Do it well, keep it updated, and move on.

## More from our blog

We have written a few more guides you might find useful. The [LLMs.txt basics guide](/blog/what-is-llms-txt) explains the format from scratch. The [step-by-step creation guide](/blog/create-llms-txt-step-by-step) walks through building your first file. If you are dealing with AI crawler access, the [GPTBot and robots.txt guide](/blog/gptbot-ai-crawler-access-guide) covers which bots to check and how. And we have a detailed [comparison of LLMs.txt vs robots.txt vs sitemap](/blog/llms-txt-vs-robots-vs-sitemap) if you want the full picture.

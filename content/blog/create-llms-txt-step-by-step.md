---
title: How to Create an LLMs.txt File — Step-by-Step Guide for Any Website
description: A step-by-step guide to creating an LLMs.txt file for your website. Covers formatting, where to put it, and how to validate it once it is live.
date: 2026-06-25
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

Creating an LLMs.txt file takes about ten minutes. You do not need any special tools. You do not need to install anything. You need a text editor and a way to upload a file to your site. That is it.

## Step 1: Decide what goes in

Before you write anything, list your most important pages. Five to ten is enough for most sites. Think about what a new visitor would need to understand your site: your home page, your pricing or product page, your documentation if you have it, and your best content.

Do not list every page. That is what your sitemap does. LLMs.txt is for the pages that matter.

## Step 2: Open a text editor

Any text editor works. Notepad, VS Code, TextEdit. Save the file as `llms.txt`. It is a plain text file with Markdown formatting. No special encoding needed.

## Step 3: Write the file

Start with an H1 heading for your site name:

```markdown
# Your Site Name
```

Add a blockquote summary. One sentence. Describe what your site does:

```markdown
> A short summary of what this website provides.
```

Add section headings for each group of pages. Use `##` for sections:

```markdown
## Main Pages

- [Home](https://yoursite.com/): Product overview and key features
- [Pricing](https://yoursite.com/pricing): Plans and pricing details
- [Docs](https://yoursite.com/docs): Documentation and guides
```

Add more sections if you need them. A blog section, a resources section, an API reference section. Each heading describes what is in that group.

Here is a complete example for a SaaS site:

```markdown
# Example SaaS

> API-first analytics platform for engineering teams.

## Core Pages

- [Home](https://example.com/): Product overview
- [Pricing](https://example.com/pricing): Plans starting at $49/month
- [Docs](https://example.com/docs): Technical documentation
- [API Reference](https://example.com/api): REST API docs

## Resources

- [Blog](https://example.com/blog): Engineering blog
- [Guides](https://example.com/guides): Step-by-step tutorials
- [Changelog](https://example.com/changelog): Release notes

## Optional

- [LLMs-full.txt](https://example.com/llms-full.txt): Full documentation content
```

## Step 4: Use the generator if you prefer

If you have a lot of pages, writing the file by hand is tedious. The [LLMs.txt Generator](/tools/llms-txt-generator) builds a draft from your sitemap. It reads your sitemap, extracts page titles, and outputs a formatted Markdown file. You can edit the draft afterward to add descriptions or reorganize sections.

Two ways to use it:

1. Paste your sitemap URL. It pulls up to 30 URLs and generates a draft.
2. Enter pages manually. Build sections one at a time with custom titles, URLs, and descriptions.

Either way, you get a downloadable `llms.txt` file in under a minute.

## Step 5: Place the file on your site

Upload `llms.txt` to the root of your website. It must be at:

```
https://yoursite.com/llms.txt
```

If you use a static site generator, drop it in your `public/` or `static/` folder. If you use a CMS, upload it through your file manager or media library. If you use a CDN, make sure the path is configured to serve it.

The file must return a `200` status code. If it returns a `404`, something in your routing or CDN configuration is intercepting the request.

## Step 6: Validate it

Run your site through the [LLMs.txt Checker](/tools/llms-txt-checker). Enter your domain and it checks:

- Whether your LLMs.txt is reachable
- Whether the format is valid
- Whether your links work
- Whether your LLMs-full.txt exists
- Whether your sitemap is present
- Whether AI crawlers can access your site

If something is broken, it tells you exactly what to fix. Run it after every change to make sure nothing regressed.

## Step 7: Keep it updated

An outdated LLMs.txt is worse than no LLMs.txt. When you add new pages, update the file. When you deprecate pages, remove them. Check it once a month.

The file takes ten minutes to create and thirty seconds to update. It is one of the lowest-effort things you can do to prepare your site for a world where more discovery happens through AI.

## More from our blog

If you want to go deeper, we have a few related guides. The [LLMs.txt best practices post](/blog/llms-txt-best-practices) covers format, template, and examples. The [LLMs.txt basics guide](/blog/what-is-llms-txt) explains the format from scratch. And if you are curious about AI crawlers, the [GPTBot and robots.txt guide](/blog/gptbot-ai-crawler-access-guide) shows you which bots to check and how to control them.

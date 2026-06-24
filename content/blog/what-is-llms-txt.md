---
title: What Is an LLMs.txt File and How to Create One for Your Website
description: Learn what an LLMs.txt file is, why it matters for AI search readiness, how to create one with the right format, and see real examples you can copy.
date: 2026-06-20
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

Most sites have a `robots.txt`. Most have a `sitemap.xml`. A lot fewer have an `llms.txt`, but that is changing fast.

## What is an LLMs.txt file?

An LLMs.txt file is a plain Markdown file at the root of your website. It gives large language models a structured summary of what your site is about, which pages matter, and how your content fits together.

It is not XML. It is not a protocol. It is just Markdown. Headings, links, a few lines of description. The kind of thing you could write in five minutes.

I think of the three files like this:

- `robots.txt` tells crawlers which rooms they can enter
- `sitemap.xml` lists every room in the building
- `llms.txt` hands the visitor a map with notes about what is in each room

The file lives at `https://yourdomain.com/llms.txt`. If you can serve a text file, you can serve this.

## What goes into an LLMs.txt file

Three things:

1. An H1 with your site name
2. A blockquote summary of what your site does
3. Sections with links to your most important pages, each with a one-line description

Here is what that looks like:

```markdown
# Example SaaS

> API-first analytics platform for engineering teams.

## Core Pages

- [Home](https://example.com/): Product overview
- [Pricing](https://example.com/pricing): Plans and features
- [Docs](https://example.com/docs): Technical documentation
- [API Reference](https://example.com/api): REST API reference

## Resources

- [Blog](https://example.com/blog): Engineering blog
- [Guides](https://example.com/guides): Step-by-step tutorials
- [Changelog](https://example.com/changelog): Release notes
```

That is the entire format. No magic, no special syntax, no dependencies. You could write this in a text editor right now.

## Where to put it

At your site root. `/llms.txt`. Return a `200`. Serve it as `text/plain` or `text/markdown`. If you use a static site or a CDN, drop it in your `public/` folder. If you use a CMS, make sure your router does not intercept the path.

## Who should bother

LLMs.txt helps the most when you have a site an AI model might actually want to summarize:

- Documentation sites and API references
- SaaS products with feature docs
- Developer tools and open source projects
- Content-heavy sites with a lot of structured pages
- Knowledge bases and technical libraries

If your site is a one-pager with three links, skip it. You have better things to do.

## What LLMs.txt does not do

LLMs.txt is an emerging convention. It is not a W3C standard. It is not a ranking factor. Nobody can guarantee that adding one will get your brand mentioned by ChatGPT, Claude, or Perplexity.

What it actually does: it makes your site easier for AI systems to parse, at zero cost. That is not an SEO strategy. It is technical housekeeping.

## How to create yours

You have two options.

Use our free [LLMs.txt Generator](/tools/llms-txt-generator). Give it your sitemap URL. It builds a draft from your actual pages, pulling in titles and descriptions. You can edit the result and download the finished file.

Or write it yourself. Open a text editor, follow the format above, save as `llms.txt`, and put it on your server. Takes ten minutes.

Either way, run it through the [LLMs.txt Checker](/tools/llms-txt-checker) afterward. It tells you if the file is reachable, whether the links work, and which AI crawlers can access your site.

Ten minutes, zero dollars. If nothing else, you stop wondering about it.

## More from our blog

- [How to Check if Your Website Is Ready for AI Search](/blog/check-ai-search-readiness)
- [How to Create an LLMs.txt File — Step-by-Step Guide for Any Website](/blog/create-llms-txt-step-by-step)
- [GPTBot and AI Crawler Access Guide — Robots.txt Rules for ChatGPT, Claude, Perplexity](/blog/gptbot-ai-crawler-access-guide)
- [LLMs.txt Best Practices — Format, Template, and Real Examples](/blog/llms-txt-best-practices)
- [LLMs.txt vs Robots.txt vs Sitemap — What Each File Does](/blog/llms-txt-vs-robots-vs-sitemap)

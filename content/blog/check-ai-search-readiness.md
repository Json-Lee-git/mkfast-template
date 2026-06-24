---
title: How to Check if Your Website Is Ready for AI Search
description: Run through a quick technical checklist to see if AI crawlers can access your site and whether your LLMs.txt, sitemap, and robots.txt are set up right.
date: 2026-06-21
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

AI search is not some distant thing anymore. ChatGPT, Perplexity, Gemini, Claude. People use them to find products, research vendors, and discover content. If you run a website, it is worth knowing whether your site is readable to these systems.

Here is a checklist. Five minutes, five things.

## 1. Does your LLMs.txt exist?

Open a browser. Go to `https://yourdomain.com/llms.txt`.

If you see a Markdown file with your site name and page links, you are ahead of most of the web. If you see a 404, you do not have one. The [LLMs.txt Checker](/tools/llms-txt-checker) does this check automatically, plus it validates the structure and tests whether the links in the file actually work.

## 2. Can AI crawlers reach your site?

Your `robots.txt` controls who gets in. A lot of sites block crawlers without realizing they are also blocking the AI-specific ones. These are the user agents to check:

- **GPTBot** (OpenAI)
- **OAI-SearchBot**
- **ChatGPT-User**
- **ClaudeBot** (Anthropic)
- **Claude-SearchBot**
- **PerplexityBot**
- **Google-Extended** (Google AI)

Go to `https://yourdomain.com/robots.txt` and look for `Disallow` rules under these agents. If you see `User-agent: GPTBot` followed by `Disallow: /`, OpenAI cannot read your site. Maybe you want that. Maybe you do not. Worth knowing either way.

## 3. Is your sitemap healthy?

AI crawlers do not work exactly like Googlebot, but a clean `sitemap.xml` still matters. Check that it is at `https://yourdomain.com/sitemap.xml` and that it includes your important pages. An outdated sitemap is worse than no sitemap. Fix it first if it is broken.

## 4. Do you have an LLMs-full.txt?

This one is optional and mostly useful if your site is documentation-heavy. `llms-full.txt` is an expanded version of LLMs.txt, with full page content in Markdown. Check at `https://yourdomain.com/llms-full.txt`.

If you run a docs site, an API reference, or a knowledge base, this file is worth thinking about. For most marketing sites, the standard LLMs.txt is plenty.

## 5. Check everything at once

You can do the four checks above manually. Or you can use the [LLMs.txt Checker](/tools/llms-txt-checker). Drop in your domain. It checks all of it in one pass:

- LLMs.txt exists and is structured properly
- LLMs-full.txt exists (if present)
- Sitemap is reachable
- Each AI crawler's access status
- Link health inside your LLMs.txt

It gives you a readiness score and a list of specific things to fix. No signup required.

## What this tells you (and what it does not)

None of this guarantees your site will show up in AI search results. It does not guarantee citations or traffic. What it does is remove the dumb obstacles: blocked crawlers, missing files, broken links. If your site cannot be read by the systems that might surface it, nothing else you do matters.

Checking these five things takes under five minutes. It is the cheapest thing you can do to prepare for a world where AI-mediated search keeps growing.

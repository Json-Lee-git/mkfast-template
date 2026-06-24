---
title: GPTBot and AI Crawler Access Guide — Robots.txt Rules for ChatGPT, Claude, Perplexity
description: How to check and control AI crawler access to your site. GPTBot, ClaudeBot, PerplexityBot robots.txt rules, and how to allow or block AI bots.
date: 2026-06-24
category: Guides
image: https://ai-search-readiness.s01071233604.workers.dev/og.png
---

AI crawlers are not the same as search engine crawlers. They do different things, they behave differently, and your robots.txt rules affect them differently. If you manage a website, you should know which AI bots are visiting and what you are telling them.

## Which AI crawlers exist

Here are the main ones you will encounter:

| Crawler | Company | What it does |
|---------|---------|-------------|
| GPTBot | OpenAI | Crawls the web for ChatGPT training and responses |
| OAI-SearchBot | OpenAI | Used for ChatGPT search and browsing features |
| ChatGPT-User | OpenAI | Fires when a ChatGPT user asks for a specific URL |
| ClaudeBot | Anthropic | Crawls for Claude training and responses |
| Claude-SearchBot | Anthropic | Used for Claude search features |
| PerplexityBot | Perplexity | Crawls for Perplexity AI search |
| Perplexity-User | Perplexity | Fires on user-requested page fetches |
| Google-Extended | Google | Controls whether your content is used for Google AI training and Gemini |

None of these is Googlebot. None of them affects your search rankings directly. They read your site to train models, answer questions, or surface your content in AI responses.

## How to check if they can access your site

Open your `robots.txt` file at `https://yoursite.com/robots.txt`. Look for rules that mention these user agents. A rule like this blocks GPTBot from reading anything:

```
User-agent: GPTBot
Disallow: /
```

A rule like this allows it:

```
User-agent: GPTBot
Allow: /
```

Many sites block AI crawlers without realizing it. A common pattern is to set `Disallow: /` for all crawlers, then add exceptions for Googlebot and Bingbot. That blocks AI crawlers too because they are not Google or Bing.

## Should you allow or block AI crawlers

There is no single right answer. It depends on what you want.

You might want to allow AI crawlers if you want your content to appear in ChatGPT, Claude, or Perplexity responses. You cannot control when or how your content is cited, but if your site is unreadable, it cannot be cited at all.

You might want to block AI crawlers if you are concerned about your content being used to train AI models. Some publishers block AI crawlers as a matter of policy. Others block certain crawlers but not others.

There are tradeoffs either way. The important thing is that you make a conscious choice instead of inheriting whatever your robots.txt defaults to.

## How to allow specific AI crawlers

Add explicit rules for each crawler you want to allow:

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```

Put these above any wildcard `Disallow: /` rule. Robots.txt applies the most specific rule, so explicit allows for named user agents override a blanket disallow for `*`.

## How to block specific AI crawlers

The reverse works the same way:

```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /
```

You can block some and allow others. It is not all or nothing.

## Check your current setup

Instead of reading your robots.txt manually and trying to figure out which rules apply to which AI crawler, use the [LLMs.txt Checker](/tools/llms-txt-checker). It scans your robots.txt and shows you at a glance which AI crawlers can access your site and which are blocked.

The checker also verifies your LLMs.txt, sitemap, and LLMs-full.txt in the same report. One check covers everything.

## What happens if you do nothing

If you have a standard robots.txt that allows `*`, most AI crawlers are allowed by default. But not all of them respect robots.txt equally, and some may have additional requirements or preferences.

The bigger risk is accidentally blocking AI crawlers through an overly broad `Disallow` rule. If your robots.txt was written primarily with Google in mind, there is a good chance AI crawlers are more restricted than you think.

## A quick rule of thumb

If you publish content and want it to be discoverable, allow AI crawlers. If your content is behind a paywall or you have specific reasons to restrict access, block them. In both cases, check your actual robots.txt to make sure it says what you think it says.

If you want AI crawlers to read your site, you need to know which ones are out there and what your robots.txt actually tells them. Most site owners never check either. The [LLMs.txt Checker](/tools/llms-txt-checker) shows you the full picture in under a minute. It checks robots.txt, LLMs.txt, sitemap, and crawler access in one pass.

## More from our blog

If you found this useful, you might also want the [LLMs.txt best practices guide](/blog/llms-txt-best-practices) for format and template advice tool_tips. The [step-by-step creation guide](/blog/create-llms-txt-step-by-step) covers building your first file end to end. And the [LLMs.txt vs robots.txt vs sitemap comparison](/blog/llms-txt-vs-robots-vs-sitemap) explains how the three files fit together.

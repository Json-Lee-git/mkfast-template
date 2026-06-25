---
title: GPTBot
description: OpenAI's web crawler used for training ChatGPT models and retrieving web content for ChatGPT responses and browsing features.
---

**GPTBot** is OpenAI's primary web crawler. It reads web pages to train ChatGPT models and to retrieve web content when ChatGPT users ask questions that require current information.

## Robots.txt control

```
User-agent: GPTBot
Allow: /

# Or to block:
User-agent: GPTBot
Disallow: /
```

OpenAI also operates **OAI-SearchBot** (for ChatGPT search) and **ChatGPT-User** (for real-time user-initiated page fetches).

## See also

- [ClaudeBot](/glossary/claudebot)
- [PerplexityBot](/glossary/perplexitybot)
- [AI Crawler](/glossary/ai-crawler)

---
title: Google-Extended
description: A Google-specific user agent token that controls whether your site's content can be used for Google's AI training, including Gemini and Bard.
---

**Google-Extended** is a user agent token in robots.txt that controls whether Google can use your site's content for training AI models like Gemini and Bard. It does not affect whether your pages appear in Google Search results.

## Control

```
# Allow Google AI training use:
User-agent: Google-Extended
Allow: /

# Block Google AI training use:
User-agent: Google-Extended
Disallow: /
```

Unlike GPTBot and ClaudeBot, Google-Extended only controls AI training use, not search or browsing features.

## See also

- [GPTBot](/glossary/gptbot)
- [robots.txt](/glossary/robots-txt)

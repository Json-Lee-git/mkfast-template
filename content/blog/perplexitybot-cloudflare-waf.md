---
title: PerplexityBot and Cloudflare WAF - How to Avoid Blocking AI Search Crawlers
description: Cloudflare and WAF rules can block AI crawlers even when robots.txt allows them. Learn how to check PerplexityBot, Perplexity-User, and other AI crawler access safely.
date: 2026-07-04
updated: 2026-07-04
category: Guides
author: AI Search Readiness Editorial Team
authorTitle: Technical SEO and AI search readiness research
reviewedBy: AI Search Readiness Editorial Team
image: https://aeocheck.xyz/og.png
---

A correct robots.txt file does not guarantee that AI search crawlers can fetch your pages. Cloudflare, bot protection, managed challenges, rate limits, and custom WAF rules can still block or challenge crawlers before they reach your HTML.

This matters for Perplexity because Perplexity documents crawler and user-triggered access patterns, including `PerplexityBot` and `Perplexity-User`. If your public pages are meant to be discoverable, you need to check both robots.txt and your edge security layer.

## The two-layer access problem

| Layer | What it controls | Common failure |
|---|---|---|
| `robots.txt` | Instructions for well-behaved crawlers | Broad `Disallow: /` blocks public pages |
| CDN/WAF | Network access before the page loads | Bot fight mode, challenge, block, or rate limit prevents fetches |

AI crawler readiness requires both layers to match your policy. A robots.txt allow rule is not useful if the WAF blocks the request.

## Perplexity user agents to know

Perplexity documents crawler behavior and user-agent identifiers. The names site owners commonly review include:

- `PerplexityBot`
- `Perplexity-User`

Treat these as separate signals. A general crawler and a user-triggered fetch may deserve different policies, depending on your content and legal requirements.

Always confirm current tokens and guidance in Perplexity's own documentation before changing production rules.

## Symptoms of WAF blocking

You may have a WAF or CDN block if:

- Robots.txt allows the crawler, but logs show 403 responses.
- The crawler receives a challenge page instead of the real HTML.
- Security events show bot-management actions for AI crawler user agents.
- Important public pages return different responses for different user agents.
- Your checker reports access problems even though robots.txt looks correct.

For Cloudflare sites, review Security Events, WAF custom rules, bot protection, rate limiting, and any rule that targets unknown bots or unusual user agents.

## What to check in robots.txt

Open:

```txt
https://yourdomain.com/robots.txt
```

Look for rules like:

```txt
User-agent: PerplexityBot
Disallow: /

User-agent: *
Disallow: /
```

If your policy is to allow public discovery, make sure public pages are not blocked by a crawler-specific rule or wildcard group.

A minimal public-site pattern looks like this:

```txt
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /account/

Sitemap: https://example.com/sitemap.xml
```

You can add explicit crawler groups when you need a clearer policy, but avoid unnecessary duplication that future maintainers may forget to update.

## What to check in Cloudflare

Use this sequence:

1. Open Security Events and filter by path, host, and user agent.
2. Search for `PerplexityBot` and `Perplexity-User`.
3. Look for block, challenge, JS challenge, managed challenge, rate limit, or custom rule actions.
4. Check whether the affected URLs are public pages, private paths, or suspicious traffic.
5. Adjust rules only for the public paths and user agents you intentionally allow.

Do not disable security globally just to allow one crawler. Keep private areas, APIs, account pages, checkout flows, and admin routes protected.

## Safer allowlisting principles

If you decide to allow a crawler through a WAF:

- Limit the rule to public paths where possible.
- Keep sensitive paths blocked regardless of user agent.
- Prefer documented user-agent tokens and official IP guidance when available.
- Monitor logs after changing the rule.
- Revisit the policy when platform documentation changes.

A crawler allow rule should be narrow enough that it does not become a security bypass.

## Do not confuse access with citation

Allowing PerplexityBot or Perplexity-User does not guarantee Perplexity citations. It only means you are not blocking one access path. Perplexity and other AI search systems still decide which sources to use based on relevance, freshness, authority, extractability, and their own retrieval systems.

Use crawler access checks as the first step, not the whole AI search strategy.

## Practical checklist

For each important public URL:

- The URL returns `200` HTML.
- The canonical URL is correct.
- The page is included in the sitemap.
- Robots.txt does not block public content.
- Cloudflare or another WAF does not block documented AI crawler user agents.
- The page has clear headings, direct answers, and visible trust signals.
- The site has references, methodology, about, contact, privacy, and terms pages.

Run the [AI Crawler Checker](/tools/ai-crawler-checker) first, then run the broader [AEO Checker](/tools/aeo-checker) for schema, sitemap, and answer-ready content checks.

## Sources and further reading

- [Perplexity: Crawlers](https://docs.perplexity.ai/guides/bots)
- [Cloudflare: WAF custom rules](https://developers.cloudflare.com/waf/custom-rules/)
- [Google Search Central: Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [AI Crawler Checker](/tools/ai-crawler-checker)
- [AI Search Readiness methodology](/methodology)

## Frequently asked questions

### Can Cloudflare block PerplexityBot even if robots.txt allows it?

Yes. Robots.txt gives crawler instructions, while Cloudflare can block, challenge, or rate-limit requests at the network layer. Check Cloudflare Security Events if crawler access does not match your robots.txt policy.

### Should I allow PerplexityBot?

Allow it on public pages if you want Perplexity to be able to access that content and your content policy permits it. Block it from private, paid, sensitive, or operational paths.

### What is the difference between PerplexityBot and Perplexity-User?

They represent different Perplexity access patterns. Review Perplexity's current documentation before making policy decisions, and avoid treating every AI user agent as identical.

### Should I disable bot protection to improve AI search visibility?

No. Do not weaken site security globally. If you allow an AI crawler, use narrow rules that apply only to intended public pages and keep sensitive areas protected.

### Does allowing PerplexityBot guarantee citations?

No. Access is only one prerequisite. Citation decisions depend on relevance, source quality, freshness, authority, and Perplexity's retrieval behavior.

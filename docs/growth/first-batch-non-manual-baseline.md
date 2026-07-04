# First Batch Non-Manual Baseline

Date: 2026-07-04
Production base: https://aeocheck.xyz
Cloudflare Worker version deployed before this check: `18c2634e-49cc-46b5-8a56-91dfaeba8205`
Related code commit: `29736ef Add AI crawler growth content`

## Scope

This file records growth work that can be completed without account login, manual posting, paid-order testing, dashboard access, or operator judgment.

Completed automatically:

- Production SEO funnel smoke check.
- Public URL status checks for first-batch target pages.
- Canonical URL checks for first-batch target pages.
- Robots meta noindex checks for first-batch target pages.
- Sitemap inclusion checks for the three new blog URLs.
- Robots.txt sitemap and AI crawler mention checks.

Not completed automatically:

- Google Search Console sitemap submission.
- Google URL Inspection and Request indexing.
- LinkedIn, Reddit, Hacker News, Product Hunt, directory, or outreach submissions.
- Analytics review for visits, tool starts, comments, replies, or backlinks.

## Production Smoke Result

Command:

```bash
pnpm run smoke:seo-funnel -- --base=https://aeocheck.xyz --canonical-base=https://aeocheck.xyz
```

Result: 25/25 checks passed.

Covered highlights:

- `/ai-search-audit` returned 200, had expected content, and was indexable.
- `/sample-aeo-report` returned 200, had expected content, and was indexable.
- `/blog/ai-search-readiness-audit` returned 200, had expected content, and was indexable.
- `/methodology` returned 200, had expected content, and was indexable.
- `/ai-search-audit/thanks` returned 200 and kept `noindex`.
- `/robots.txt` returned 200, exposed the sitemap, did not block `/pricing`, did not block `/ai-search-audit`, and blocked `/admin`.
- `/sitemap.xml` returned 200, included the manual audit, sample report, and audit blog URLs, and excluded the thanks page.

## First-Batch URL Baseline

| URL | Status | Canonical | Robots noindex | Notes |
| --- | --- | --- | --- | --- |
| `https://aeocheck.xyz/` | 200 | `https://aeocheck.xyz/` | No | Homepage growth positioning live. |
| `https://aeocheck.xyz/tools/aeo-checker` | 200 | `https://aeocheck.xyz/tools/aeo-checker` | No | Primary CTA for community posts and consultant outreach. |
| `https://aeocheck.xyz/tools/ai-crawler-checker` | 200 | `https://aeocheck.xyz/tools/ai-crawler-checker` | No | Supports GPTBot, OAI-SearchBot, PerplexityBot angle. |
| `https://aeocheck.xyz/tools/robots-txt-ai-crawler-checker` | 200 | `https://aeocheck.xyz/tools/robots-txt-ai-crawler-checker` | No | Supports robots.txt crawler access angle. |
| `https://aeocheck.xyz/tools/llms-txt-checker` | 200 | `https://aeocheck.xyz/tools/llms-txt-checker` | No | Supports LLMs.txt validation angle. |
| `https://aeocheck.xyz/tools/llms-txt-generator` | 200 | `https://aeocheck.xyz/tools/llms-txt-generator` | No | Supports LLMs.txt creation angle. |
| `https://aeocheck.xyz/guides/llms-txt-seo` | 200 | `https://aeocheck.xyz/guides/llms-txt-seo` | No | Supports education/syndication angle. |
| `https://aeocheck.xyz/methodology` | 200 | `https://aeocheck.xyz/methodology` | No | Supports skeptical/technical audiences. |
| `https://aeocheck.xyz/references` | 200 | `https://aeocheck.xyz/references` | No | Supports source-backed claims. |
| `https://aeocheck.xyz/blog/gptbot-vs-oai-searchbot` | 200 | `https://aeocheck.xyz/blog/gptbot-vs-oai-searchbot` | No | New blog URL verified live. |
| `https://aeocheck.xyz/blog/perplexitybot-cloudflare-waf` | 200 | `https://aeocheck.xyz/blog/perplexitybot-cloudflare-waf` | No | New blog URL verified live. |
| `https://aeocheck.xyz/blog/llms-txt-google-ai-overviews` | 200 | `https://aeocheck.xyz/blog/llms-txt-google-ai-overviews` | No | New blog URL verified live. |

## Sitemap And Robots Baseline

Sitemap checks:

- `https://aeocheck.xyz/sitemap.xml` contains `gptbot-vs-oai-searchbot`.
- `https://aeocheck.xyz/sitemap.xml` contains `perplexitybot-cloudflare-waf`.
- `https://aeocheck.xyz/sitemap.xml` contains `llms-txt-google-ai-overviews`.

Robots checks:

- `https://aeocheck.xyz/robots.txt` contains `Sitemap: https://aeocheck.xyz/sitemap.xml`.
- `https://aeocheck.xyz/robots.txt` mentions `GPTBot`.
- `https://aeocheck.xyz/robots.txt` mentions `OAI-SearchBot`.
- `https://aeocheck.xyz/robots.txt` mentions `PerplexityBot`.

## Ready For Manual Execution

Use `first-batch-channel-tracker.md` for account-based execution. The recommended next manual sequence is:

1. Submit `https://aeocheck.xyz/sitemap.xml` in Google Search Console.
2. Request indexing for the three new blog URLs.
3. Publish the LinkedIn short post.
4. Post the Reddit r/SEO feedback request if subreddit rules allow it.
5. Submit the Hacker News Show HN draft.
6. Submit five P1 directory listings.

Record manual outcomes in `first-batch-channel-tracker.md` using the existing status and result fields.

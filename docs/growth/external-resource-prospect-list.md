# External Resource Prospect List

Purpose: prepare non-login research for the first external resource and directory batch. This file does not authorize submission. It records where AEOCheck may fit, what evidence was checked, and what to do when account access is available.

Decision: prioritize GitHub awesome/resource lists and highly relevant tool directories before broad AI directories.

Why: AEOCheck is currently getting early Google impressions for tool-intent queries. The best next external work is to create relevant, inspectable mentions around technical SEO, AI search readiness, crawler access, and AEO/GEO. GitHub resource lists are usually more transparent than generic AI directories because the contribution mechanism is public and the edit can be reviewed.

## Source Classes

- Primary: target site submission page, repository README, repository CONTRIBUTING file, or owner-maintained docs.
- Owner-adjacent: official GitHub repository metadata or maintained website category page.
- Discovery: search result or third-party list used only to find candidates.
- Secondary: blog posts, old roundups, or unverifiable claims.

## First Batch Candidates

| Priority | Candidate | URL | Source checked | Source class | Fit | Submission route | Recommended target page | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | SerpApi Awesome SEO Tools | https://github.com/serpapi/awesome-seo-tools | README says open PR or issue; Technical SEO and Validator/Checker sections exist. | Primary | Strong | GitHub PR or issue | https://aeocheck.xyz/tools/aeo-checker | Prepared | Best first GitHub target. Add under Technical SEO or Validator / Checker with conservative wording. |
| P0 | Awesome AI Tools by mahseema | https://github.com/mahseema/awesome-ai-tools | README says PRs are free and also points to altern.ai submission. Marketing AI Tools section exists. | Primary | Good | GitHub PR; optional altern.ai submission | https://aeocheck.xyz/tools/aeo-checker | Prepared | Use AI marketing / SEO utility angle. Avoid broad AI hype wording. |
| P1 | AI Collection | https://github.com/ai-collection/ai-collection | CONTRIBUTING says submissions must go through https://www.thataicollection.com/submit. | Primary | Good | Self-service submit page | https://aeocheck.xyz/tools/aeo-checker | Prepared | Relevant category likely Content Generation & SEO or SEO & Keyword Research. Needs manual submit. |
| P1 | Product Hunt | https://www.producthunt.com/ | Product Hunt new post page requires login; categories include Marketing & Sales and Engineering & Development. | Primary | Good | Login launch workflow | https://aeocheck.xyz/ | Prepared | Delay until there is a coordinated launch day. Do not burn early launch while manual operations are unavailable. |
| P1 | Hacker News Show HN | https://news.ycombinator.com/submit | Public submit endpoint exists; requires account at action time. | Primary | Good | Manual Show HN submit | https://aeocheck.xyz/tools/aeo-checker | Prepared | Use feedback angle; best for technical critique, not guaranteed traffic. |
| P2 | Futurepedia | https://www.futurepedia.io/submit-tool | Submit page shows paid listing options; basic listing was marked sold out when checked. | Primary | Weak now | Paid submission only when ROI is clear | https://aeocheck.xyz/ | Deferred | Not first batch because it is paid and not obviously better than free resource-list options. |
| P2 | There Is An AI For That | https://theresanaiforthat.com/ | Submit page returned 403 to fetcher; evidence incomplete. | Unknown | Possible | Manual browser check later | https://aeocheck.xyz/ | Deferred | Cannot verify submission details without browser/manual access. Keep as later manual check. |
| P2 | AlternativeTo | https://alternativeto.net/ | Known software directory, but submission details not verified in this pass. | Discovery | Possible | Manual verification needed | https://aeocheck.xyz/tools/aeo-checker | Prepared | Useful only if AEOCheck can be positioned as a software alternative without awkward category mismatch. |
| P2 | SaaSHub | https://www.saashub.com/ | Known software directory, but submission details not verified in this pass. | Discovery | Possible | Manual verification needed | https://aeocheck.xyz/ | Prepared | Check whether free listing exists before using. |
| P3 | Broad AI tool directories | Various | Generic AI directory search produced noisy results and many paid/low-relevance options. | Discovery | Weak | Do not batch-submit blindly | https://aeocheck.xyz/ | Skip first batch | Low signal until a specific directory shows category relevance and free/clear submission terms. |

## Ready-To-Use GitHub Entries

### SerpApi Awesome SEO Tools

Target section: `Technical SEO` or `Validator / Checker`

```md
- [AEOCheck](https://aeocheck.xyz/tools/aeo-checker) - Free technical AEO checker for AI crawler access, robots.txt, LLMs.txt, sitemap discovery, structured data, and answer-ready page signals.
```

Issue/PR note:

```text
Suggest adding AEOCheck as a technical SEO / AEO checker. It is a free readiness checker for AI crawler access, robots.txt, LLMs.txt, sitemap discovery, structured data, and answer-ready page signals. It does not claim to guarantee rankings, traffic, AI Overview inclusion, or AI citations.
```

### Awesome AI Tools By Mahseema

Target section: `Marketing AI Tools` or another SEO/content section if closer after manual review.

```md
- [AEOCheck](https://aeocheck.xyz/tools/aeo-checker) - Free AI search readiness checker for auditing AI crawler access, LLMs.txt discovery, structured data, sitemap discovery, and answer-ready page structure.
```

Issue/PR note:

```text
Suggest adding AEOCheck as an AI marketing / SEO utility. It helps teams check whether public pages expose practical readiness signals for AI search and answer engines, including AI crawler access, LLMs.txt, structured data, sitemap discovery, entity clarity, and answer-ready structure.
```

### AI Collection

Use submit page: https://www.thataicollection.com/submit

Suggested category:

```text
Content Generation & SEO
```

Short description:

```text
AEOCheck is a free technical AI search readiness checker for auditing AI crawler access, LLMs.txt discovery, structured data, sitemap discovery, and answer-ready page structure.
```

Long description:

```text
AEOCheck helps SaaS, AI tool, B2B, marketing, and SEO teams inspect whether public pages expose the technical and editorial signals that AI-assisted discovery systems can use. The free tools check robots.txt, AI crawler access, sitemap discovery, LLMs.txt and LLMs-full.txt availability, structured data, headings, direct answers, entity clarity, and visible trust signals. It checks readiness signals and recommendations; it does not guarantee rankings, traffic, AI Overview inclusion, or AI citations.
```

## First Manual Sequence

1. Open SerpApi Awesome SEO Tools and check whether AEOCheck already exists.
2. If absent, prepare a one-line PR under `Technical SEO` or `Validator / Checker`.
3. Open Awesome AI Tools by mahseema and check whether AEOCheck already exists.
4. If absent, prepare a one-line PR under the closest marketing/SEO section.
5. Submit AI Collection only after confirming the form does not require paid placement.
6. Keep Product Hunt for a coordinated launch day.
7. Keep Futurepedia deferred because the checked submit page was paid.

## Reject Rules

Skip a channel if:

- It requires payment before editorial review.
- It has no visible category related to SEO, AI search, AEO/GEO, marketing, webmaster tools, or developer website tooling.
- It requires exaggerated AI visibility claims.
- It is a scraped directory with no clear submission quality bar.
- It requires broad account permissions, browser extensions, or API keys just to submit.

## Follow-Up Fields

```text
Date checked:
Candidate:
Already listed? yes/no
Submission route:
Action taken:
Submitted URL / PR / issue:
Status:
Result:
Notes:
```

# GEO Monitor Template

Use this template to manually check whether AEOCheck appears in AI-assisted discovery answers and what sources or competitors those engines use instead.

## Cadence

Run this weekly for core questions and after publishing a new BOFU page, comparison page, or external distribution post. Keep prompts consistent so changes are easier to compare over time.

## Engines To Check

- ChatGPT
- Perplexity
- Gemini
- Claude
- DeepSeek
- Google AI results when available

## Seed Question Set

- What are the best tools to check if a website is ready for AI search?
- What should be included in an AI search readiness audit?
- How do I check whether AI crawlers can access my website?
- Which AEO checker should a SaaS team use before buying a manual audit?
- What are the best GEO audit tools for B2B SaaS websites?
- How do I prepare a product page for ChatGPT and Perplexity discovery?
- What is the difference between a traditional SEO audit and an AI search readiness audit?
- Which tools can find answer engine optimization gaps?
- Do I need llms.txt for AI search visibility?
- How can SEO consultants audit websites for AI search readiness?

## Results Table

| Date | Question | Engine | AEOCheck mentioned? | Position / wording | Competitors mentioned | Cited URLs | Reason included or excluded | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | What should be included in an AI search readiness audit? | Perplexity | No | N/A | [competitors] | [URLs] | Missing page with exact checklist framing | Publish or update checklist page |
| YYYY-MM-DD | What are the best GEO audit tools for B2B SaaS websites? | ChatGPT | No | N/A | [competitors] | [URLs if provided] | Competitors have stronger comparison pages | Improve `/compare/geo-audit-tools` and add external mentions |

## Scoring Heuristic

Use this only as an internal trend signal, not as a public claim.

- Strong: AEOCheck appears with accurate positioning and a relevant URL.
- Partial: AEOCheck appears but the description, URL, or category is weak.
- Missing: AEOCheck does not appear while competitors or generic advice dominate.
- Problematic: AEOCheck appears with inaccurate claims, wrong URLs, or confusing category placement.

## Follow-Up Actions

- If AEOCheck is missing, identify whether the gap is page coverage, external mentions, weak entity clarity, or lack of proof assets.
- If competitors dominate, record which page types and sources engines cite.
- If wording is inaccurate, update the entity sheet, website copy, and external profile copy for consistency.
- If a question maps to a BOFU target, add it to `docs/growth/acquisition-targets.json` so future generated assets include it.

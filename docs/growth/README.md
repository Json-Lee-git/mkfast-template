# Growth Asset Generator

This folder contains local acquisition inputs and generated growth assets for AEOCheck.

## Run

```bash
pnpm run growth:assets
```

The command reads `docs/growth/acquisition-targets.json` and writes markdown files to `docs/growth/generated/`.

## Edit Inputs

Add or update entries in `acquisition-targets.json`:

- `keyword`: target query or campaign angle
- `intent`: why the searcher or prospect cares
- `funnel`: `BOFU`, `MOFU`, or `TOFU`
- `pageType`: compare page, blog guide, tool page, distribution post, etc.
- `targetUrl`: the canonical on-site URL this asset supports
- `audience`: optional target reader or prospect segment
- `painPoint`: optional concrete pain for positioning
- `relatedUrls`: optional internal links to include

## Use The Output

Each generated file includes:

- BOFU page brief
- Mini audit checklist
- External distribution drafts
- Outreach templates
- Internal links
- GEO questions to monitor
- Daily growth log

Generated copy is a starting point. Keep public posts specific, cite real observations, and avoid claims that rankings, AI citations, traffic, or revenue are guaranteed.

## Manual Execution Assets

Use these files when preparing or running the first marketing push:

- `today-queue.md`: the first-hour checklist for preparing posts, directory rows, and outreach.
- `marketing-execution-pack.md`: the 7-day plan, community drafts, outreach templates, and tracking table.
- `first-batch-channel-tracker.md`: the first batch of prepared channels, target links, asset choices, and status fields.
- `external-resource-prospect-list.md`: researched external resource, GitHub awesome list, and directory candidates with submit/adapt/skip judgments.
- `github-pr-prep/`: prepared patch files, PR titles, PR bodies, and manual execution steps for GitHub resource-list submissions.
- `first-batch-non-manual-baseline.md`: completed public URL, canonical, noindex, sitemap, robots, and production smoke checks for the first growth batch.
- `SUBMISSION-ASSETS.md`: directory, launch, resource-list, and product submission copy blocks.
- `manual-clipboard-queue.md`: copy/paste queue for GSC indexing, LinkedIn, Reddit, Hacker News, Product Hunt, directories, and outreach.
- `copy-snippets.md`: short one-liners, directory descriptions, social hooks, replies, and disclaimer copy.
- `outreach-prospecting-template.md`: prospect segments, search queries, scoring rules, outreach table, message variants, and objection handling.

## Brand Entity Source

Use `aeocheck-entity-sheet.md` as the source of truth for consistent AEOCheck wording across website copy, directory submissions, external posts, outreach, and GEO monitoring notes.

## GEO Monitoring

Use `geo-monitor-template.md` weekly or after publishing a new BOFU page, comparison page, or external distribution post. Add useful questions back into `acquisition-targets.json` so future generated assets include the same monitoring set.

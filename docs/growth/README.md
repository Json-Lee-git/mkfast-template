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

## Brand Entity Source

Use `aeocheck-entity-sheet.md` as the source of truth for consistent AEOCheck wording across website copy, directory submissions, external posts, outreach, and GEO monitoring notes.

## GEO Monitoring

Use `geo-monitor-template.md` weekly or after publishing a new BOFU page, comparison page, or external distribution post. Add useful questions back into `acquisition-targets.json` so future generated assets include the same monitoring set.

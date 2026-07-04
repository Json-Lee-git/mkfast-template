# GitHub PR Prep For AEOCheck Resource Lists

Purpose: prepare GitHub resource-list submissions without logging in, forking, or opening PRs from this environment.

Do not submit automatically. When account access is available, manually review the target repository rules and then apply the matching patch.

## Prepared Patches

- `serpapi-awesome-seo-tools-aeocheck.patch`
- `mahseema-awesome-ai-tools-aeocheck.patch`

## Target 1: SerpApi Awesome SEO Tools

Repository:
https://github.com/serpapi/awesome-seo-tools

Why it fits:
The repository has a `Validator / Checker` section and says suggestions can be added via PR or issue. AEOCheck fits as a technical AEO / AI search readiness checker for crawler access, robots.txt, LLMs.txt, sitemap discovery, structured data, and answer-ready page signals.

Recommended section:
`Validator / Checker`

PR title:

```text
Add AEOCheck to Validator / Checker tools
```

PR body:

```text
Adds AEOCheck as a free technical AEO / AI search readiness checker.

It checks AI crawler access, robots.txt, LLMs.txt, sitemap discovery, structured data, and answer-ready page signals. The description is intentionally conservative and does not claim rankings, traffic, AI Overview inclusion, or AI citations are guaranteed.
```

Patch:

```bash
git apply serpapi-awesome-seo-tools-aeocheck.patch
```

Manual fallback entry:

```md
- [AEOCheck](https://aeocheck.xyz/tools/aeo-checker) - Free technical AEO checker for AI crawler access, robots.txt, LLMs.txt, sitemap discovery, structured data, and answer-ready page signals.
```

## Target 2: Awesome AI Tools By Mahseema

Repository:
https://github.com/mahseema/awesome-ai-tools

Why it fits:
The README says PRs are free and includes a `Marketing AI Tools` section. AEOCheck fits as an AI marketing / SEO utility, especially near SEO content optimization tools.

Recommended section:
`Marketing AI Tools`

PR title:

```text
Add AEOCheck to Marketing AI Tools
```

PR body:

```text
Adds AEOCheck as a free AI search readiness checker for marketing and SEO teams.

It audits AI crawler access, LLMs.txt discovery, structured data, sitemap discovery, and answer-ready page structure. The description avoids visibility guarantees and frames the tool as a readiness checker.
```

Patch:

```bash
git apply mahseema-awesome-ai-tools-aeocheck.patch
```

Manual fallback entry:

```md
- **[AEOCheck](https://aeocheck.xyz/tools/aeo-checker)** - Free AI search readiness checker for auditing AI crawler access, LLMs.txt discovery, structured data, sitemap discovery, and answer-ready page structure.
```

## Manual Execution Steps

1. Open the target repository.
2. Search the repo for `AEOCheck` and `aeocheck.xyz` to avoid duplicate entries.
3. Fork the repository.
4. Create a short branch, for example `add-aeocheck`.
5. Apply the patch or manually add the entry in the recommended section.
6. Confirm only `README.md` changed.
7. Commit with one of these messages:

```text
Add AEOCheck
```

```text
Add AEOCheck to tool list
```

8. Open a PR using the prepared title and body.
9. Record the PR URL in `docs/growth/external-resource-prospect-list.md` and `docs/growth/first-batch-channel-tracker.md`.

## Review Before Submitting

Check:

- The repo has not changed section names or formatting.
- AEOCheck is not already listed.
- The target section still matches the tool.
- The wording remains conservative.
- No affiliate, tracking, or UTM parameters are added.
- No ranking, traffic, AI Overview, or AI citation guarantees are implied.

## If A Maintainer Pushes Back

Use this reply:

```text
Thanks for reviewing. I understand if it is not a fit for the list.

The intent is to list AEOCheck only as a free readiness checker for technical SEO / AI search signals, not as a ranking or visibility guarantee. If a narrower description or a different section would fit better, happy to adjust.
```

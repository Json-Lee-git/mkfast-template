# OPUS_HANDOFF.md

This document is the handoff brief for a stronger AI coding agent taking broad technical supervision of this repository.

## Project Identity

- Production site: `https://aeocheck.xyz`
- Product name: AEOCheck / AI Search Readiness
- Repository directory may still be named `mkfast-template`; do not treat this as a generic template project.
- Stack: TanStack Start, React 19, Cloudflare Workers, Cloudflare D1, Drizzle ORM, Better Auth, Creem payments, Resend email, Workers AI, Content Collections.

Read these files first:

1. `OPUS_HANDOFF.md` - current supervision context and priorities.
2. `AGENTS.md` - coding-agent repository guidance.
3. `CLAUDE.md` - Claude Code guidance, largely mirrors `AGENTS.md`.
4. `README.md` - public project overview.
5. `package.json` - scripts and dependencies.
6. `wrangler.jsonc` - Cloudflare Worker bindings and deployment config.

## Current Business Priorities

The project is in an early growth and validation phase. The current priority is marketing, search visibility, and conversion groundwork, not broad engineering expansion.

Primary priorities:

- Grow free-tool SEO/GEO traffic.
- Strengthen `llms.txt checker` and `llms.txt validator` demand capture.
- Improve AI crawler / AI search readiness content cluster.
- Preserve and monitor the Manual AI Search Readiness Audit paid flow.
- Keep production stable while making narrow, high-confidence improvements.

Avoid introducing broad product rewrites, new paid-plan architecture, or automatic report generation unless explicitly requested by the owner.

## Current Product Surface

Important public pages and routes include:

- `/tools/aeo-checker`
- `/tools/llms-txt-checker`
- `/tools/llms-txt-generator`
- `/tools/query-fan-out-tool`
- `/ai-search-audit`
- `/ai-search-audit/thanks`
- `/guides/ai-search-readiness-checklist`
- `/sample-aeo-report`
- `/methodology`
- `/references`
- `/press`
- `/llms.txt`
- `/llms-full.txt`

Content lives mainly in:

- `content/blog/`
- `content/glossary/`
- `content/pages/`
- `content/changelog/`

Blog frontmatter normally requires:

- `title`
- `description`
- `date`
- `category`
- `image`

## Manual Audit Status

Manual AI Search Readiness Audit is a paid, human-delivered service.

Current operating model:

1. Customer buys audit.
2. Creem checkout/payment webhook records order.
3. Internal notification is sent.
4. A human prepares the report.
5. Admin enters the Report URL and delivery notes.
6. Resend sends the delivery email.
7. Order is marked `delivered` only after email send succeeds.

Important constraints:

- Payment success webhook should only create/update order state and internal notification.
- Do not add a shortcut endpoint to trigger production delivery outside the admin flow.
- Do not implement automatic report generation unless explicitly requested.
- Pending and checkout-failed orders must not be marked delivered.
- Already delivered orders should not be downgraded by later webhook events.
- URL inputs should generally avoid `type="url"`; backend normalization supports domain-only inputs and adds `https://`.

Known production setup:

- Worker name: `ai-search-readiness`
- Domain: `aeocheck.xyz` and `www.aeocheck.xyz`
- Resend sender: `AEOCheck <support@aeocheck.xyz>`
- Resend domain `aeocheck.xyz` has previously been verified.
- Required production secrets include Creem webhook secret, Resend API key/from email, and contact notification webhook.
- Do not expose, print, commit, or paste secrets.

## Recent Important Commits

Recent commits observed locally:

- `717a99e Strengthen llms.txt validator SEO`
- `a7dfcb3 Strengthen llms.txt checker internal SEO`
- `23306e6 Add AI crawler checker article`
- `3b9f812 Fix canonical redirects and blog markdown SSR`
- `9aedcfa Add first 50 growth prospect list`

Other historically important Manual Audit commits:

- `a6d6cf9 Add manual AI search audit checkout flow`
- `c3abd86 Add manual audit delivery tracking`
- `a47208f Improve manual AI search audit funnel`
- `a7c7929 Add SEO funnel smoke checks and audit tracking`
- `bbf8e1c Fix manual audit thanks route nesting`

Inspect actual git history before relying on this list as exhaustive.

## Verification Commands

Before claiming code is complete or production-ready, run the relevant checks.

Baseline local checks:

```bash
pnpm run check
pnpm exec tsc --noEmit
pnpm run build
```

SEO/public-route smoke checks:

```bash
pnpm run smoke:seo-funnel
pnpm run smoke:route-tree
```

Production smoke, when explicitly authorized:

```bash
pnpm run smoke:seo-funnel -- --base=https://aeocheck.xyz
```

Manual Audit related checks, when touching that flow:

```bash
pnpm run manual-audit:notification-payload
pnpm run manual-audit:smoke
```

Cloudflare deploy command:

```bash
pnpm run deploy
```

On Windows terminals, Cloudflare deployment output can contain special characters that render poorly. Redirect output to a log if necessary, then inspect exit code and log.

## Production Operations Policy

Default stance: code review and local validation are allowed; production mutation requires explicit owner approval.

Safe without extra approval:

- Read files.
- Inspect git status/log/diff.
- Run local checks/builds.
- Run local smoke scripts.
- Review implementation plans and PRs.
- Propose changes.
- Make scoped code/content edits in a working branch.

Ask before doing:

- `wrangler deploy`
- Remote D1 migrations or direct remote D1 writes.
- Editing production secrets.
- Triggering real payment, webhook, or email flows.
- Sending real Manual Audit delivery emails.
- Changing payment, webhook, auth, admin, or delivery semantics.
- Rewriting large architecture or replacing major libraries.

Never do:

- Commit `.env*` files or secrets.
- Print secrets in chat or logs.
- Run destructive git commands such as `git reset --hard` unless explicitly requested.
- Revert unrelated local changes without checking ownership.
- Change generated files manually, especially `src/routeTree.gen.ts`.

## Engineering Style

Use the existing architecture and repository conventions.

- Keep changes narrow and causally tied to the requested objective.
- Prefer existing provider patterns and local helpers.
- Avoid unrelated refactors.
- Treat Cloudflare Workers runtime constraints seriously; avoid Node-only APIs in worker code.
- Use `@/` imports for source imports.
- Follow Biome style: 2-space indent, single quotes, semicolons, 80-character target line width.
- For user-facing SEO/content work, preserve factual caveats. Do not promise AI Overview placement, ChatGPT citations, ranking guarantees, or traffic guarantees.

## Current SEO/Growth Context

Recent Google Search Console signals showed early impressions but no clicks yet, which is expected for a young site. The strongest near-term opportunity has been around `llms.txt checker` / `llms.txt validator`, where rankings appeared closer to click range than broader AEO terms.

Current SEO direction:

- Strengthen existing pages before creating many new ones.
- Use content clusters and internal links to support `/tools/llms-txt-checker`, `/tools/aeo-checker`, and AI crawler readiness content.
- Keep Manual Audit visible as a commercial conversion path.
- Maintain explicit methodology and caveats.
- Use primary sources where possible for crawler, robots, sitemap, canonical, and AI search claims.

Recent content work includes an AI crawler checker article at:

- `content/blog/ai-crawler-checker-chatgpt-perplexity.md`

Do not accidentally create a duplicate `content/blog/ai-crawler-checker.md` unless there is a deliberate routing/content decision.

## Suggested First Supervision Pass

For a full technical supervision handoff, start with this sequence:

1. Confirm the working tree is clean or identify uncommitted changes.
2. Read `AGENTS.md`, `CLAUDE.md`, `README.md`, `package.json`, `wrangler.jsonc`, and this file.
3. Run baseline checks: `pnpm run check`, `pnpm exec tsc --noEmit`, `pnpm run build`.
4. Inspect recent diffs and route/content changes around llms.txt, AI crawler, Manual Audit, and SEO funnel smoke scripts.
5. Review production-risk surfaces: payment webhooks, admin delivery, D1 migrations, Resend email, and notification provider behavior.
6. Produce a short findings report with severity-ranked risks, not a broad rewrite plan.
7. Only propose production changes after linking each recommendation to a concrete risk, opportunity, or observed failure.

## Handoff Notes For Another Device

To supervise this project from another machine:

1. Clone the full private repository.
2. Install the same package manager version: `pnpm@10.30.3`.
3. Run `pnpm install`.
4. Configure local Cloudflare/Wrangler authentication only if production observation or deploy is authorized.
5. Do not copy secrets through chat. Use secure environment configuration on that machine.
6. Start with read-only supervision and local validation. Escalate to deploy privileges only after trust and process are clear.

## Owner Preference

The owner wants direct, first-principles engineering work:

- Confirm objective and constraints.
- Make only necessary scoped changes.
- Avoid chaotic fixes, unrelated rewrites, and logically weak patches.
- Keep production safety visible.
- Prefer evidence from code, tests, logs, and primary sources over assumptions.

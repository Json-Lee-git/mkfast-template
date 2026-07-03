# GEO Growth Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the local growth asset system with an AEOCheck entity sheet, target-level GEO monitoring questions, and a manual GEO monitor template.

**Architecture:** Keep this as a lightweight documentation and generator extension. The JSON config owns target inputs, the TypeScript generator renders markdown assets, and standalone markdown files hold reusable brand/entity and monitoring templates.

**Tech Stack:** TypeScript, Node test runner, tsx, markdown, JSON.

## Global Constraints

- Do not add external dependencies.
- Do not claim guaranteed rankings, AI citations, traffic, revenue, or sales outcomes.
- Keep generated assets useful for both Google SEO and GEO.
- Preserve the existing command: `pnpm run growth:assets`.
- Do not modify production payment, webhook, database, or Cloudflare deployment logic.

---

### Task 1: Add GEO Questions To Generated Assets

**Files:**
- Modify: `scripts/lib/growth-asset-generator.ts`
- Modify: `scripts/lib/growth-asset-generator.test.ts`
- Modify: `docs/growth/acquisition-targets.json`
- Generated: `docs/growth/generated/*.md`

**Interfaces:**
- Consumes: `GrowthTarget` config objects from `docs/growth/acquisition-targets.json`
- Produces: `generateGrowthAssetMarkdown(target, options)` markdown containing `## GEO Questions To Monitor`

- [ ] **Step 1: Write the failing test**

Add a test asserting configured questions render and fallback questions exist when omitted.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test scripts/lib/growth-asset-generator.test.ts`
Expected: FAIL because `questions` is not part of the type/output yet.

- [ ] **Step 3: Implement minimal generator support**

Add `questions?: string[]` to `GrowthTarget`, create a fallback question list, and render a `## GEO Questions To Monitor` section before `## Daily Growth Log`.

- [ ] **Step 4: Add questions to existing targets**

Add 5 target-specific questions to each entry in `docs/growth/acquisition-targets.json`.

- [ ] **Step 5: Run test and regenerate assets**

Run:

```bash
pnpm exec tsx --test scripts/lib/growth-asset-generator.test.ts
pnpm run growth:assets
```

Expected: tests pass and generated markdown files include `## GEO Questions To Monitor`.

### Task 2: Add Brand Entity Sheet

**Files:**
- Create: `docs/growth/aeocheck-entity-sheet.md`
- Modify: `docs/growth/README.md`

**Interfaces:**
- Produces: reusable brand/entity facts for website copy, external distribution, and manual GEO monitoring.

- [ ] **Step 1: Create entity sheet**

Create a concise markdown sheet covering product identity, canonical URLs, category, audience, differentiators, limitations, proof assets, reusable one-liners, and claims to avoid.

- [ ] **Step 2: Link it from README**

Add a short section explaining that the entity sheet is the source of truth for consistent AEOCheck wording.

### Task 3: Add Manual GEO Monitor Template

**Files:**
- Create: `docs/growth/geo-monitor-template.md`
- Modify: `docs/growth/README.md`

**Interfaces:**
- Produces: a manual monitoring table for questions, engines, AEOCheck presence, competitors, cited URLs, reason, and next action.

- [ ] **Step 1: Create monitor template**

Create a markdown template with instructions, a seed question set, and a reusable results table.

- [ ] **Step 2: Link it from README**

Add a short usage section explaining weekly or campaign-based checks.

### Task 4: Verify Scope And Formatting

**Files:**
- Read-only verification across changed files.

**Interfaces:**
- Confirms the feature remains local growth tooling only.

- [ ] **Step 1: Run tests**

Run: `pnpm exec tsx --test scripts/lib/growth-asset-generator.test.ts`
Expected: 0 failures.

- [ ] **Step 2: Run generator**

Run: `pnpm run growth:assets`
Expected: generated markdown files updated successfully.

- [ ] **Step 3: Run project check**

Run: `pnpm run check`
Expected: exit code 0.

- [ ] **Step 4: Inspect diff scope**

Run: `git status --short` and `git diff --stat`
Expected: changes limited to growth docs, generator files, package script from prior work, and existing unrelated webhook/log changes left untouched.

## Self-Review

- Spec coverage: entity sheet, GEO questions, monitor template, docs, tests, and verification are covered.
- Placeholder scan: no TBD/TODO placeholders remain.
- Type consistency: `questions?: string[]` is owned by `GrowthTarget` and rendered by `generateGrowthAssetMarkdown`.

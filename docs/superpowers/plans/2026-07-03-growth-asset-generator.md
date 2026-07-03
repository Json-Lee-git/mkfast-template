# Growth Asset Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local generator that turns SEO/GEO campaign targets into reusable briefs, outreach copy, distribution drafts, and daily growth logs.

**Architecture:** Keep all behavior in a pure TypeScript module under `scripts/lib/` and expose it through a small CLI script. Store input as versioned JSON in `docs/growth/`, and write generated markdown into `docs/growth/generated/`.

**Tech Stack:** TypeScript, Node built-in `node:test`, `tsx`, existing `pnpm` scripts.

## Global Constraints

- Do not touch production payment, webhook, database, or runtime app behavior.
- Do not introduce new dependencies.
- Generated copy must avoid guarantees about rankings, AI citations, traffic, or revenue.
- Output should support the current aeocheck focus: BOFU SEO, external distribution, mini audit outreach, and daily growth tracking.

---

### Task 1: Pure Generator Module

**Files:**
- Create: `scripts/lib/growth-asset-generator.ts`
- Create: `scripts/lib/growth-asset-generator.test.ts`

**Interfaces:**
- Produces: `generateGrowthAssetMarkdown(target: GrowthTarget, options?: GenerateOptions): string`
- Produces: `slugifyTarget(value: string): string`
- Produces: `type GrowthTarget`, `type GenerateOptions`

- [ ] Write failing tests for slugging, required sections, and banned guarantee language.
- [ ] Run `pnpm exec tsx --test scripts/lib/growth-asset-generator.test.ts` and confirm failure because module does not exist.
- [ ] Implement the pure generator module.
- [ ] Run the focused test and confirm pass.

### Task 2: CLI And Campaign Config

**Files:**
- Create: `docs/growth/acquisition-targets.json`
- Create: `docs/growth/README.md`
- Create: `scripts/generate-growth-assets.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `generateGrowthAssetMarkdown(target, options)`
- Produces command: `pnpm run growth:assets`

- [ ] Add a seed JSON campaign with 3 target assets.
- [ ] Add a CLI that reads the JSON and writes one markdown file per target into `docs/growth/generated/`.
- [ ] Add `growth:assets` script to `package.json`.
- [ ] Run `pnpm run growth:assets` and inspect generated files.

### Task 3: Verification

**Files:**
- Verify modified files only.

- [ ] Run `pnpm exec tsx --test scripts/lib/growth-asset-generator.test.ts`.
- [ ] Run `pnpm run growth:assets`.
- [ ] Run `pnpm run check`.
- [ ] Summarize generated assets and remaining manual steps.

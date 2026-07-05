# LLMs.txt Validator SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen existing LLMs.txt pages for `llms.txt validator` queries without creating a new URL or changing production infrastructure.

**Architecture:** Keep `/tools/llms-txt-checker` as the canonical tool URL and use `/compare/llms-txt-checker-alternatives` as the main SEO landing surface for validator/comparison intent. Add only small contextual links from existing guides so authority flows to the checker and compare pages.

**Tech Stack:** TanStack Start route files, React TSX, existing SEO helpers, existing FAQ/schema helpers, pnpm verification commands.

## Global Constraints

- Do not create `/tools/llms-txt-validator` or any other new page.
- Do not modify payment, admin, webhook, Cloudflare binding, D1, or secret configuration.
- Keep `/tools/llms-txt-checker` as the primary tool CTA.
- Target terms: `llms.txt validator`, `free llms.txt validator`, `llms.txt checker`, `llms.txt validation tool`.
- Keep claims conservative: LLMs.txt is an emerging convention, not an official standard or guaranteed ranking/citation factor.

---

### Task 1: Validator SEO Content Enhancements

**Files:**
- Modify: `src/routes/compare.llms-txt-checker-alternatives.tsx`
- Modify: `src/routes/tools.llms-txt-checker.tsx`
- Modify: `src/routes/guides.llms-txt-file.tsx`
- Modify: `src/routes/guides.llms-txt-seo.tsx`

**Interfaces:**
- Consumes: existing route components and FAQ schema arrays.
- Produces: updated on-page copy, FAQ schema entries, and internal links using existing React/TSX patterns.

- [ ] **Step 1: Update compare metadata and FAQ data**

In `src/routes/compare.llms-txt-checker-alternatives.tsx`, update the `seo()` title/description to include validator intent, and add FAQ entries for validation workflow, checker-vs-validator wording, and common validation errors.

Expected copy direction:
```tsx
title:
  'Best LLMs.txt Checker & Validator Alternatives — Compare Free Tools',
description:
  'Compare free LLMs.txt checker and validator tools for format validation, link checking, AI crawler access, headers, and file readiness.',
```

- [ ] **Step 2: Add compare page validator sections**

In `src/routes/compare.llms-txt-checker-alternatives.tsx`, add two focused sections after the existing direct-answer block or near the top of the page:

```tsx
<h2>Best free LLMs.txt validator</h2>
<p>
  If you searched for an LLMs.txt validator, you probably need to confirm that
  your file is reachable at <code>/llms.txt</code>, returns a 200 response, uses
  a valid text content type, follows readable Markdown structure, and does not
  contain broken links. AI Search Readiness combines those checks with AI
  crawler access signals in one scan.
</p>
```

Also add a checklist section covering:
- `/llms.txt` returns 200
- `content-type` is `text/plain` or `text/markdown`
- Markdown has a clear H1, summary, and section links
- links resolve without 404/redirect loops
- optional `/llms-full.txt` is reachable when referenced
- robots.txt does not block relevant AI crawlers unintentionally

- [ ] **Step 3: Lightly reinforce tool page copy**

In `src/routes/tools.llms-txt-checker.tsx`, add one concise sentence near the hero explanatory text or below the form:

```tsx
This checker also works as a free LLMs.txt validation tool for teams that need to verify headers, Markdown structure, link health, and AI crawler access before submitting a site for AI search review.
```

Keep the page title and primary CTA unchanged unless the existing copy already contains the target term naturally.

- [ ] **Step 4: Add guide internal links**

In `src/routes/guides.llms-txt-file.tsx`, add a sentence in the placement or format section linking to the checker with validator anchor text:

```tsx
After publishing the file, validate it with the <a href="/tools/llms-txt-checker?utm_source=guide&utm_medium=organic&utm_campaign=seo-llms-txt-validator&utm_content=llms-txt-file-inline">free LLMs.txt validator</a> to confirm headers, links, and AI crawler access.
```

In `src/routes/guides.llms-txt-seo.tsx`, add a similar sentence in the “How to check your current setup” section, linking to the compare page or tool page with explicit validator wording.

- [ ] **Step 5: Format changed TSX files**

Run:
```bash
pnpm exec prettier --write src/routes/compare.llms-txt-checker-alternatives.tsx src/routes/tools.llms-txt-checker.tsx src/routes/guides.llms-txt-file.tsx src/routes/guides.llms-txt-seo.tsx
```

Expected: all four files formatted without errors.

---

### Task 2: Verification And Commit

**Files:**
- Verify: `src/routes/compare.llms-txt-checker-alternatives.tsx`
- Verify: `src/routes/tools.llms-txt-checker.tsx`
- Verify: `src/routes/guides.llms-txt-file.tsx`
- Verify: `src/routes/guides.llms-txt-seo.tsx`

**Interfaces:**
- Consumes: modified TSX route files.
- Produces: passing local checks and one focused git commit.

- [ ] **Step 1: Inspect diff for scope**

Run:
```bash
git diff -- src/routes/compare.llms-txt-checker-alternatives.tsx src/routes/tools.llms-txt-checker.tsx src/routes/guides.llms-txt-file.tsx src/routes/guides.llms-txt-seo.tsx
```

Expected: only copy, FAQ data, metadata, and internal links changed.

- [ ] **Step 2: Run quality checks**

Run:
```bash
pnpm run check
pnpm exec tsc --noEmit
pnpm run build
```

Expected: all commands exit 0.

- [ ] **Step 3: Run focused content checks**

Run:
```bash
rg -n "LLMs\.txt validator|free LLMs\.txt validator|validation tool|checker and validator|llms-txt-validator" src/routes/compare.llms-txt-checker-alternatives.tsx src/routes/tools.llms-txt-checker.tsx src/routes/guides.llms-txt-file.tsx src/routes/guides.llms-txt-seo.tsx
```

Expected: target terms and UTM campaign appear in the intended files.

- [ ] **Step 4: Commit**

Run:
```bash
git status --short
git add src/routes/compare.llms-txt-checker-alternatives.tsx src/routes/tools.llms-txt-checker.tsx src/routes/guides.llms-txt-file.tsx src/routes/guides.llms-txt-seo.tsx docs/superpowers/plans/2026-07-05-llms-txt-validator-seo.md
git commit -m "Strengthen llms.txt validator SEO"
```

Expected: one focused commit containing only the plan and scoped SEO content changes.

## Self-Review

- Spec coverage: The plan covers compare page validator content, tool page reinforcement, guide internal links, verification, and commit.
- Placeholder scan: No TBD/TODO placeholders remain.
- Scope check: The plan does not introduce a new page, dependency, backend code, payment changes, admin changes, webhook changes, or production configuration changes.

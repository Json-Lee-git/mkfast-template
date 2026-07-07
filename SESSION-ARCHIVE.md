# Session Archive — URL / SEO / Deployment Configuration Hardening

**Date:** 2026-07-06
**Branch:** `main`
**HEAD:** `0b837c3` — Add PUBLIC_SITE_URL two-tier resolution for correct canonical URLs

---

## 1. What Was Done

### Problem
`getBaseUrl()` in SSR context used `process.env.VITE_BASE_URL`, a **build-time env** unavailable at Worker runtime. This caused canonical URLs, `og:url`, `twitter:url`, robots.txt, and sitemap to produce incorrect or `localhost` URLs in production.

### Solution
Introduced a **two-tier origin resolution** (`src/lib/urls.ts`):

1. **`PUBLIC_SITE_URL`** (Worker runtime `vars`) — authoritative for server-side rendering
2. **`VITE_BASE_URL`** (build-time) — fallback, also used for client hydration

### Files Changed (8 files, +113 / -15)

| File | Changes |
|------|---------|
| `src/lib/urls.ts` | Core logic: `getBaseUrl()` now checks `process.env.PUBLIC_SITE_URL` before `clientEnv.VITE_BASE_URL` |
| `src/env/server.ts` | Replaced `VITE_BASE_URL` validation with `PUBLIC_SITE_URL` (optional) |
| `src/env/client.ts` | Production default for `VITE_BASE_URL` set to `https://aeocheck.xyz` |
| `src/api/ai-readiness/manual-audit-orders.ts` | Uses `getBaseUrl()` instead of raw `process.env.VITE_BASE_URL` |
| `wrangler.jsonc` | Added `PUBLIC_SITE_URL` to `vars` (value read via `wrangler secret` or deploy var) |
| `.github/workflows/deploy.yml` | Added `PUBLIC_SITE_URL` validation + `--var` injection during deploy |
| `scripts/smoke-seo-funnel.ts` | New assertions: canonical, og:url, twitter:url + localhost leak check |
| `docs/env.md` | Docs update reflecting new resolution order |

---

## 2. Verification Results

### Production Site: `https://aeocheck.xyz`

| Check | Result |
|-------|--------|
| Canonical URLs | Correct — all pages resolve to `https://aeocheck.xyz/...` |
| `og:url` | Correct — matches canonical |
| `twitter:url` | Correct — matches canonical |
| HTTP → HTTPS redirect (301) | Correct |
| `www` → non-`www` redirect (301) | Correct |
| `robots.txt` | Correct — allows SEO pages, disallows `/admin` |
| `sitemap.xml` | Correct — includes all public pages, excludes `/ai-search-audit/thanks` |
| `noindex` | Correct — public pages have no noindex, `/thanks` has noindex |
| `localhost` leaks | None found |
| Schema.org (WebSite, Organization, ItemList, FAQPage) | Present and pointing to `aeocheck.xyz` |
| Google Analytics (G-4EK6XN9BVY) | Loading |
| Footer email (`support@aeocheck.xyz`) | Correct |

### Smoke Test: 54/54 PASS

Pages tested: `/ai-search-audit`, `/sample-aeo-report`, `/blog/ai-search-readiness-audit`, `/methodology`, `/ai-search-audit/thanks`, `/robots.txt`, `/sitemap.xml`

Each page validated: 200 status, page content exists, correct noindex, no localhost leaks, canonical/og:url/twitter:url match production domain, HTTP→HTTPS redirect, www→non-www redirect.

### Manual Check: 4/4 PASS

- Homepage `/` → canonical `https://aeocheck.xyz/` ✅
- Pricing `/pricing` → canonical `https://aeocheck.xyz/pricing` ✅
- Sample Report → covered in smoke test ✅
- Methodology → covered in smoke test ✅

### CI & Build

- `pnpm check` — 988 files checked, no fixes applied ✓
- `pnpm build` — 9724 modules, clean client + SSR build ✓
- `wrangler deploy` — success ✓

---

## 3. Boundary: What Was NOT Included

> **Cloudflare AI binding (`env.AI`) / `env.AI`-dependent features were not included in this validation scope.**
>
> These features will be restored under a separate task:
> **Task: Restore Cloudflare AI binding safely**
>
> Acceptance criteria:
> - `env.AI`-dependent APIs work in production
> - Local dev does not crash when AI binding is unavailable
> - AI routes fail gracefully (no 500) when AI binding is unavailable

---

## 4. How to Resume

```bash
# Production deploy (CI)
# PUBLIC_SITE_URL is already injected via deploy.yml --var flag

# Smoke test SEO funnel
pnpm dev
node scripts/smoke-seo-funnel.ts

# Verify production URLs
pnpm smoke:seo-funnel -- --production
```

---

## 5. D1 Database

Local D1 snapshot backed up: `backups/d1-local-backup-20260706.sqlite`
`.wrangler/state/` is gitignored; no migration changes in this session.

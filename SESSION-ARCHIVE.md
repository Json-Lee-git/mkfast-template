# Session Archive — PUBLIC_SITE_URL Hardening

**Date:** 2026-07-06  
**Branch:** `main`  
**HEAD:** `4bedc5c Add Opus supervision handoff`

---

## 1. What Was Done

### Problem
`getBaseUrl()` in SSR context used `process.env.VITE_BASE_URL`, which is a **build-time env** and was NOT available at Worker runtime. This caused canonical URLs, `og:url`, `twitter:url`, robots.txt, and sitemap to produce incorrect or `localhost` URLs in production.

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

### Verification Passed

- `pnpm check` — 988 files checked, no fixes applied ✓
- `pnpm build` — clean client + SSR build ✓

---

## 2. Remaining Verification (Not Yet Done)

- [ ] **Deploy dry-run:** `wrangler deploy --dry-run --outdir=dist` to confirm wrangler.toml config
- [ ] **Preview deploy:** to preview env to smoke-test live
- [ ] **URL verification across 3 envs:**
  - Local dev: canonical/og:url/twitter:url = `http://localhost:3000/...`
  - Preview/Staging: canonical/og:url/twitter:url = `https://preview.aeocheck.xyz/...`
  - Production: canonical/og:url/twitter:url = `https://aeocheck.xyz/...`
- [ ] **Production deploy:** requires `PUBLIC_SITE_URL` secret set in GitHub

---

## 3. How to Resume

```bash
# Preview deploy (manual)
wrangler deploy --var PUBLIC_SITE_URL:https://preview.aeocheck.xyz

# Smoke test locally
pnpm dev
node scripts/smoke-seo-funnel.ts

# Production deploy (CI)
# 1. Set PUBLIC_SITE_URL in GitHub Secrets
# 2. Push to main
```

---

## 4. D1 Database

Local D1 snapshot backed up: `backups/d1-local-backup-20260706.sqlite`  
`.wrangler/state/` is gitignored; no migration changes in this session.

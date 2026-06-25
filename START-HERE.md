# Rapid Site Cloning Workflow

Clone this repo to launch a new AI-optimized content site in under an hour.

## 1. Clone & configure

```bash
git clone <this-repo> my-new-site
cd my-new-site
pnpm install
```

## 2. Customize identity

- `src/config/website.ts` — site name, tagline, domain, social links
- `src/config/navbar-config.ts` — navigation links
- `src/config/footer-config.ts` — footer sections
- `public/llms.txt` — site summary for AI crawlers
- `.env` — D1 database ID, Cloudflare API token, secrets

## 3. Replace content

- `content/blog/` — your articles (follow `*.en.md` / `*.zh.md` naming)
- `content/glossary/` — your glossary terms
- `content/pages/` — static pages (privacy, terms)
- `content/changelog/` — product updates

## 4. Update tools (optional)

The free tools under `src/routes/tools.*.tsx` can be:
- **Kept as-is** — LLMs.txt Checker/Generator, AEO Checker, Query Fan-Out
- **Replaced** — swap in tools for your niche
- **Removed** — delete route files and their nav links

## 5. Deploy

```bash
pnpm build
pnpm deploy
```

## File naming convention

All content uses `slug.locale.md`:
- `my-post.en.md` — English
- `my-post.zh.md` — Chinese

The Content Collections config in `content-collections.ts` auto-extracts locale and slug.

## Key architecture

- **TanStack Start** on Cloudflare Workers — SSR React app
- **D1** (SQLite) via Drizzle ORM — database
- **Better Auth** — Google OAuth + email/password login
- **Creem** — payment provider ($19 one-time reports)
- **Workers AI** — free AI features (100 calls/day/feature limit)
- **Content Collections** — markdown-based blog/glossary/pages

## Production checklist

- [ ] Set all secrets in Cloudflare Dashboard (not just .env)
- [ ] Run `pnpm db:migrate:remote` to apply D1 migrations
- [ ] Create Creem products and set `CREEM_PRODUCT_FULL_REPORT`
- [ ] Configure Google OAuth credentials in Better Auth
- [ ] Submit sitemap to Google Search Console
- [ ] Verify `https://your-domain.com/llms.txt` resolves

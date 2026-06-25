# AI Search Readiness Tools

Free tools to check and improve your website's visibility in AI-powered search results.

## Tools

- **LLMs.txt Checker** — Validate your `/llms.txt` file
- **LLMs.txt Generator** — Build one from your sitemap
- **AEO Checker** — Audit your site's AI search readiness with AI-powered analysis
- **Query Fan-Out** — Expand a topic into long-tail queries and FAQ questions

## Stack

TanStack Start + React 19 on Cloudflare Workers. D1 (SQLite) via Drizzle ORM. Better Auth for authentication. Creem for payments. Workers AI for free AI features. Content Collections for blog and glossary.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm run deploy   # deploy to Cloudflare Workers
pnpm db:migrate:remote  # apply D1 migrations to production
```

## Content

- `content/blog/` — Blog posts (Markdown with frontmatter)
- `content/glossary/` — Glossary terms
- `content/pages/` — Static pages (privacy, terms)
- `content/changelog/` — Release notes

Content Collections auto-extracts locale and slug from filenames (`slug.en.md`).

## License

See [LICENSE](LICENSE).

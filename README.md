# AI Search Readiness Tools

Free technical SEO and AEO tools for checking whether public web pages are
ready to be crawled, parsed, and understood by search engines and AI-assisted
search systems.

Live site: https://aeocheck.xyz

## Tools

- [AEO Checker](https://aeocheck.xyz/tools/aeo-checker): audit AI crawler
  access, LLMs.txt discovery, sitemap discovery, structured data,
  answer-ready page structure, entity clarity, and trust signals.
- [LLMs.txt Checker](https://aeocheck.xyz/tools/llms-txt-checker): validate
  whether `/llms.txt` and `/llms-full.txt` are discoverable and readable.
- [LLMs.txt Generator](https://aeocheck.xyz/tools/llms-txt-generator): build a
  clean LLMs.txt file from a sitemap or manual URLs.
- [Query Fan-Out Tool](https://aeocheck.xyz/tools/query-fan-out-tool): expand a
  topic into related questions and long-tail search intents.

## Methodology

The project focuses on readiness signals, not ranking guarantees. It does not
promise traffic, AI Overview inclusion, or citations from ChatGPT, Claude,
Gemini, Perplexity, Bing, or Google.

Useful public pages:

- [AI Search Readiness Checklist](https://aeocheck.xyz/guides/ai-search-readiness-checklist)
- [Sample AEO Report](https://aeocheck.xyz/sample-aeo-report)
- [Methodology](https://aeocheck.xyz/methodology)
- [References](https://aeocheck.xyz/references)
- [Press kit](https://aeocheck.xyz/press)
- [llms.txt](https://aeocheck.xyz/llms.txt)
- [llms-full.txt](https://aeocheck.xyz/llms-full.txt)

## Stack

- TanStack Start + React 19
- Cloudflare Workers
- Cloudflare D1 with Drizzle ORM
- Better Auth
- Creem payments
- Workers AI
- Content Collections

## Getting Started

```bash
pnpm install
pnpm dev
pnpm build
pnpm deploy
pnpm db:migrate:remote
```

The dev server runs on http://localhost:3000.

## Content

- `content/blog/`: blog posts
- `content/glossary/`: glossary terms
- `content/pages/`: static pages
- `content/changelog/`: release notes

Content Collections extracts locale and slug from filenames such as
`slug.en.md`.

## License

See [LICENSE](LICENSE).

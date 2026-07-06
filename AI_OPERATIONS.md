# AI Operations Manual — aeocheck.xyz

**Purpose**: A single document any AI agent can read and execute.
No industry experience required. Every task has a concrete checklist,
a command to run, and a success criterion.

---

## Daily Operations (~30 min)

### 1. Health Check

```bash
# In the repo root:
pnpm smoke:route-tree
pnpm smoke:seo-funnel
```
> If any FAIL appears: open the failing route in
> `src/routes/`, check for 500 errors, fix before proceeding.

### 2. Monitor GSC for New Clicks

Go to https://search.google.com/search-console
→ Property `aeocheck.xyz`
→ Performance → Date range "Last 7 days"
→ Record:
- Total clicks
- Total impressions
- Avg CTR
- Top 3 queries (by impressions)

**Success criterion**: Week-over-week impressions increasing.
If flat for 14+ days, escalate to content publishing (weekly ops #4).

### 3. Check Creem Webhook Delivery

Go to https://app.creem.io → Settings → Webhooks → Delivery Log
Check last 10 events: all should be `200` or `processed`.
Any `failed` events → log the `eventId` and re-process manually via:
```bash
CREEM_WEBHOOK_SECRET=<secret> pnpm manual-audit:smoke
```

### 4. D1 Database Sanity Check

```bash
pnpm db:studio:local
```
Open Drizzle Studio → verify these tables have rows:
- `webhook_events` (recent entries = webhooks working)
- `manual_audit_orders` (check for `pending` older than 24h — those orders were abandoned, mark them `checkout_failed`)
- `ai_visibility_snapshots` (if empty but Pro users exist → weekly re-audit cron didn't fire)

---

## Weekly Operations (~2 hours)

### 1. Pro Subscriber Re-Audit

Query all active Pro subscribers, run `runAndSaveAudit` for each tracked URL.
A cron job should be set up for this; if not yet automated, run manually:

```bash
# TODO: script this — for now, query via D1 studio:
# SELECT user_id, url FROM ai_visibility_snapshots
#   GROUP BY user_id, url HAVING MAX(created_at) < date('now', '-7 days')
# Then for each row, POST to /api/ai-readiness/visibility-tracking reaudit
```

### 2. Content Calendar: Publish 1 Article

See **Content Publishing SOP** below. One article per week.
Topics rotate through:

| Week | Topic Pattern | Example |
|------|-------------|---------|
| A | Comparison/alternative | "5 AthenaHQ alternatives for indie SEOs in 2026" |
| B | How-to tutorial | "How to add LLMs.txt to a WordPress site (5 min)" |
| C | Data/trends | "AI Overviews CTR by industry: 2026 data" |
| D | Tool showcase | "AEOCheck Pro: weekly AI visibility tracking explained" |

### 3. Distribution: Post to 2 Channels

After publishing, post the article link to:
1. **Reddit**: r/SEO, r/TechSEO, r/bigseo (alternate weeks so you don't spam)
2. **Indie Hackers**: indiehackers.com → Post → "I built a free AEO checker — here's what I learned from the first X users"

**Post template (Reddit)**:
```
Title: [Tool] Free AEO checker + LLMs.txt validator — no signup
Body: I built aeocheck.xyz because I couldn't find a free tool
that checks AI search readiness signals in one scan. It checks:
- LLMs.txt + LLMs-full.txt validation
- AI crawler access (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Structured data / schema detection
- Answer-ready content analysis
- Trust signals & entity clarity
- Full readiness score (0-100)

Free scan. No account. No credit card.
Happy to take feedback or feature requests.
```

### 4. SEO Content Refresh

Pick the 3 oldest blog posts in `content/blog/`.
For each:
- Check if `<title>` matches best-performing keywords in GSC
- Update meta description to include a pain question ("Is your site invisible to AI search?")
- Add 1 internal link to a tool page (`/tools/aeo-checker`, `/tools/llms-txt-checker`, etc.)

---

## Monthly Operations (~4 hours)

### 1. Pricing & Revenue Review

Open Creem dashboard → Revenue → This month.
Record:
- Total revenue
- New subscribers
- Churned subscribers
- MRR (Monthly Recurring Revenue)

If MRR < $100 after 90 days: run a pricing experiment.
Reduce Pro from $29 to $19 for 2 weeks, measure conversion change.
Revert if no improvement.

### 2. Competitor Recon

Search on Google:
- "AEO checker"
- "LLMs.txt validator"
- "GEO audit tool"
- "AI search visibility tracker"

Record any new competitors that appeared in top 10 since last month.
For each: note pricing, features, traffic estimate.
If a competitor offers a killer feature aeocheck.xyz doesn't have:
→ Write a GitHub issue with `[competitor-gap]` label
→ Assign next weekly content/feature cycle to close the gap

### 3. Technical Debt: Monthly Scan

```bash
pnpm run check            # Biome lint
pnpm exec tsc --noEmit    # TypeScript
pnpm run build            # Production build
pnpm test                 # Unit tests
```

All must pass. If not: fix before proceeding to content/features.

### 4. Google Search Console Audit

Export GSC Performance data (Last 28 days, all queries, all pages).
Check for:
- Pages with >50 impressions but <1% CTR → rewrite title/description
- New queries appearing in top 20 → create dedicated content for them
- Pages with declining impressions → check if page is broken or deindexed

### 5. Sitemap / Index Status

GSC → Index → Pages
Check: any pages in "Crawled — currently not indexed" or "Excluded"?
If tool pages are excluded → fix `noindex` tags or robots.txt rules.
If content pages are excluded → improve internal linking.

---

## Content Publishing SOP

### AI-Driven Blog Post Workflow

This is designed to be run by an AI agent. No human writing required.

```
Step 1: Topic selection
  - Pick from the weekly topic rotation (above)
  - Verify the topic via GSC: is anyone searching for this?
  - Write 1-line brief: "This post helps [audience] solve [problem]"

Step 2: Research (AI agent)
  - WebSearch the topic keyword
  - Fetch top 5 ranking pages for that keyword
  - Extract: their H2s, their key claims, their missing angles
  - Identify 1 angle they ALL miss → that's your article's unique hook

Step 3: Draft (AI agent)
  - Write in content/blog/<slug>.en.md
  - Format:
    ---
    title: "Hook-Driven Title With Keyword"
    description: "Pain-question meta description, under 160 chars"
    publishedAt: YYYY-MM-DD
    image: /og.png
    ---

    ## The problem (1-2 paragraphs)
    ## What [tool/keyword] actually solves
    ## Step-by-step (numbered, concrete)
    ## Real example (with data/screenshot if possible)
    ## Common mistakes
    ## Next steps (CTA → aeocheck.xyz tool page)

Step 4: Internal links
  - Link to at least 1 aeocheck.xyz tool page
  - Link to at least 1 other blog post on the site
  - Link to at least 1 external high-authority source (Ahrefs, Pew, etc.)

Step 5: Structured data
  - Add JSON-LD Article + BreadcrumbList schema
  - Route file: head() → seo() + jsonLd(articleSchema()) + jsonLd(breadcrumbSchema())

Step 6: Publish
  - git add content/blog/<slug>.en.md src/routes/...
  - git commit -m "content: <title>"
  - pnpm build (verify it compiles)
  - git push
  - pnpm deploy
```

---

## Pricing Rules (DO NOT CHANGE without running this checklist)

Current pricing (as of July 2026 — `src/config/website.ts`):

| Plan | Price | Model | Creem Product Env Var |
|------|-------|-------|----------------------|
| Free Scan | $0 | — | — |
| Pro | $29/mo or $290/yr | Subscription | `VITE_CREEM_PRODUCT_PRO_MONTHLY` / `_YEARLY` |
| Fix Pack | $19 one-time | One-time | `CREEM_PRODUCT_FULL_REPORT` |
| Manual Audit | $99 one-time | One-time (service) | `CREEM_PRODUCT_MANUAL_AUDIT` |
| Lifetime | $199 one-time | One-time | `VITE_CREEM_PRODUCT_LIFETIME` |

**Before changing any price**:
1. Create the new product/price in Creem Dashboard FIRST
2. Update the env var in Cloudflare Dashboard
3. Then update `website.ts` amounts
4. Deploy
5. Verify: open /pricing in incognito, click "Get Started" → checkout URL loads with correct amount

**Never change prices in website.ts without the Creem product already existing.**
It will break checkout for that plan.

---

## Distribution Checklist (Initial 90-Day Bootstrap)

### AI Tool Directories (submit once, update if needed)

- [ ] There's An AI For That (theresanaiforthat.com)
- [ ] Futurepedia (futurepedia.io)
- [ ] Product Hunt (producthunt.com) — prepare launch day, coordinate with community
- [ ] Toolify (toolify.ai)
- [ ] AI Tool Guru (aitoolguru.com)
- [ ] TopAI.tools
- [ ] SaaS AI Tools
- [ ] AlternativeTo (alternativeto.net)
- [ ] G2 (g2.com) — list under "SEO Tools" or "AI SEO Software"

### Community Channels (weekly engagement)

- [ ] Reddit: r/SEO r/TechSEO r/bigseo r/indiehackers r/SaaS
- [ ] Indie Hackers: post progress updates weekly
- [ ] X/Twitter: share GSC screenshots, MRR milestones, feature updates

### SEO for the Site Itself

- [ ] `/blog/` — weekly article (Content Publishing SOP above)
- [ ] `/compare/` — existing comparison pages → update monthly
- [ ] `/guides/` — existing guides → add CTAs to tool pages
- [ ] `/glossary/` — add 1 term per month (low effort, long-tail SEO)

---

## Metrics Dashboard

These are the numbers that matter. Track them in a spreadsheet or Notion.
Update WEEKLY.

| Metric | Source | Target (30d) | Target (90d) |
|--------|--------|-------------|-------------|
| Weekly impressions | GSC | 500 | 5,000 |
| Weekly clicks | GSC | 50 | 500 |
| Avg CTR | GSC | 3% | 5% |
| Avg position | GSC | <20 | <12 |
| Free scans run | D1 `ai_usage` table | 200 | 1,000 |
| Pro trials started | Creem dashboard | 10 | 50 |
| Pro → paid conversion | Creem dashboard | 20% | 30% |
| MRR | Creem dashboard | $100 | $1,000 |
| Blog posts published | Count `content/blog/` | 4 | 12 |

---

## Emergency Response

| Situation | Action |
|-----------|--------|
| Build fails | `git log -1` — revert the last commit, redeploy |
| Webhooks failing | Check Creem Dashboard → Webhook Delivery Log. If all 500: restart Worker from Cloudflare Dashboard |
| D1 database full | Cloudflare Dashboard → D1 → `mkfast-template` → check row count. Max: ~10GB. If nearing, archive old `ai_usage` and `conversion_events` rows |
| Site down | `curl -I https://aeocheck.xyz` — if 5xx, check Cloudflare Dashboard → Workers → `ai-search-readiness` → Logs for error traces |
| Secrets leaked | Rotate immediately: Cloudflare Dashboard → Workers → Settings → Variables. Update Creem webhook secret in both Cloudflare AND Creem Dashboard |

---

## Automation Roadmap

Tasks still manual that should be automated:

1. **Weekly Pro re-audit cron** → Cloudflare Workers Cron Trigger (`scheduled()` handler in `server.ts`)
2. **GSC data sync to D1** → Google Search Console API → daily export → D1 table for dashboard
3. **Competitor rank tracking** → scheduled WebSearch for target keywords → store in D1
4. **Email onboarding sequence** → Resend trigger on first audit completion
5. **Churn prediction** → if no audit run in 21 days, send re-engagement email via Resend

Each can be built by an AI agent reading this document. Add them in order.

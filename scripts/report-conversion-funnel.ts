/**
 * Conversion funnel report.
 *
 * Local mode (default):
 *   Queries local D1 SQLite via better-sqlite3. Requires a local D1 file
 *   created by `wrangler d1 execute --local`.
 *
 * Remote mode:
 *   Uses `wrangler d1 execute --remote --json` to query production D1.
 *   Requires Cloudflare auth (wrangler login).
 *
 * Usage:
 *   pnpm exec tsx scripts/report-conversion-funnel.ts --days=7
 *   pnpm exec tsx scripts/report-conversion-funnel.ts --days=7 --remote
 *   pnpm exec tsx scripts/report-conversion-funnel.ts --days=30 --remote
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ── CLI ──

function parseDays(): number {
  const arg = process.argv
    .find((a) => a.startsWith('--days='))
    ?.slice('--days='.length);
  const parsed = arg ? Number.parseInt(arg, 10) : 7;
  if (Number.isNaN(parsed) || parsed < 1) return 7;
  return parsed;
}

const isRemote = process.argv.includes('--remote');
const DB_NAME = 'mkfast-template';

// ── Funnel steps ──
// Each step can have multiple event names for backwards compatibility.

interface FunnelStep {
  label: string;
  events: string[]; // first is primary, rest are legacy aliases
}

const FUNNEL: FunnelStep[] = [
  {
    label: 'Audit page views',
    events: ['aeo_page_viewed', 'manual_audit_page_viewed'],
  },
  { label: 'Scans started', events: ['aeo_audit_started'] },
  { label: 'Scans completed', events: ['aeo_audit_completed'] },
  { label: 'Scans failed', events: ['scan_failed'] },
  {
    label: 'Unlock Fix Pack clicked',
    events: ['full_report_checkout_clicked'],
  },
  { label: 'Checkout created', events: ['checkout_created'] },
  { label: 'Checkout failed', events: ['checkout_failed'] },
  { label: 'Reports activated (paid)', events: ['report_activated'] },
  { label: 'Reports viewed', events: ['report_viewed'] },
  { label: 'Resend opened', events: ['resend_opened'] },
  { label: 'Resend submitted', events: ['resend_submitted'] },
];

// ── Remote query (wrangler --json) ──

interface WranglerD1Row {
  [key: string]: string | number | null;
}

function remoteQuery(sql: string): WranglerD1Row[] {
  // Use --json for machine-readable output
  const cmd = `npx wrangler d1 execute ${DB_NAME} --remote --json --command "${sql.replace(/"/g, '\\"')}"`;
  try {
    const raw = execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf-8',
      timeout: 30000,
      env: { ...process.env },
    });
    // wrangler --json outputs an array of results
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // First element is the query result
      return (parsed[0]?.results ?? []) as WranglerD1Row[];
    }
    // Some versions wrap in an object
    if (parsed?.results) return parsed.results as WranglerD1Row[];
    return [];
  } catch (err) {
    console.error(
      'Remote query failed:',
      err instanceof Error ? err.message : String(err)
    );
    process.exit(1);
  }
}

function remoteCountQuery(eventNames: string[], cutoff: number): number {
  // wrangler doesn't support parameterized queries via --command, so we inline
  const where = eventNames
    .map((e) => `event = '${e.replace(/'/g, "''")}'`)
    .join(' OR ');
  const sql = `SELECT COUNT(*) as cnt FROM conversion_events WHERE (${where}) AND created_at >= ${cutoff}`;
  const rows = remoteQuery(sql);
  return (rows[0]?.cnt as number) ?? 0;
}

// ── Local query (better-sqlite3) ──

function loadBsql() {
  const candidates = [
    'better-sqlite3',
    path.resolve(
      ROOT,
      'node_modules/.pnpm/better-sqlite3@12.6.2/node_modules/better-sqlite3'
    ),
  ];
  for (const c of candidates) {
    try {
      return createRequire(import.meta.url)(c);
    } catch {
      // try next
    }
  }
  throw new Error('better-sqlite3 not found');
}

const Database = loadBsql();

function findLocalD1SqliteFile(): string {
  const d1Dir = path.resolve(ROOT, '.wrangler/state/v3/d1');
  if (!fs.existsSync(d1Dir)) {
    throw new Error(`D1 dir not found: ${d1Dir}`);
  }
  const entries = fs.readdirSync(d1Dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const subDir = path.join(d1Dir, entry.name);
    const files = fs.readdirSync(subDir);
    const sqliteFile = files.find(
      (f) => f.endsWith('.sqlite') && f !== 'metadata.sqlite'
    );
    if (sqliteFile) return path.join(subDir, sqliteFile);
  }
  throw new Error('No D1 SQLite file found');
}

const D1_PATH = findLocalD1SqliteFile();

function d1Query(
  sql: string,
  params: unknown[] = []
): Record<string, unknown>[] {
  const db = new Database(D1_PATH);
  try {
    return db.prepare(sql).all(...params) as Record<string, unknown>[];
  } finally {
    db.close();
  }
}

function localCountQuery(eventNames: string[], cutoff: number): number {
  const placeholders = eventNames.map(() => '?').join(', ');
  const sql = `SELECT COUNT(*) as cnt FROM conversion_events WHERE event IN (${placeholders}) AND created_at >= ?`;
  const params = [...eventNames, cutoff];
  const rows = d1Query(sql, params);
  return (rows[0]?.cnt as number) ?? 0;
}

// ── main ──

function main() {
  const days = parseDays();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const countFn = isRemote ? remoteCountQuery : localCountQuery;

  console.log(
    `=== Conversion Funnel (last ${days} days, ${isRemote ? 'remote' : 'local'}) ===\n`
  );

  const counts: number[] = [];

  for (const step of FUNNEL) {
    const count = countFn(step.events, cutoff);
    counts.push(count);
  }

  // Print table
  const maxLabelLen = Math.max(...FUNNEL.map((s) => s.label.length));
  const headerLabel = 'Step'.padEnd(maxLabelLen);
  console.log(`  ${headerLabel}  Count   Rate`);
  console.log(`  ${''.padEnd(maxLabelLen, '-')}  ------  ------`);

  for (let i = 0; i < FUNNEL.length; i++) {
    const label = FUNNEL[i].label.padEnd(maxLabelLen);
    const count = String(counts[i]).padStart(6);

    let rate = '';
    if (i === 0) {
      rate = '--';
    } else if (FUNNEL[i].events[0] === 'scan_failed') {
      rate = '--';
    } else if (FUNNEL[i].events[0] === 'checkout_failed') {
      rate = '--';
    } else if (FUNNEL[i].events[0] === 'report_viewed') {
      const prev = counts[7]; // report_activated
      rate = prev > 0 ? `${((counts[i] / prev) * 100).toFixed(1)}%` : '--';
    } else if (FUNNEL[i].events[0] === 'resend_opened') {
      rate = '--';
    } else if (FUNNEL[i].events[0] === 'resend_submitted') {
      const prev = counts[9]; // resend_opened
      rate = prev > 0 ? `${((counts[i] / prev) * 100).toFixed(1)}%` : '--';
    } else {
      const prev = counts[i - 1];
      const effectivePrev =
        FUNNEL[i - 1].events[0] === 'scan_failed'
          ? counts[i - 3]
          : FUNNEL[i - 1].events[0] === 'checkout_failed'
            ? counts[i - 3]
            : prev;
      rate =
        effectivePrev > 0
          ? `${((counts[i] / effectivePrev) * 100).toFixed(1)}%`
          : '--';
    }
    console.log(`  ${label}  ${count}  ${rate}`);
  }

  // Key conversion rates
  console.log('\n  Key conversion rates:');
  const pageViews = counts[0];
  const scansCompleted = counts[2];
  const checkoutCreated = counts[5];
  const reportsActivated = counts[7];

  if (pageViews > 0) {
    console.log(
      `    Page view → Scan completed: ${((scansCompleted / pageViews) * 100).toFixed(1)}%`
    );
  }
  if (scansCompleted > 0) {
    console.log(
      `    Scan completed → Checkout created: ${((checkoutCreated / scansCompleted) * 100).toFixed(1)}%`
    );
  }
  if (checkoutCreated > 0) {
    console.log(
      `    Checkout created → Paid (activated): ${((reportsActivated / checkoutCreated) * 100).toFixed(1)}%`
    );
  }
  if (pageViews > 0 && reportsActivated > 0) {
    console.log(
      `    Page view → Paid (end-to-end): ${((reportsActivated / pageViews) * 100).toFixed(1)}%`
    );
  }

  if (!isRemote) {
    console.log(`\n  D1: ${D1_PATH}`);
  }
}

main();

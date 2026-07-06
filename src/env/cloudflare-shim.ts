/**
 * Shim for `cloudflare:workers` module.
 *
 * Provides local equivalents of Cloudflare Worker bindings (D1, AI)
 * so the dev server can run without the @cloudflare/vite-plugin.
 *
 * Uses better-sqlite3 (already a transitive dependency) to back
 * the D1Database interface that drizzle-orm expects.
 */
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

// ── Local DB path ──────────────────────────────────────────────────
const DB_PATH = path.resolve('.wrangler/local-dev.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// ── D1Result / D1Response helpers ──────────────────────────────────
function makeResult(results: unknown[]): D1Result {
  // D1Result shape
  return {
    results,
    success: true,
    meta: { duration: 0, last_row_id: 0, rows_read: 0, rows_written: 0 },
  } as D1Result;
}

// ── D1PreparedStatement shim ───────────────────────────────────────
class LocalD1PreparedStatement {
  private sql: string;
  private params: unknown[] = [];

  constructor(sql: string) {
    this.sql = sql;
  }

  bind(...params: unknown[]): this {
    this.params = params;
    return this;
  }

  async all(): Promise<D1Result> {
    try {
      const stmt = sqlite.prepare(this.sql);
      const rows = stmt.all(...this.params);
      return makeResult(Array.isArray(rows) ? rows : [rows]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        results: [],
        success: false,
        error: msg,
        meta: {},
      } as unknown as D1Result;
    }
  }

  async first<T = unknown>(col?: string): Promise<T | null> {
    const stmt = sqlite.prepare(this.sql);
    const row = stmt.get(...this.params) as Record<string, unknown> | undefined;
    if (!row) return null;
    if (col) return (row[col] as T) ?? null;
    return row as T;
  }

  async run(): Promise<D1Response> {
    try {
      const stmt = sqlite.prepare(this.sql);
      const result = stmt.run(...this.params);
      return {
        success: true,
        meta: {
          duration: 0,
          last_row_id: Number(result.lastInsertRowid),
          rows_read: 0,
          rows_written: 0,
          changes: result.changes,
        },
      } as D1Response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg } as D1Response;
    }
  }

  async raw<T>(): Promise<T[]> {
    const stmt = sqlite.prepare(this.sql);
    const rows = stmt.raw().all(...this.params) as unknown[];
    return rows as T[];
  }
}

// ── D1Database shim ────────────────────────────────────────────────
class LocalD1Database {
  prepare(sql: string): LocalD1PreparedStatement {
    return new LocalD1PreparedStatement(sql);
  }

  async batch<T = unknown>(
    statements: { sql: string; params?: unknown[] }[]
  ): Promise<T[]> {
    const results: T[] = [];
    const run = sqlite.transaction(() => {
      for (const stmt of statements) {
        const prepared = sqlite.prepare(stmt.sql);
        const result = prepared.run(...(stmt.params ?? []));
        results.push(result as T);
      }
    });
    run();
    return results;
  }

  async exec(sql: string): Promise<D1Response> {
    try {
      sqlite.exec(sql);
      return { success: true, meta: {} } as D1Response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg } as D1Response;
    }
  }

  async dump(): Promise<ArrayBuffer> {
    return sqlite.serialize() as unknown as ArrayBuffer;
  }
}

// ── AI binding stub ────────────────────────────────────────────────
const aiStub = {
  async run(_model: string, _opts: unknown) {
    return { response: '[AI not available in local dev]' };
  },
};

// ── Exported env (mirrors Cloudflare bindings) ─────────────────────
export const env = {
  DB: new LocalD1Database() as unknown as D1Database,
  AI: aiStub,
};

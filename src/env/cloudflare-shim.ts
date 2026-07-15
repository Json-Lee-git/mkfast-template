/**
 * Local shim for the `cloudflare:workers` module.
 *
 * This file is used only by vite.config.local.ts, where the Cloudflare Vite
 * plugin is intentionally skipped. It keeps SSR pages renderable in local UI
 * preview without requiring remote Workers bindings or native SQLite packages.
 *
 * When a local D1 SQLite file is present (created by `wrangler d1 execute
 * --local`), the DB shim uses better-sqlite3 to provide real D1 access,
 * enabling full end-to-end testing of server functions against local D1.
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqliteDatabase = any;

function loadBetterSqlite3() {
  // better-sqlite3 may not be hoisted; resolve from pnpm store
  const candidates = [
    'better-sqlite3',
    path.resolve(
      'node_modules/.pnpm/better-sqlite3@12.6.2/node_modules/better-sqlite3'
    ),
  ];
  for (const candidate of candidates) {
    try {
      return createRequire(import.meta.url)(candidate);
    } catch {
      // try next
    }
  }
  throw new Error('better-sqlite3 not found — install it as a devDependency');
}

const Database = loadBetterSqlite3();

// ── D1 SQLite discovery ──

function findLocalD1SqliteFile(): string | null {
  const d1Dir = path.resolve('.wrangler/state/v3/d1');
  if (!fs.existsSync(d1Dir)) return null;
  try {
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
  } catch {
    // ignore
  }
  return null;
}

const LOCAL_D1_PATH = findLocalD1SqliteFile();

// ── D1Result / D1Response types ──

interface D1Result {
  results: unknown[];
  success: boolean;
  meta: {
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

interface D1Response {
  success: boolean;
  meta: {
    duration: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
    changes: number;
  };
}

// ── Real D1 via better-sqlite3 ──

class RealD1PreparedStatement {
  private db: SqliteDatabase;
  private sql: string;
  private params: unknown[] = [];

  constructor(db: SqliteDatabase, sql: string) {
    this.db = db;
    this.sql = sql;
  }

  bind(...params: unknown[]): this {
    this.params = params;
    return this;
  }

  async all(): Promise<D1Result> {
    const start = Date.now();
    try {
      const stmt = this.db.prepare(this.sql);
      const rows = stmt.all(...this.params) as unknown[];
      return {
        results: rows,
        success: true,
        meta: {
          duration: Date.now() - start,
          last_row_id: 0,
          rows_read: rows.length,
          rows_written: 0,
        },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`D1 all() error: ${msg}`);
    }
  }

  async first<T = unknown>(): Promise<T | null> {
    try {
      const stmt = this.db.prepare(this.sql);
      const row = stmt.get(...this.params) as T | undefined;
      return row ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`D1 first() error: ${msg}`);
    }
  }

  async run(): Promise<D1Response> {
    const start = Date.now();
    try {
      const stmt = this.db.prepare(this.sql);
      const info = stmt.run(...this.params);
      return {
        success: true,
        meta: {
          duration: Date.now() - start,
          last_row_id: Number(info.lastInsertRowid),
          rows_read: 0,
          rows_written: info.changes,
          changes: info.changes,
        },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`D1 run() error: ${msg}`);
    }
  }

  async raw<T>(): Promise<T[]> {
    const result = await this.all();
    return result.results as T[];
  }
}

class RealD1Database {
  private db: SqliteDatabase;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  prepare(sql: string): RealD1PreparedStatement {
    return new RealD1PreparedStatement(this.db, sql);
  }

  async batch<T = D1Response>(
    statements: { sql: string; params?: unknown[] }[]
  ): Promise<T[]> {
    const results: T[] = [];
    const runBatch = this.db.transaction(() => {
      for (const stmt of statements) {
        const prepared = this.db.prepare(stmt.sql);
        const info = prepared.run(...(stmt.params ?? []));
        results.push({
          success: true,
          meta: {
            duration: 0,
            last_row_id: Number(info.lastInsertRowid),
            rows_read: 0,
            rows_written: info.changes,
            changes: info.changes,
          },
        } as T);
      }
    });
    runBatch();
    return results;
  }

  async exec(sql: string): Promise<D1Response> {
    try {
      this.db.exec(sql);
      return {
        success: true,
        meta: {
          duration: 0,
          last_row_id: 0,
          rows_read: 0,
          rows_written: 0,
          changes: 0,
        },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`D1 exec() error: ${msg}`);
    }
  }

  async dump(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0);
  }
}

// ── No-op D1 (fallback when no local D1 file exists) ──

function noopResult(results: unknown[] = []): D1Result {
  return {
    results,
    success: true,
    meta: { duration: 0, last_row_id: 0, rows_read: 0, rows_written: 0 },
  };
}

class NoopD1PreparedStatement {
  bind(..._params: unknown[]): this {
    return this;
  }
  async all(): Promise<D1Result> {
    return noopResult();
  }
  async first<T = unknown>(): Promise<T | null> {
    return null;
  }
  async run(): Promise<D1Response> {
    return {
      success: true,
      meta: {
        duration: 0,
        last_row_id: 0,
        rows_read: 0,
        rows_written: 0,
        changes: 0,
      },
    };
  }
  async raw<T>(): Promise<T[]> {
    return [];
  }
}

class NoopD1Database {
  prepare(_sql: string): NoopD1PreparedStatement {
    return new NoopD1PreparedStatement();
  }
  async batch<T = D1Response>(
    statements: { sql: string; params?: unknown[] }[]
  ): Promise<T[]> {
    return statements.map(() => ({ success: true, meta: {} }) as T);
  }
  async exec(_sql: string): Promise<D1Response> {
    return { success: true, meta: {} } as D1Response;
  }
  async dump(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0);
  }
}

// ── Create DB instance ──

function createD1Database(): D1Database {
  if (LOCAL_D1_PATH) {
    console.log(`[cloudflare-shim] Using real D1: ${LOCAL_D1_PATH}`);
    return new RealD1Database(LOCAL_D1_PATH) as unknown as D1Database;
  }
  console.log('[cloudflare-shim] No local D1 file found, using no-op DB');
  return new NoopD1Database() as unknown as D1Database;
}

// ── AI / BUCKET stubs (no-op) ──

const aiStub = {
  async run(_model: string, _opts: unknown) {
    return { response: '[AI not available in local preview]' };
  },
};

const bucketStub = {
  async get() {
    return null;
  },
  async put() {
    return null;
  },
  async delete() {
    return null;
  },
  async list() {
    return { objects: [] };
  },
};

export const env = {
  DB: createD1Database(),
  AI: aiStub,
  BUCKET: bucketStub,
};

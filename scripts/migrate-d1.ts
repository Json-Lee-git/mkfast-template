import { spawnSync } from 'node:child_process';
import { getD1Database } from './parse-wrangler';

const mode = process.argv.includes('--remote') ? '--remote' : '--local';
const db = getD1Database();

if (!db) {
  console.error('D1 database config not found in wrangler.jsonc');
  process.exit(1);
}

const wrangler = process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler';
const result = spawnSync(
  wrangler,
  ['d1', 'migrations', 'apply', db.name, mode],
  { shell: process.platform === 'win32', stdio: 'inherit' }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

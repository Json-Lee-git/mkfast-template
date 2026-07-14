import { execFileSync } from 'node:child_process';

if (process.env.ALLOW_DIRTY_DEPLOY === '1') {
  console.warn(
    '[deploy guard] ALLOW_DIRTY_DEPLOY=1 set; skipping clean tree check.'
  );
  process.exit(0);
}

let status: string;

try {
  status = execFileSync('git', ['status', '--porcelain'], {
    encoding: 'utf8',
  }).trim();
} catch (err) {
  console.error('[deploy guard] Failed to read git status.');
  console.error(err);
  process.exit(1);
}

if (status) {
  console.error(
    [
      '[deploy guard] Refusing to deploy from a dirty working tree.',
      'Commit, stash, or intentionally discard local changes first.',
      'For an emergency-only override, run with ALLOW_DIRTY_DEPLOY=1.',
      '',
      status,
    ].join('\n')
  );
  process.exit(1);
}

console.log('[deploy guard] Working tree is clean.');

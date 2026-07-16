import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const authEntrypoints = [
  'src/routes/api/auth/$.ts',
  'src/middlewares/auth-middleware.ts',
  'src/middlewares/admin-middleware.ts',
  'src/middlewares/guest-middleware.ts',
];

describe('auth route initialization', () => {
  for (const entrypoint of authEntrypoints) {
    it(`loads Better Auth lazily from ${entrypoint}`, () => {
      const source = fs.readFileSync(path.resolve(entrypoint), 'utf8');

      expect(source).not.toMatch(
        /^import\s+\{\s*auth\s*\}\s+from\s+['"]@\/auth\/auth['"];?$/m
      );
      expect(source).toContain("await import('@/auth/auth')");
    });
  }
});

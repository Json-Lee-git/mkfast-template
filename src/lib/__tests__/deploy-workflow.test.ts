import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const workflowPath = path.resolve('.github/workflows/deploy.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

describe('Cloudflare deploy workflow', () => {
  it('validates and injects PUBLIC_SITE_URL without overriding Wrangler vars', () => {
    expect(workflow).toContain('Validate PUBLIC_SITE_URL');
    expect(workflow).toContain(
      'PUBLIC_SITE_URL: $' + '{{ secrets.PUBLIC_SITE_URL }}'
    );
    expect(workflow).toContain('run: pnpm exec wrangler deploy');
    expect(workflow).not.toMatch(/wrangler deploy[^\n]*--var/);
  });

  it('uses PUBLIC_SITE_URL as the build-time base URL source', () => {
    expect(workflow).toContain(
      'VITE_BASE_URL: $' + '{{ secrets.PUBLIC_SITE_URL }}'
    );
    expect(workflow).not.toContain(
      'VITE_BASE_URL: $' + '{{ secrets.VITE_BASE_URL }}'
    );
    expect(workflow).not.toMatch(/echo[^\n]*\$PUBLIC_SITE_URL/);
  });

  it('runs the built Worker smoke test before deployment', () => {
    const smokeIndex = workflow.indexOf('run: pnpm smoke:worker-ssr');
    const deployIndex = workflow.indexOf('run: pnpm exec wrangler deploy');

    expect(smokeIndex).toBeGreaterThan(-1);
    expect(deployIndex).toBeGreaterThan(smokeIndex);
  });
});

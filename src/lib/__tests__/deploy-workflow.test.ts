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
    expect(workflow).toContain('run: pnpx wrangler deploy');
    expect(workflow).not.toMatch(/wrangler deploy[^\n]*--var/);
  });
});

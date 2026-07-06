import { defineConfig } from 'vitest/config';
import path from 'node:path';

const src = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  resolve: {
    alias: { '@': src },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/creem-diagnostics.test.ts'],
  },
});

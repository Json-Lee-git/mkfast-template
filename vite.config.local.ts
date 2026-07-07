import { defineConfig, type Plugin } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'url';
import tailwindcss from '@tailwindcss/vite';
import contentCollections from '@content-collections/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolves extensionless ESM imports (e.g. `./util/assertString`)
 * commonly found in packages like `validator`. Node.js ESM requires
 * file extensions, but many npm packages omit them expecting a bundler.
 */
function fixExtensionlessImports(): Plugin {
  const tryExtensions = ['.js', '.mjs', '.cjs', '/index.js', '/index.mjs'];
  return {
    name: 'fix-extensionless-imports',
    enforce: 'pre',
    async resolveId(source, importer, _options) {
      // Only handle relative imports from node_modules
      if (!source.startsWith('.') || !importer) return null;
      // Check if importer is inside node_modules
      const normalizedImporter = importer.replace(/\\/g, '/');
      if (!normalizedImporter.includes('/node_modules/')) return null;

      const base = path.dirname(importer);
      const resolved = path.resolve(base, source);

      // If the file already exists with exact match, don't touch it
      if (fs.existsSync(resolved)) return null;

      // Try with extensions
      for (const ext of tryExtensions) {
        const candidate = resolved + ext;
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
      return null;
    },
  };
}

/**
 * Local-only Vite config — Cloudflare plugin removed to avoid
 * WebSocket connection issues behind restricted networks (GFW).
 * Server-side Cloudflare bindings (D1, AI, R2) are shimmed via
 * the cloudflare:workers alias.
 */
const config = defineConfig({
  server: {
    allowedHosts: ['.trycloudflare.com'],
    watch: {
      // Prevent infinite recompile loop from paraglide output
      ignored: ['**/src/locale/paraglide/**', '**/.wrangler/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'cloudflare:workers': fileURLToPath(
        new URL('./src/env/cloudflare-shim.ts', import.meta.url)
      ),
    },
  },
  plugins: [
    fixExtensionlessImports(),
    devtools({
      eventBusConfig: {
        port: 0,
      },
    }),
    tailwindcss(),
    contentCollections(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/locale/paraglide',
      strategy: ['url', 'cookie', 'baseLocale'],
      routeStrategies: [
        { match: '/api/:path(.*)?', exclude: true },
        { match: '/robots.txt', exclude: true },
        { match: '/sitemap.xml', exclude: true },
        { match: '/manifest.json', exclude: true },
      ],
      emitTsDeclarations: true,
      isServer: 'import.meta.env.SSR',
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'src',
      start: { entry: './start.tsx' },
      server: { entry: './server.ts' },
    }),
    viteReact(),
    // cloudflare plugin removed — incompatible with SOCKS5-only proxy
  ],
});

export default config;

/// <reference types="vitest" />
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { collectPrecacheAssets, injectPrecacheAssets } from './src/utils/swPrecache.ts';

// Vite가 만든 해시 번들을 public/sw.js의 프리캐시 목록에 주입함
function serviceWorkerPrecachePlugin(): Plugin {
  let publicSwPath = '';
  let outSwPath = '';
  let precacheAssets: string[] = [];

  return {
    name: 'sliding-puzzle-sw-precache',
    apply: 'build',
    configResolved(config) {
      publicSwPath = resolve(config.root, 'public/sw.js');
      outSwPath = resolve(config.root, config.build.outDir, 'sw.js');
    },
    generateBundle(_options, bundle) {
      precacheAssets = collectPrecacheAssets(Object.keys(bundle));
    },
    closeBundle() {
      const source = readFileSync(publicSwPath, 'utf8');
      writeFileSync(outSwPath, injectPrecacheAssets(source, precacheAssets));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorkerPrecachePlugin()],
  server: {
    port: 5173,
    open: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});

import viteReact from '@vitejs/plugin-react';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(async ({ command }) => ({
  plugins: [tsconfigPaths(), viteReact()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  esbuild: {
    tsconfigRaw: await fs.readFile(
      new URL(
        command === 'build' ? './tsconfig.app.build.json' : './tsconfig.json',
        import.meta.url,
      ),
      'utf8',
    ),
  },
  build: {
    minify: true,
    sourcemap: false,
    outDir: './dist/app',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
}));

import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    globals: true,
    include: ['src/**/*.spec.ts'],
    root: __dirname,
    setupFiles: ['vitest.setup.ts'],
  },
});

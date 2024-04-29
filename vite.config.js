import autoprefixer from 'autoprefixer';
import path, { resolve } from 'path';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import createSvgSpritePlugin from 'vite-plugin-svg-spriter';
import tsconfigPaths from 'vite-tsconfig-paths';

const SRC_PATH = path.resolve(__dirname, 'src');
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, 'shared/img/svg');

export default {
  base: '',
  build: {
    compact: false,
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  plugins: [
    createSvgSpritePlugin({ svgFolder: SVG_FOLDER_PATH }),
    ViteImageOptimizer({
      jpg: {
        quality: 85,
      },
      png: {
        quality: 85,
      },
      webp: {
        quality: 70,
      },
    }),
    tsconfigPaths(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  },
  test: {
    coverage: {
      reporter: ['html', 'text'],
    },
    environment: 'jsdom',
    globals: true,
  },
};

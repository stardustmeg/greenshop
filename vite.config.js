import autoprefixer from 'autoprefixer';
import path, { resolve } from 'path';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import createSvgSpritePlugin from 'vite-plugin-svg-spriter';
import tsconfigPaths from 'vite-tsconfig-paths';

const SRC_PATH = path.resolve(__dirname, 'src');
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, 'img');

export default {
  base: './',
  build: {
    compact: false,
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './src/index.html'),
      },
    },
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
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
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              cleanupIDs: {
                minify: false,
                remove: false,
              },
              convertPathData: false,
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
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
  publicDir: 'assets',
  root: 'src',
};

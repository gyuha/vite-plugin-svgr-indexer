import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import svgrIndexer from '../src/index';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['styled-jsx/babel']
      }
    }),
    svgr(),
    svgrIndexer({
      iconDirs: ['src/assets/icons'],
      indexFileName: 'index.ts',
      watch: true,
      recursive: true,
      componentPrefix: 'Icon',
    }) as any,
  ],
}); 
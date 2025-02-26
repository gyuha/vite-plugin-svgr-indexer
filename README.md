# vite-plugin-svgr-indexer

A Vite plugin that monitors SVG icon folders and automatically generates index.ts files.

## Installation

```bash
npm install vite-plugin-svgr-indexer --save-dev
# or
yarn add vite-plugin-svgr-indexer -D
# or
pnpm add vite-plugin-svgr-indexer -D
```

## Usage

```js
// vite.config.js / vite.config.ts
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import svgrIndexer from 'vite-plugin-svgr-indexer';

export default defineConfig({
  plugins: [
    svgr(), // Configure vite-plugin-svgr first
    svgrIndexer({
      // SVG icon directory paths to monitor (required)
      iconDirs: ['src/assets/icons'],
      // Name of the index file to generate (default: 'index.ts')
      indexFileName: 'index.ts',
      // Enable file watching (default: true)
      watch: true,
    }),
  ],
});
```

## Features

- Monitors SVG files in specified directories.
- Automatically generates index.ts files when SVG files are added, deleted, or modified.
- The generated index.ts file imports all SVG files as React components and exports them.

## Example

SVG file structure:
```
src/assets/icons/
  ├── arrow.svg
  ├── close.svg
  └── menu.svg
```

Generated index.ts:
```typescript
import Arrow from './arrow.svg?react';
import Close from './close.svg?react';
import Menu from './menu.svg?react';

export {
  Arrow,
  Close,
  Menu
};
```

## License

MIT 
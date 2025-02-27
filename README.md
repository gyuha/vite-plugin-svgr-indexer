# vite-plugin-svgr-indexer

A Vite plugin that monitors SVG icon folders and automatically generates index.ts files.

## Installation

```bash
npm install vite-plugin-svgr vite-plugin-svgr-indexer --save-dev
# or
yarn add vite-plugin-svgr vite-plugin-svgr-indexer -D
# or
pnpm add vite-plugin-svgr vite-plugin-svgr-indexer -D
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
      // Enable sub folder watching (default: true)
      recursive: true,
      // Prefix to add to component names (default: '')
      componentPrefix: 'Icon'
    }),
  ],
});
```

## TypeScript Support

If you're using TypeScript, add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-svgr/client"]
  }
}
```

or there is also a declaration helper for better type inference. Add the following to vite-env.d.ts:

```
/// <reference types="vite-plugin-svgr/client" />
```

This will provide proper type definitions for SVG imports.

## Features

- Monitors SVG files in specified directories.
- Automatically generates index.ts files when SVG files are added, deleted, or modified.
- The generated index.ts file imports all SVG files as React components and exports them.
- Creates separate index.ts files for each subdirectory, importing only the SVG files in that directory.
- Supports adding a prefix to component names (e.g., `Icon` prefix: `arrow.svg` → `IconArrow`).

## Example

SVG file structure:
```
src/assets/icons/
  ├── arrow.svg
  ├── close.svg
  ├── menu.svg
  └── navigation/
      ├── back.svg
      └── forward.svg
```

Generated index.ts in main directory:
```typescript
import IconArrow from './arrow.svg?react';
import IconClose from './close.svg?react';
import IconMenu from './menu.svg?react';

export {
  IconArrow,
  IconClose,
  IconMenu
};
```

Generated index.ts in navigation subdirectory:
```typescript
import IconBack from './back.svg?react';
import IconForward from './forward.svg?react';

export {
  IconBack,
  IconForward
};
```

## Usage in React Components

```tsx
// Import from main directory
import { IconClose, IconMenu } from './assets/icons';

// Import from subdirectory
import { IconBack } from './assets/icons/navigation';

function App() {
  return (
    <div>
      <IconClose />
      <IconMenu />
      <IconBack />
    </div>
  );
}
```

## License

MIT 
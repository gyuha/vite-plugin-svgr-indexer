# vite-plugin-svgr-indexer

SVG 아이콘 폴더를 감시하고 자동으로 index.ts 파일을 생성하는 Vite 플러그인입니다.

## 설치

```bash
npm install vite-plugin-svgr-indexer --save-dev
# 또는
yarn add vite-plugin-svgr-indexer -D
# 또는
pnpm add vite-plugin-svgr-indexer -D
```

## 사용법

```js
// vite.config.js / vite.config.ts
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import svgrIndexer from 'vite-plugin-svgr-indexer';

export default defineConfig({
  plugins: [
    svgr(), // vite-plugin-svgr 먼저 설정
    svgrIndexer({
      // 감시할 SVG 아이콘 폴더 경로 (필수)
      iconDirs: ['src/assets/icons'],
      // 생성할 인덱스 파일 이름 (기본값: 'index.ts')
      indexFileName: 'index.ts',
      // 감시 활성화 여부 (기본값: true)
      watch: true,
    }),
  ],
});
```

## 기능

- 지정된 폴더 내의 SVG 파일을 감시합니다.
- SVG 파일이 추가, 삭제, 변경될 때 자동으로 index.ts 파일을 생성합니다.
- 생성된 index.ts 파일은 모든 SVG 파일을 React 컴포넌트로 import하고 export합니다.

## 예시

SVG 파일 구조:
```
src/assets/icons/
  ├── arrow.svg
  ├── close.svg
  └── menu.svg
```

생성된 index.ts:
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

## 라이센스

MIT 
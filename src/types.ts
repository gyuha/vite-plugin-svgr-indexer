import { Plugin } from 'vite';

export interface SvgrIndexerOptions {
  /**
   * SVG 아이콘이 위치한 디렉토리 경로 배열
   * @default []
   */
  iconDirs: string[];

  /**
   * 생성할 인덱스 파일 이름
   * @default 'index.ts'
   */
  indexFileName?: string;

  /**
   * 파일 변경 감시 활성화 여부
   * @default true
   */
  watch?: boolean;
}

export interface SvgrIndexerPlugin extends Plugin {
  name: 'vite-plugin-svgr-indexer';
  configResolved: () => Promise<void>;
} 
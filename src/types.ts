import { Plugin } from 'vite';

export interface SvgrIndexerOptions {
  /**
   * Array of directory paths where SVG icons are located
   * @default []
   */
  iconDirs: string[];

  /**
   * Name of the index file to generate
   * @default 'index.ts'
   */
  indexFileName?: string;

  /**
   * Enable file change monitoring
   * @default true
   */
  watch?: boolean;

  /**
   * Generate index files recursively for all subdirectories
   * @default true
   */
  recursive?: boolean;
}

export interface SvgrIndexerPlugin extends Plugin {
  name: 'vite-plugin-svgr-indexer';
  configResolved: () => Promise<void>;
} 
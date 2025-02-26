import fs from "fs";
import path from "path";
import { Plugin } from "vite";
import chokidar from "chokidar";
import fg from "fast-glob";
import { SvgrIndexerOptions, SvgrIndexerPlugin } from "./types";

/**
 * SVG 파일명에서 컴포넌트 이름을 생성합니다.
 * 예: 'arrow-down.svg' -> 'ArrowDown'
 */
function getComponentName(fileName: string): string {
  // 파일 확장자 제거
  const baseName = path.basename(fileName, ".svg");

  // 파일명을 단어로 분리하고 각 단어의 첫 글자를 대문자로 변환
  return baseName
    .split(/[-_\s]+/)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * 지정된 디렉토리에서 SVG 파일 목록을 가져옵니다.
 */
async function getSvgFiles(dir: string): Promise<string[]> {
  const pattern = path.join(dir, "**/*.svg");
  return fg(pattern, { onlyFiles: true });
}

/**
 * index.ts 파일을 생성합니다.
 */
async function generateIndexFile(
  iconDir: string,
  indexFileName: string
): Promise<void> {
  const svgFiles = await getSvgFiles(iconDir);

  if (svgFiles.length === 0) {
    return;
  }

  // 상대 경로로 변환
  const relativePaths = svgFiles.map((file) => path.relative(iconDir, file));

  // import 문 생성
  const imports = relativePaths.map((file) => {
    const componentName = getComponentName(path.basename(file));
    // 경로에서 확장자를 제거하고 ?react 쿼리 추가
    const importPath = "./" + file.replace(/\.svg$/, ".svg?react");
    return `import ${componentName} from '${importPath}';`;
  });

  // export 문 생성
  const componentNames = relativePaths.map((file) =>
    getComponentName(path.basename(file))
  );

  const exportStatement = `export {\n  ${componentNames.join(",\n  ")}\n};`;

  // 최종 파일 내용
  const fileContent = `${imports.join("\n")}\n\n${exportStatement}\n`;

  // 파일 저장
  const indexFilePath = path.join(iconDir, indexFileName);
  fs.writeFileSync(indexFilePath, fileContent, "utf-8");

  console.log(`[vite-plugin-svgr-indexer] Generated ${indexFilePath}`);
}

/**
 * SVG 아이콘 인덱서 플러그인
 */
export default function svgrIndexer(
  options: SvgrIndexerOptions
): SvgrIndexerPlugin {
  const { iconDirs = [], indexFileName = "index.ts", watch = true } = options;

  if (!iconDirs || iconDirs.length === 0) {
    throw new Error("[vite-plugin-svgr-indexer] iconDirs option is required");
  }

  const plugin: SvgrIndexerPlugin = {
    name: "vite-plugin-svgr-indexer",

    async configResolved() {
      // 각 아이콘 디렉토리에 대해 초기 인덱스 파일 생성
      for (const dir of iconDirs) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`[vite-plugin-svgr-indexer] Created directory: ${dir}`);
        }

        await generateIndexFile(dir, indexFileName);
      }

      // 파일 변경 감시 설정
      if (watch) {
        for (const dir of iconDirs) {
          const watcher = chokidar.watch(path.join(dir, "**/*.svg"), {
            ignoreInitial: true,
            persistent: true,
          });

          const handleChange = async () => {
            await generateIndexFile(dir, indexFileName);
          };

          watcher.on("add", handleChange);
          watcher.on("unlink", handleChange);
          watcher.on("change", handleChange);

          console.log(
            `[vite-plugin-svgr-indexer] Watching for changes in ${dir}`
          );
        }
      }
    },
  };

  return plugin;
}

// 타입 내보내기
export * from "./types";

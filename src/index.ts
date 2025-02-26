import fs from "fs";
import path from "path";
import { Plugin } from "vite";
import chokidar from "chokidar";
import fg from "fast-glob";
import { SvgrIndexerOptions, SvgrIndexerPlugin } from "./types";

/**
 * Creates a component name from an SVG filename.
 * Example: 'arrow-down.svg' -> 'ArrowDown'
 */
function getComponentName(fileName: string): string {
  // Remove file extension
  const baseName = path.basename(fileName, ".svg");

  // Split the filename into words and capitalize the first letter of each word
  return baseName
    .split(/[-_\s]+/)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Gets a list of SVG files from the specified directory.
 */
async function getSvgFiles(dir: string): Promise<string[]> {
  const pattern = path.join(dir, "**/*.svg");
  return fg(pattern, { onlyFiles: true });
}

/**
 * Generates the index.ts file.
 */
async function generateIndexFile(
  iconDir: string,
  indexFileName: string
): Promise<void> {
  const svgFiles = await getSvgFiles(iconDir);

  if (svgFiles.length === 0) {
    return;
  }

  // Convert to relative paths
  const relativePaths = svgFiles.map((file) => path.relative(iconDir, file));

  // Generate import statements
  const imports = relativePaths.map((file) => {
    const componentName = getComponentName(path.basename(file));
    // Remove extension from path and add ?react query
    const importPath = "./" + file.replace(/\.svg$/, ".svg?react");
    return `import ${componentName} from '${importPath}';`;
  });

  // Generate export statement
  const componentNames = relativePaths.map((file) =>
    getComponentName(path.basename(file))
  );

  const exportStatement = `export {\n  ${componentNames.join(",\n  ")}\n};`;

  // Final file content
  const fileContent = `${imports.join("\n")}\n\n${exportStatement}\n`;

  // Save the file
  const indexFilePath = path.join(iconDir, indexFileName);
  fs.writeFileSync(indexFilePath, fileContent, "utf-8");

  console.log(`[vite-plugin-svgr-indexer] Generated ${indexFilePath}`);
}

/**
 * SVG Icon Indexer Plugin
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
      // Generate initial index files for each icon directory
      for (const dir of iconDirs) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`[vite-plugin-svgr-indexer] Created directory: ${dir}`);
        }

        await generateIndexFile(dir, indexFileName);
      }

      // Set up file change monitoring
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

// Export types
export * from "./types";

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
function getComponentName(fileName: string, prefix: string = ""): string {
  // Remove file extension
  const baseName = path.basename(fileName, ".svg");

  // Split the filename into words and capitalize the first letter of each word
  const componentName = baseName
    .split(/[-_\s]+/)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
    
  return prefix + componentName;
}

/**
 * Gets a list of SVG files from the specified directory.
 */
async function getSvgFiles(dir: string, recursive: boolean = false): Promise<string[]> {
  const pattern = recursive 
    ? path.join(dir, "**/*.svg") 
    : path.join(dir, "*.svg");
  return fg(pattern, { onlyFiles: true });
}

/**
 * Gets all subdirectories from the specified directory.
 */
async function getSubdirectories(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(dir, entry.name));
}

/**
 * Generates the index.ts file for a specific directory.
 */
async function generateIndexFileForDir(
  dir: string,
  indexFileName: string,
  recursive: boolean = false,
  componentPrefix: string = ""
): Promise<void> {
  // Get SVG files in the current directory only (not recursive)
  const svgFiles = await getSvgFiles(dir, false);

  if (svgFiles.length === 0 && !recursive) {
    return;
  }

  // Convert to relative paths
  const relativePaths = svgFiles.map((file) => path.relative(dir, file));

  // Generate import statements
  const imports = relativePaths.map((file) => {
    const componentName = getComponentName(path.basename(file), componentPrefix);
    // Remove extension from path and add ?react query
    const importPath = "./" + file.replace(/\.svg$/, ".svg?react");
    return `import ${componentName} from '${importPath}';`;
  });

  // Generate export statement
  const componentNames = relativePaths.map((file) =>
    getComponentName(path.basename(file), componentPrefix)
  );

  let fileContent = "";
  
  if (imports.length > 0) {
    const exportStatement = `export {\n  ${componentNames.join(",\n  ")}\n};`;
    fileContent = `${imports.join("\n")}\n\n${exportStatement}\n`;
  } else {
    fileContent = "// No SVG files in this directory\n";
  }

  // Save the file
  const indexFilePath = path.join(dir, indexFileName);
  fs.writeFileSync(indexFilePath, fileContent, "utf-8");

  console.log(`[vite-plugin-svgr-indexer] Generated ${indexFilePath}`);
  
  // If recursive, process subdirectories
  if (recursive) {
    const subdirs = await getSubdirectories(dir);
    for (const subdir of subdirs) {
      await generateIndexFileForDir(subdir, indexFileName, true, componentPrefix);
    }
  }
}

/**
 * SVG Icon Indexer Plugin
 */
export default function svgrIndexer(
  options: SvgrIndexerOptions
): SvgrIndexerPlugin {
  const { 
    iconDirs = [], 
    indexFileName = "index.ts", 
    watch = true,
    recursive = true,
    componentPrefix = ""
  } = options;

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

        await generateIndexFileForDir(dir, indexFileName, recursive, componentPrefix);
      }

      // Set up file change monitoring
      if (watch) {
        for (const dir of iconDirs) {
          const watcher = chokidar.watch(path.join(dir, "**/*.svg"), {
            ignoreInitial: true,
            persistent: true,
          });

          const handleChange = async (changedFile: string) => {
            // Get the directory of the changed file
            const fileDir = path.dirname(changedFile);
            // Generate index file for that specific directory
            await generateIndexFileForDir(fileDir, indexFileName, false, componentPrefix);
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

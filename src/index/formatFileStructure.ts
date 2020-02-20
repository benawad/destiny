import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";
import logger from "../shared/logger";

/** The main process when calling `destiny run [folder]` */
export const formatFileStructure = async (
  rootDirFiles: string[][],
  filesToEdit: string[]
) => {
  const rootOptions: RootOption[] = [];
  const unusedFiles: string[] = [];

  logger.info("Generating a graph and fractal tree.");
  for (const startingFiles of rootDirFiles) {
    if (startingFiles.length <= 1) continue;

    const { graph, files, useForwardSlash, parentFolder } = buildGraph(
      startingFiles
    );
    const entryPoints = findEntryPoints(graph);
    const tree = toFractalTree(graph, entryPoints);

    rootOptions.push({
      tree,
      useForwardSlash,
      parentFolder,
    });

    // This pattern allows skips over deeply nested paths,
    // returning only paths that exist at this level.
    const usedFiles = new Set<string>(Object.entries(graph).flat(2));

    for (const file of files) {
      const isUnusedFile = !usedFiles.has(file);
      if (isUnusedFile) unusedFiles.push(file);
    }
  }

  logger.info("Fixing imports.");
  await fixImports(filesToEdit, rootOptions);

  for (const { tree, parentFolder } of rootOptions) {
    logger.info("Moving files.");
    await moveFiles(tree, parentFolder);
    removeEmptyFolders(parentFolder);
  }

  if (unusedFiles.length) {
    const unusedFilesMulti = unusedFiles.map(indent).join("\n");
    logger.warn("Unused files:" + "\n" + unusedFilesMulti);
  }

  logger.info("Successfully restructured!");
};

const indent = (value: any) => " ".repeat(8) + value;

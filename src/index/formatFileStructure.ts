import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";
import logger from "../shared/logger";

export const formatFileStructure = async (
  rootDirFiles: string[][],
  filesToEdit: string[]
) => {
  const unusedFiles: string[] = [];
  const rootOptions: RootOption[] = [];

  for (const startingFiles of rootDirFiles) {
    if (startingFiles.length <= 1) {
      continue;
    }

    logger.info("Generating a graph and fractal tree.");

    const { graph, files, useForwardSlash, parentFolder } = buildGraph(
      startingFiles
    );
    const tree = toFractalTree(graph, findEntryPoints(graph));
    const usedFiles = new Set(Object.entries(graph).flat(2));

    rootOptions.push({
      tree,
      useForwardSlash,
      parentFolder,
    });

    files.forEach(file => {
      if (!usedFiles.has(file)) {
        unusedFiles.push(file);
      }
    });
  }

  logger.info("Fixing imports.");
  await fixImports(filesToEdit, rootOptions);

  for (const { tree, parentFolder } of rootOptions) {
    logger.info("Moving files.");
    await moveFiles(tree, parentFolder);
    removeEmptyFolders(parentFolder);
  }

  if (unusedFiles.length) {
    logger.warn("Unused files:");
    unusedFiles.forEach(f => console.log(" ", f));
  }

  logger.info("Successfully restructured!");
};

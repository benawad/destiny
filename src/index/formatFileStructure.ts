import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";
import logger from "../shared/logger";

export const formatFileStructure = async (
  restructureMap: { [key: string]: string[] },
  filesToEdit: string[]
) => {
  const unusedFiles: string[] = [];
  const rootOptions: RootOption[] = [];

  for (const rootPath in restructureMap) {
    const filePaths = restructureMap[rootPath];

    if (filePaths.length <= 1) {
      continue;
    }

    logger.info("Generating a graph and fractal tree.");

    const { graph, files, useForwardSlash, parentFolder } = buildGraph(
      filePaths
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

  if (unusedFiles.length > 0) {
    logger.warn(
      `Found ${unusedFiles.length} unused files:` +
        "\n" +
        unusedFiles.map(file => " ".repeat(8) + file).join("\n")
    );
  }

  logger.info("Restructure was successful!");
};

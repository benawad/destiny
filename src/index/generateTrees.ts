import logger from "../shared/logger";
import printTree from "./printTree";
import { RootOption as Root } from "./shared/RootOption";
import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { toFractalTree } from "./formatFileStructure/toFractalTree";

export function generateTrees(restructureMap: { [key: string]: string[] }) {
  return Object.entries(restructureMap).reduce<Root[]>(
    (rootOptions, [rootPath, filePaths]) => {
      if (filePaths.length <= 1) return rootOptions;

      logger.info(`Generating tree for: ${rootPath}`);

      const { graph, files, useForwardSlash, parentFolder } = buildGraph(
        filePaths
      );
      const tree = toFractalTree(graph, findEntryPoints(graph));

      const usedFilePaths = new Set(Object.entries(graph).flat(2));
      const unusedFiles = files.filter(
        filePath => !usedFilePaths.has(filePath)
      );

      logger.log(rootPath);
      printTree(Object.values(tree));
      if (unusedFiles.length > 0) {
        logger.warn(
          `Found ${unusedFiles.length} unused files:` +
            "\n" +
            unusedFiles.join("\n")
        );
      }

      rootOptions.push({
        parentFolder,
        tree,
        useForwardSlash,
      });

      return rootOptions;
    },
    []
  );
}

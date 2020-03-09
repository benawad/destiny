import chalk from "chalk";

import logger from "../shared/logger";
import printTree from "./generateTrees/printTree";
import { RootOption as Root } from "./shared/RootOption";
import { buildGraph } from "./generateTrees/buildGraph";
import { findEntryPoints } from "./generateTrees/findEntryPoints";
import { toFractalTree } from "./generateTrees/toFractalTree";
import { detectLonelyFiles } from "./shared/detect-lonely-files";
import { Config } from "../index";

export function generateTrees(
  restructureMap: { [key: string]: string[] },
  { avoidSingleFile }: Config
) {
  return Object.entries(restructureMap).reduce<Root[]>(
    (rootOptions, [rootPath, filePaths]) => {
      if (filePaths.length <= 1) return rootOptions;

      logger.info(`Generating tree for: ${rootPath}`);

      const { graph, files, useForwardSlash, parentFolder } = buildGraph(
        filePaths
      );

      let tree = toFractalTree(graph, findEntryPoints(graph));

      if (avoidSingleFile) {
        tree = detectLonelyFiles(tree);
      }

      const usedFilePaths = new Set(Object.entries(graph).flat(2));
      const unusedFiles = files.filter(
        filePath => !usedFilePaths.has(filePath)
      );

      logger.log(chalk.bold.blue(rootPath));
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

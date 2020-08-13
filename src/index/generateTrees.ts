import path from "path";
import chalk from "chalk";

import logger from "../shared/logger";
import printTree from "./generateTrees/printTree";
import { RootOption as Root } from "./shared/RootOption";
import { buildGraph } from "./generateTrees/buildGraph";
import { findEntryPoints } from "./generateTrees/findEntryPoints";
import { toFractalTree } from "./generateTrees/toFractalTree";
import { detectLonelyFiles } from "./shared/detect-lonely-files";
import { Config } from "../index";
import { isTestFile } from "./generateTrees/shared/isTestFile";

const getRootFolder = (parentDir: string) => parentDir.split(path.sep).pop();

export function generateTrees(
  restructureMap: { [key: string]: string[] },
  { avoidSingleFile }: Config
) {
  return Object.entries(restructureMap).reduce<Root[]>(
    (rootOptions, [rootPath, filePaths]) => {
      if (filePaths.length <= 1) return rootOptions;

      logger.info(`Generating tree for: ${rootPath}`);

      const { graph, parentFolder } = buildGraph(filePaths);

      const entryPoints = findEntryPoints(graph);
      let tree = toFractalTree(graph, entryPoints);

      if (avoidSingleFile) {
        tree = detectLonelyFiles(tree);
      }

      // entryPoints that don't import anything might be unused??
      // @todo let user ignore some of these
      const unusedFiles = entryPoints.filter(
        filePath =>
          !isTestFile(filePath) &&
          !filePath.endsWith(".snap") &&
          !filePath.endsWith(".d.ts") &&
          !graph[filePath].length
      );

      logger.log(chalk.bold.blue(getRootFolder(parentFolder)));
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
      });

      return rootOptions;
    },
    []
  );
}

import path from "path";

import logger from "../../shared/logger";
import { Graph } from "./shared/Graph";
import { customResolve } from "../shared/customResolve";
import { findImports } from "../shared/findImports";
import { findSharedParent } from "./shared/findSharedParent";

const isFilePathIgnored = (filePath: string) => {
  const ignoreList = [/^\.git/];

  return ignoreList.some(re => re.test(filePath));
};

/** Build graph of all file paths and their own imports. */
export function buildGraph(filePaths: string[]) {
  const parentFolder = findSharedParent(filePaths);
  const graph: Graph = {};
  const totalFiles: string[] = [];

  for (let filePath of filePaths) {
    if (isFilePathIgnored(filePath)) continue;

    filePath = path.resolve(filePath);

    const start = path.relative(parentFolder, filePath);
    totalFiles.push(start);

    findImports(filePath).forEach(importPath => {
      const pathWithExtension = customResolve(
        importPath,
        path.dirname(filePath)
      );

      if (pathWithExtension == null) {
        logger.error(`Cannot find import ${importPath} for ${filePath}`);
        return;
      }

      const end = path.relative(parentFolder, pathWithExtension);

      if (!Array.isArray(graph[start])) {
        graph[start] = [];
      }
      if (!graph[start].includes(end)) {
        graph[start].push(end);
      }
    });
  }

  return {
    files: totalFiles,
    graph,
    parentFolder,
    useForwardSlash: path.sep === "/",
  };
}

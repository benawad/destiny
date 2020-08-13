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

    if (!Array.isArray(graph[start])) {
      graph[start] = [];
    }

    findImports(filePath).forEach(_import => {
      const pathWithExtension = customResolve(
        _import.path,
        path.dirname(filePath)
      );

      if (pathWithExtension == null) {
        logger.error(`Cannot find import ${_import.path} for ${filePath}`);
        return;
      }

      const end = path.relative(parentFolder, pathWithExtension);

      if (!graph[start].includes(end)) {
        graph[start].push(end);
      }
    });
  }

  return {
    files: totalFiles,
    graph,
    parentFolder,
  };
}

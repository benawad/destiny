import path from "path";

import logger from "../../shared/logger";
import { Graph, OldGraph } from "./shared/Graph";
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
  const oldGraph: OldGraph = {};
  const totalFiles: string[] = [];
  let numForwardSlashes = 0;
  let numBackSlashes = 0;

  for (let filePath of filePaths) {
    if (isFilePathIgnored(filePath)) continue;

    filePath = path.resolve(filePath);

    const start = path.relative(parentFolder, filePath);
    if (oldGraph.start == null) {
      oldGraph[start] = {
        oldLocation: filePath,
        imports: [],
      };
    }

    totalFiles.push(start);
    findImports(filePath).forEach(importPath => {
      if (importPath.includes("/")) {
        numForwardSlashes++;
      } else if (importPath.includes("\\")) {
        numBackSlashes++;
      }

      const pathWithExtension = customResolve(
        importPath,
        path.dirname(filePath)
      );

      if (pathWithExtension == null) {
        logger.error(`Cannot find import ${importPath}`);
        return;
      }

      const end = path.relative(parentFolder, pathWithExtension);

      if (!Array.isArray(graph[start])) {
        graph[start] = [];
      }
      if (!graph[start].includes(end)) {
        graph[start].push(end);
      }

      oldGraph[start].imports.push({
        text: importPath,
        resolved: end,
      });
    });
  }

  return {
    files: totalFiles,
    graph,
    oldGraph,
    parentFolder,
    useForwardSlash: numForwardSlashes >= numBackSlashes,
  };
}

import path from "path";
import { findEdges } from "./shared/findEdges";
import { addEdgeToGraph } from "./buildGraph/addEdge";
import { Graph, OldGraph } from "./shared/Graph";
import { findSharedParent } from "./shared/findSharedParent";
import { customResolve } from "./shared/customResolve";
import OS from "os";

/** Builds a graph for a particular set of files. */
export function buildGraph(files: string[]) {
  const parentFolder = findSharedParent(files);
  const graph: Graph = {};
  const oldGraph: OldGraph = {};
  const totalFiles: string[] = [];

  let numForwardSlashes = 0;
  let numBackSlashes = 0;

  for (let filePath of files) {
    if (filePath === ".git") continue;

    filePath = path.resolve(filePath);
    const start = path.relative(parentFolder, filePath);
    totalFiles.push(start);

    const startNotInitialized = !(start in oldGraph);
    if (startNotInitialized) {
      oldGraph[start] = { oldLocation: filePath, imports: [] };
    }

    for (const edge of findEdges(filePath)) {
      const [first, last] = edge;

      if (last.includes("/")) numForwardSlashes++;
      else if (last.includes("\\")) numBackSlashes++;

      const pathWithExtension = customResolve(last, path.dirname(first));

      const end = path.relative(parentFolder, pathWithExtension);
      addEdgeToGraph([start, end], graph);
      oldGraph[start].imports.push({ text: last, resolved: end });
    }
  }

  return {
    parentFolder,
    graph,
    files: totalFiles,
    oldGraph,
    useForwardSlash: numForwardSlashes >= numBackSlashes,
  };
}

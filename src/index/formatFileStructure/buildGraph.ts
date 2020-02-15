import path from "path";
import { findEdges } from "./buildGraph/findEdges";
import { addEdge } from "./buildGraph/addEdge";
import { Graph, OldGraph } from "./shared/Graph";
import { resolveExtensionAndIndex } from "./buildGraph/resolveExtensionAndIndex";
import { importToAbsolutePath } from "./buildGraph/importToAbsolutePath";
import { findSharedParent } from "./toFractalTree/findSharedParent";

// assumes files are absolute
export function buildGraph(files: string[], throwIfCannotBeResolved = false) {
  const parentFolder = findSharedParent(files);
  const graph: Graph = {};
  const oldGraph: OldGraph = {};
  const totalFiles: string[] = [];
  let numForwardSlashes = 0;
  let numBackSlashes = 0;
  for (const file of files) {
    if (file === ".git") {
      continue;
    }
    const start = path.relative(parentFolder, file);
    if (!(start in oldGraph)) {
      oldGraph[start] = {
        oldLocation: file,
        imports: [],
      };
    }
    totalFiles.push(start);
    findEdges(file).forEach(edge => {
      if (edge[1].includes("/")) {
        numForwardSlashes++;
      } else if (edge[1].includes("\\")) {
        numBackSlashes++;
      }

      const pathWithExtension = resolveExtensionAndIndex(
        importToAbsolutePath(edge[0], edge[1])
      );

      let end;
      if (!pathWithExtension) {
        const msg = "Could not resolve import: " + edge;
        if (throwIfCannotBeResolved) {
          throw new Error(msg);
        } else {
          console.log(msg);
        }
        return;
      } else {
        end = path.relative(parentFolder, pathWithExtension);
      }

      addEdge([start, end], graph);

      oldGraph[start].imports.push({
        text: edge[1],
        resolved: end,
      });
    });
  }

  return {
    parentFolder,
    graph,
    files: totalFiles,
    oldGraph,
    useForwardSlash: numForwardSlashes >= numBackSlashes ? true : false,
  };
}

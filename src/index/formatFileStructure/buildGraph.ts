import fs from "fs";
import path from "path";
import { findEdges } from "./buildGraph/findEdges";
import { addEdge } from "./buildGraph/addEdge";
import { Graph, OldGraph } from "./shared/Graph";
import { resolveExtensionAndIndex } from "./buildGraph/resolveExtensionAndIndex";
import { importToAbsolutePath } from "./buildGraph/importToAbsolutePath";

export function buildGraph(
  folderPath: string,
  throwIfCannotBeResolved = false
) {
  const graph: Graph = {};
  const oldGraph: OldGraph = {};
  const totalFiles: string[] = [];
  let numForwardSlashes = 0;
  let numBackSlashes = 0;
  const recurse = (currentFolderPath: string) => {
    const files = fs.readdirSync(currentFolderPath);
    // console.log(currentFolderPath, files);
    for (const file of files) {
      if (file === ".git") {
        continue;
      }
      // console.log(file);
      const fullPath = path.resolve(path.join(currentFolderPath, file));
      const start = path.relative(folderPath, fullPath);
      if (!(start in oldGraph)) {
        oldGraph[start] = {
          oldLocation: fullPath,
          imports: [],
        };
      }
      // check if it's a file if it has an extension
      if (fs.lstatSync(fullPath).isFile()) {
        totalFiles.push(start);
        findEdges(fullPath).forEach(edge => {
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
            end = path.relative(folderPath, pathWithExtension);
          }

          addEdge([start, end], graph);

          oldGraph[start].imports.push({
            text: edge[1],
            resolved: end,
          });
        });
      } else {
        recurse(fullPath);
      }
    }
  };
  recurse(folderPath);
  return {
    graph,
    files: totalFiles,
    oldGraph,
    useForwardSlash: numForwardSlashes >= numBackSlashes ? true : false,
  };
}

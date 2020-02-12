import fs from "fs";
import path from "path";
import { findEdges } from "./findEdges";
import { addEdge } from "./addEdge";
import { Graph, OldGraph } from "./Graph";
import { resolveExtensionAndIndex } from "./resolveExtensionAndIndex";
import { importToAbsolutePath } from "./importToAbsolutePath";

export function buildGraph(folderPath: string) {
  const graph: Graph = {};
  const oldGraph: OldGraph = {};
  const totalFiles: string[] = [];
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
        oldGraph[start] = { oldLocation: fullPath, imports: [] };
      }
      // check if it's a file if it has an extension
      if (fs.lstatSync(fullPath).isFile()) {
        findEdges(fullPath).forEach(edge => {
          const pathWithExtension = resolveExtensionAndIndex(
            importToAbsolutePath(edge[0], edge[1])
          );

          let end;
          if (!pathWithExtension) {
            console.log("Could not resolve import: ", edge);
            return;
          } else {
            end = path.relative(folderPath, pathWithExtension);
          }

          addEdge([start, end], graph);

          oldGraph[start].imports.push({
            text: edge[1],
            resolved: end
          });
        });
      } else {
        // console.log("recurse: ", fullPath);
        recurse(fullPath);
      }
      totalFiles.push(file);
    }
  };
  recurse(folderPath);
  return { graph, files: totalFiles, oldGraph };
}

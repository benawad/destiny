import fs from "fs";
import path from "path";
import { findEdges } from "./findEdges";
import { addEdge } from "./addEdge";
import { Graph } from "./Graph";

export function buildGraph(folderPath: string) {
  const graph: Graph = {};
  // const importGraph: Graph = {};
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
      // console.log("l: ", fullPath, fs.lstatSync(fullPath).isFile());
      // check if it's a file if it has an extension
      if (fs.lstatSync(fullPath).isFile()) {
        findEdges(fullPath).map(edge => {
          addEdge(edge, graph, folderPath);
          // addEdge(edge, importGraph);
        });
      } else {
        // console.log("recurse: ", fullPath);
        recurse(fullPath);
      }
      totalFiles.push(file);
    }
  };
  recurse(folderPath);
  return { graph, files: totalFiles };
}

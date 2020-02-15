import { buildGraph } from "./index/buildGraph";
import { findEntryPoints } from "./index/findEntryPoints";
import { syncFileSystem } from "./index/syncFileSystem";
import { toFractalTree } from "./index/toFractalTree";
import { removeEmptyFolders } from "./index/removeEmptyFolders";
import { flatten } from "./shared/flatten";
export const formatFileStructure = async (start: string) => {
  const { graph, oldGraph, files, useForwardSlash } = buildGraph(start);
  const tree = toFractalTree(graph, findEntryPoints(graph));
  await syncFileSystem({
    originalGraph: oldGraph,
    newStructure: tree,
    destination: start,
    useForwardSlashes: useForwardSlash,
    startingFolder: start,
  });
  removeEmptyFolders(start);
  const usedFiles = new Set([
    ...Object.keys(graph),
    ...flatten(Object.values(graph)),
  ]);
  const unusedFiles: string[] = [];
  files.forEach(file => {
    if (!usedFiles.has(file)) {
      unusedFiles.push(file);
    }
  });
  if (unusedFiles.length) {
    console.log("unused files:");
    unusedFiles.forEach(f => console.log(f));
  }
};

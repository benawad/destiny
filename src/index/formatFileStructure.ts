import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { flatten } from "./formatFileStructure/flatten";
import { fixImports } from "./fixImports";

export const formatFileStructure = async (
  startingFiles: string[],
  filesToFixImports: string[]
) => {
  const { graph, files, useForwardSlash, parentFolder } = buildGraph(
    startingFiles
  );
  const tree = toFractalTree(graph, findEntryPoints(graph));
  await fixImports(filesToFixImports, parentFolder, tree, useForwardSlash);
  await moveFiles(tree, parentFolder);
  removeEmptyFolders(parentFolder);
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

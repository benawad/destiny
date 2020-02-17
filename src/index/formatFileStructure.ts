import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";

export const formatFileStructure = async (
  rootDirFiles: string[][],
  filesToEdit: string[]
) => {
  const unusedFiles: string[] = [];
  const rootOptions: RootOption[] = [];
  for (const startingFiles of rootDirFiles) {
    if (startingFiles.length <= 1) {
      continue;
    }
    const { graph, files, useForwardSlash, parentFolder } = buildGraph(
      startingFiles
    );
    const tree = toFractalTree(graph, findEntryPoints(graph));
    const usedFiles = new Set(Object.entries(graph).flat(2));

    rootOptions.push({
      tree,
      useForwardSlash,
      parentFolder,
    });

    files.forEach(file => {
      if (!usedFiles.has(file)) {
        unusedFiles.push(file);
      }
    });
  }

  await fixImports(filesToEdit, rootOptions);
  for (const { tree, parentFolder } of rootOptions) {
    await moveFiles(tree, parentFolder);
    removeEmptyFolders(parentFolder);
  }

  if (unusedFiles.length) {
    console.log("unused files:");
    unusedFiles.forEach(f => console.log(f));
  }
};

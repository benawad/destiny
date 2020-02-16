import { buildGraph } from "./formatFileStructure/buildGraph";
import { findEntryPoints } from "./formatFileStructure/findEntryPoints";
import { moveFiles } from "./formatFileStructure/moveFiles";
import { toFractalTree } from "./formatFileStructure/toFractalTree";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";

/*
  rootDirFiles: [
    ['pages/index.js', 'pages/register.js'],
    ['utils/search.js', 'utils/helper.js']
  ]
*/
export const formatFileStructure = async (
  rootDirFiles: string[][],
  filesToFixImports: string[]
) => {
  const unusedFiles: string[] = [];
  const rootOptions: RootOption[] = [];
  for (const startingFiles of rootDirFiles) {
    if (!startingFiles.length) {
      continue;
    }
    const { graph, files, useForwardSlash, parentFolder } = buildGraph(
      startingFiles
    );
    const tree = toFractalTree(graph, findEntryPoints(graph));
    rootOptions.push({
      tree,
      useForwardSlash,
      parentFolder,
    });
    const usedFiles = new Set([
      ...Object.keys(graph),
      ...Object.values(graph).flat(),
    ]);
    files.forEach(file => {
      if (!usedFiles.has(file)) {
        unusedFiles.push(file);
      }
    });
  }
  await fixImports(filesToFixImports, rootOptions);
  for (const { tree, parentFolder } of rootOptions) {
    await moveFiles(tree, parentFolder);
    removeEmptyFolders(parentFolder);
  }
  if (unusedFiles.length) {
    console.log("unused files:");
    unusedFiles.forEach(f => console.log(f));
  }
};

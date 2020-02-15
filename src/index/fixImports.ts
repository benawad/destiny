import { readFileSync, writeFileSync } from "fs-extra";
import resolve from "resolve";
import { findEdges } from "./formatFileStructure/buildGraph/findEdges";
import path from "path";
import { makeImportPath } from "./formatFileStructure/syncFileSystem/fixImports/makeImportPath";

export const fixImports = (
  files: string[],
  parentFolder: string,
  newStructure: Record<string, string>,
  useForwardSlashes: boolean
) => {
  for (const file of files) {
    const imports = findEdges(file);
    if (!imports.length) {
      continue;
    }

    const basedir = path.dirname(file);

    const ogText = readFileSync(file).toString();
    // deep copy
    let newText = ogText.repeat(1);
    for (const imp of imports) {
      const absPath = resolve.sync(imp[1], { basedir });
      const pathInGraph = path.relative(parentFolder, absPath);
      const newPath = newStructure[pathInGraph];
      if (!newPath) {
        continue;
      }

      newText = newText.replace(
        imp[1],
        makeImportPath(file, path.resolve(newPath), useForwardSlashes)
      );
    }
    if (newText !== ogText) {
      writeFileSync(file, newText);
    }
  }
};

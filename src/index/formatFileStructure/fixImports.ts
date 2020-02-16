import { readFileSync, writeFileSync } from "fs-extra";
import { findEdges } from "./shared/findEdges";
import path from "path";
import { makeImportPath } from "./fixImports/makeImportPath";
import { customResolve } from "./shared/customResolve";

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
    let newFilePath = newStructure[path.relative(parentFolder, file)];

    if (newFilePath) {
      newFilePath = path.resolve(path.join(parentFolder, newFilePath));
    } else {
      newFilePath = file;
    }

    const ogText = readFileSync(file).toString();
    // deep copy
    let newText = ogText.repeat(1);
    for (const imp of imports) {
      const absPath = customResolve(imp[1], basedir);
      const pathInGraph = path.relative(parentFolder, absPath);
      const newPath = newStructure[pathInGraph];
      if (!newPath) {
        continue;
      }

      newText = newText.replace(
        imp[1],
        makeImportPath(
          newFilePath,
          path.resolve(path.join(parentFolder, newPath)),
          useForwardSlashes
        )
      );
    }
    if (newText !== ogText) {
      writeFileSync(file, newText);
    }
  }
};

import { readFileSync, writeFileSync } from "fs-extra";
import { findEdges } from "./shared/findEdges";
import path from "path";
import { makeImportPath } from "./fixImports/makeImportPath";
import { customResolve } from "./shared/customResolve";
import { RootOption } from "../shared/RootOption";

const getNewFilePath = (file: string, rootOptions: RootOption[]) => {
  for (const { tree, parentFolder } of rootOptions) {
    const key = path.relative(parentFolder, file);
    if (key in tree) {
      return path.resolve(path.join(parentFolder, tree[key]));
    }
  }

  return file;
};

const getNewImportPath = (
  absImportPath: string,
  newFilePath: string,
  rootOptions: RootOption[]
) => {
  let lastUseForwardSlash = true;
  for (const { tree, parentFolder, useForwardSlash } of rootOptions) {
    lastUseForwardSlash = useForwardSlash;
    const key = path.relative(parentFolder, absImportPath);
    if (key in tree) {
      return makeImportPath(
        newFilePath,
        path.resolve(path.join(parentFolder, tree[key])),
        useForwardSlash
      );
    }
  }

  return makeImportPath(newFilePath, absImportPath, lastUseForwardSlash);
};

export const fixImports = (files: string[], rootOptions: RootOption[]) => {
  for (const file of files) {
    const imports = findEdges(file);
    if (!imports.length) {
      continue;
    }

    const basedir = path.dirname(file);
    const newFilePath = getNewFilePath(file, rootOptions);

    const ogText = readFileSync(file).toString();
    // deep copy
    let newText = ogText.repeat(1);
    for (const imp of imports) {
      const absPath = customResolve(imp[1], basedir);
      const newImportText = getNewImportPath(absPath, newFilePath, rootOptions);

      if (newImportText) {
        newText = newText
          .replace(`'${imp[1]}'`, `'${newImportText}'`)
          .replace(`"${imp[1]}"`, `"${newImportText}"`);
      }
    }
    if (newText !== ogText) {
      writeFileSync(file, newText);
    }
  }
};

import { readFileSync, writeFileSync } from "fs-extra";
import { findEdges } from "../shared/findEdges";
import path from "path";
import { makeImportPath } from "./fixImports/makeImportPath";
import { customResolve } from "../shared/customResolve";
import { RootOption } from "../shared/RootOption";
import logger from "../../shared/logger";

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

export const fixImports = (filePaths: string[], rootOptions: RootOption[]) => {
  for (const filePath of filePaths) {
    const imports = findEdges(filePath);

    if (!imports.length) continue;

    const basedir = path.dirname(filePath);
    const newFilePath = getNewFilePath(filePath, rootOptions);
    const ogText = readFileSync(filePath).toString();

    let newText = ogText.repeat(1);
    for (const imp of imports) {
      const absPath = customResolve(imp[1], basedir);

      if (absPath == null) {
        logger.error(`Cannot find import ${imp[1]}`);
        continue;
      }

      const newImportText = getNewImportPath(absPath, newFilePath, rootOptions);

      if (newImportText) {
        newText = newText
          .replace(`'${imp[1]}'`, `'${newImportText}'`)
          .replace(`"${imp[1]}"`, `"${newImportText}"`);
      }
    }

    if (newText !== ogText) {
      writeFileSync(filePath, newText);
    }
  }
};

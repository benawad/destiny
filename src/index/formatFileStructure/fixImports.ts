import { readFileSync, writeFileSync } from "fs-extra";
import { findImports } from "../shared/findImports";
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
    logger.debug(`checking imports of "${filePath}"`);
    const importPaths = findImports(filePath);

    if (importPaths.length === 0) {
      logger.debug(`no import found in "${filePath}"`);
      continue;
    }

    const basedir = path.dirname(filePath);
    const newFilePath = getNewFilePath(filePath, rootOptions);
    const ogText = readFileSync(filePath).toString();

    let newText = ogText.repeat(1);
    for (const importPath of importPaths) {
      const absPath = customResolve(importPath, basedir);

      if (absPath == null) {
        logger.error(`Cannot find import ${importPath} for ${basedir}`);
        continue;
      }

      const newImportPath = getNewImportPath(absPath, newFilePath, rootOptions);

      if (newImportPath != null && importPath !== newImportPath) {
        logger.debug(
          `replacing import of "${importPath}" by "${newImportPath}" in "${filePath}"`
        );

        newText = newText
          .replace(`'${importPath}'`, `'${newImportPath}'`)
          .replace(`"${importPath}"`, `"${newImportPath}"`);
      }
    }

    if (newText !== ogText) {
      logger.debug(`writing new imports of "${filePath}"`);
      writeFileSync(filePath, newText);
    }
  }
};

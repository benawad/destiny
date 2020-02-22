import { readFileSync, writeFileSync } from "fs-extra";
import { findEdges } from "./shared/findEdges";
import path from "path";
import { makeImportPath } from "./fixImports/makeImportPath";
import { customResolve } from "./shared/customResolve";
import { RootOption } from "../shared/RootOption";

export function fixImports(files: string[], rootOptions: RootOption[]) {
  for (const file of files) {
    const imports = findEdges(file);
    if (imports.length === 0) continue;

    // deep copy
    const { newContents, originalContents } = createNewContentsFromImports({
      file,
      imports,
      rootOptions,
    });

    if (newContents !== originalContents) writeFileSync(file, newContents);
  }
}

interface CreateNewContentsFromImports {
  file: string;
  imports: [string, string][];
  rootOptions: RootOption[];
}

function createNewContentsFromImports({
  file,
  imports,
  rootOptions,
}: CreateNewContentsFromImports) {
  const basedir = path.dirname(file);
  const newFilePath = getNewFilePath(file, rootOptions);
  const originalContents = readFileSync(file).toString();

  let newContents = originalContents.repeat(1);
  for (const imp of imports) {
    const absPath = customResolve(imp[1], basedir);
    const newImportText = getNewImportPath(absPath, newFilePath, rootOptions);
    const importingSelf = !newImportText;
    if (importingSelf) continue;
    newContents = newContents
      .replace(`'${imp[1]}'`, `'${newImportText}'`)
      .replace(`"${imp[1]}"`, `"${newImportText}"`);
  }

  return { newContents, originalContents };
}

function getNewFilePath(file: string, rootOptions: RootOption[]) {
  for (const { tree, parentFolder } of rootOptions) {
    const key = path.relative(parentFolder, file);
    const keyless = !(key in tree);
    if (keyless) continue;
    return path.resolve(path.join(parentFolder, tree[key]));
  }
  return file;
}

function getNewImportPath(
  absImportPath: string,
  newFilePath: string,
  rootOptions: RootOption[]
) {
  let lastUseForwardSlash = true;
  for (const { tree, parentFolder, useForwardSlash } of rootOptions) {
    lastUseForwardSlash = useForwardSlash;
    const key = path.relative(parentFolder, absImportPath);
    const keyless = !(key in tree);
    if (keyless) continue;
    return makeImportPath(
      newFilePath,
      path.resolve(path.join(parentFolder, tree[key])),
      useForwardSlash
    );
  }

  return makeImportPath(newFilePath, absImportPath, lastUseForwardSlash);
}

import fs from "fs";

/** Find all imports for file path. */
export function findImports(filePath: string) {
  const reImport = /(?:(?:import|from)\s+|(?:import|require)\s*\()['"]((?:\.{1,2})(?:\/.+)?)['"]/gm;
  const reComment = /\/\*[^]*?\*\/|^.*\/\/.*$/gm;
  const importPaths: string[] = [];
  const fileContent = fs
    .readFileSync(filePath, { encoding: "utf8" })
    .replace(reComment, "");

  let matches;
  while ((matches = reImport.exec(fileContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches.
    if (matches.index === reImport.lastIndex) {
      reImport.lastIndex++;
    }
    importPaths.push(matches[1]);
  }

  return importPaths;
}

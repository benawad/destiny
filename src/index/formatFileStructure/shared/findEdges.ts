import fs from "fs";

/**
 * Finds all edges in the file,
 * with an edge being the relative path of an import
 * from the filePath.
 */
export function findEdges(filePath: string) {
  const importRegex = /(?:(?:from|import)\s+["'](\.[^'"]*)["'])|(?:(?:require|import)\s*\(["'](\.[^'"]*)["']\))/gm;
  const commentRegex = /\/\*[^]*?\*\/|^.*\/\/.*$/gm;
  const edges: Array<[string, string]> = [];
  const fileContent = fs
    .readFileSync(filePath, { encoding: "utf8" })
    .toString()
    .replace(commentRegex, "");

  let matches;
  while ((matches = importRegex.exec(fileContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches.
    if (matches.index === importRegex.lastIndex) {
      importRegex.lastIndex++;
    }
    const importMatch = matches[1];
    const requireMatch = matches[2];
    edges.push([filePath, importMatch || requireMatch]);
  }

  return edges;
}

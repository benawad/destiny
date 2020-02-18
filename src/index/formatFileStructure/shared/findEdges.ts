import fs from "fs";

export function findEdges(filePath: string) {
  const importRegex = /(?:(?:from|import)\s+["'](\.[^'"]*)["'])|(?:(?:require|import)\(["'](\.[^'"]*)["']\))/gm;
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
    edges.push([filePath, matches[1] || matches[2]]);
  }

  return edges;
}

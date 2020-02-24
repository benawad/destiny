import path from "path";


/** Find the common parent directory between all paths. */
export const findSharedParent = (paths: string[]) => {
  if (paths.length === 1) return path.dirname(paths[0]);

  const parentPaths: string[] = [];
  const parts: string[][] = paths.map(x => x.split("/"));
  const firstParts = parts[0];


  firstParts.forEach((part, idx) => {
    const allPartsMatch = parts.every(p => p[idx] === part);

    if (allPartsMatch) {
      parentPaths.push(part);
    }
  });
  
  return parentPaths.join("/");
};

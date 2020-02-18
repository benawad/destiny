import path from "path";

export const findSharedParent = (paths: string[]) => {
  if (paths.length === 1) return path.dirname(paths[0]);

  const fragments: string[][] = paths.map(x => x.split("/"));
  const parentPaths: string[] = [];

  for (let i = 0; i < fragments[0].length; i++) {
    const fragment = fragments[0][i];

    if (fragments.every(f => f.length > i && f[i] === fragment)) {
      parentPaths.push(fragment);
    }
  }

  return parentPaths.join("/");
};

import path from "path";

export const findSharedParent = (paths: string[]) => {
  if (paths.length === 1) {
    return path.dirname(paths[0]);
  }
  const parts: string[][] = paths.map(x => x.split("/"));
  const parentPath: string[] = [];
  for (let i = 0; i < parts[0].length; i++) {
    const v = parts[0][i];
    if (!parts.every(part => part.length > i && part[i] === v)) {
      break;
    }
    parentPath.push(v);
  }
  return parentPath.join("/");
};

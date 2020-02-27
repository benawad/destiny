import path from "path";

/** Find the common parent directory between all paths. */
export const findSharedParent = (paths: string[]) => {
  if (paths.length === 1) return path.dirname(paths[0]);

  const [shortest, secondShortest] =
    paths.length > 2 ? paths.sort((a, b) => a.length - b.length) : paths;

  const secondShortestParts = secondShortest.split("/");
  const parentPaths: string[] = [];

  let index = 0;
  for (const part of shortest.split("/")) {
    if (part === secondShortestParts[index++]) {
      parentPaths.push(part);
    }
  }

  return parentPaths.join("/");
};

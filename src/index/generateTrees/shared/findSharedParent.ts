import path from "path";

/** Find the common parent directory between all paths. */
export const findSharedParent = (paths: string[]) => {
  const [firstPath] = paths;
  if (paths.length === 1) return path.dirname(firstPath);

  const [shortest, secondShortest] = paths.sort((a, b) => a.length - b.length);

  const parentPaths: string[] = [];
  const [shortestParts, secondShortestParts] = [
    shortest,
    secondShortest,
  ].map(x => x.split("/"));

  shortestParts.forEach((part, idx) => {
    if (part === secondShortestParts[idx]) {
      parentPaths.push(part);
    }
  });

  return parentPaths.join("/");
};

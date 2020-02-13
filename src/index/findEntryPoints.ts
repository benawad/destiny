import { Graph } from "./shared/Graph";

export function findEntryPoints(graph: Graph) {
  const importedFiles = new Set(Object.values(graph).flat());
  const possibleEntryPoints = Object.keys(graph);
  const entryPoints = possibleEntryPoints.filter(
    file => !importedFiles.has(file)
  );

  if (entryPoints.length) {
    return entryPoints;
  }

  const levelMap: Record<number, string[]> = {};

  possibleEntryPoints.forEach(k => {
    const n = k.split("/").length;

    if (!(n in levelMap)) {
      levelMap[n] = [];
    }

    levelMap[n].push(k);
  });

  for (let i = 1; i < 10; i++) {
    if (i in levelMap) {
      return levelMap[i];
    }
  }

  return [];
}

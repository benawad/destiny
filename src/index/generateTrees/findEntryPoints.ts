import { Graph } from "./shared/Graph";
import { isTestFile } from "./shared/isTestFile";

const invertGraph = (graph: Graph) => {
  const invertedGraph: Graph = {};
  Object.entries(graph).forEach(([filePath, imports]) => {
    imports.forEach(importPath => {
      if (!(importPath in invertedGraph)) {
        invertedGraph[importPath] = [];
      }

      invertedGraph[importPath].push(filePath);
    });
  });

  return invertedGraph;
};

export function findEntryPoints(graph: Graph) {
  const invertedGraph = invertGraph(graph);
  const possibleEntryPoints = Object.keys(graph);
  const entryPoints = possibleEntryPoints.filter(file => {
    const importedBy = invertedGraph[file];
    if (!importedBy || !importedBy.length) {
      return true;
    }

    return importedBy.every(x => isTestFile(x));
  });

  if (entryPoints.length) {
    return entryPoints;
  }

  const levelMap: Record<number, string[]> = {};

  possibleEntryPoints.forEach(filePath => {
    const n = filePath.split("/").length;

    if (!(n in levelMap)) {
      levelMap[n] = [];
    }

    levelMap[n].push(filePath);
  });

  for (let i = 1; i < 10; i++) {
    if (i in levelMap) {
      return levelMap[i];
    }
  }

  return [];
}

import { Graph } from "./shared/Graph";
import { isTestFile } from "./shared/isTestFile";

const invertGraph = (graph: Graph) => {
  const invertedGraph: Graph = {};
  Object.keys(graph).forEach(k => {
    graph[k].forEach(v => {
      if (!(v in invertedGraph)) {
        invertedGraph[v] = [];
      }

      invertedGraph[v].push(k);
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

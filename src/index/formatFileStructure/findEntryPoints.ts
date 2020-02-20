import { Graph } from "./shared/Graph";
import { isTestFile } from "./shared/isTestFile";

function createInvertedGraph(graph: Graph) {
  const invertedGraph: Graph = {};
  const starts = Object.keys(graph);

  for (const start of starts) {
    const ends = graph[start];
    for (const end of ends) {
      const endMissing = !(end in invertedGraph);
      if (endMissing) invertedGraph[end] = [];
      invertedGraph[end].push(start);
    }
  }
  return invertedGraph;
}

export function findEntryPoints(graph: Graph) {
  const invertedGraph = createInvertedGraph(graph);
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

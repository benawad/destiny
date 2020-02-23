import { Graph } from "./shared/Graph";
import { isTestFile } from "./shared/isTestFile";

function createInvertedGraph(graph: Graph) {
  const invertedGraph: Graph = {};
  const iterableGraph = Object.entries(graph);

  for (const [start, ends] of iterableGraph) {
    for (const end of ends) {
      if (!(end in invertedGraph)) {
        invertedGraph[end] = [];
      }
      invertedGraph[end].push(start);
    }
  }
  return invertedGraph;
}

export function findEntryPoints(graph: Graph) {
  const invertedGraph = createInvertedGraph(graph);
  const possibleEntryPoints = Object.keys(graph);

  const entryPoints = possibleEntryPoints.filter(filePath => {
    const importedBy = invertedGraph[filePath];
    if (!importedBy || !importedBy.length) return true;
    return importedBy.every(x => isTestFile(x));
  });

  if (entryPoints.length) return entryPoints;

  const levelMap: Record<number, string[]> = {};

  for (const entryPoint of possibleEntryPoints) {
    const n = entryPoint.split("/").length;
    const nMissing = !(n in levelMap);
    if (nMissing) levelMap[n] = [];
    levelMap[n].push(entryPoint);
  }

  for (let i = 1; i < 10; i++) {
    if (i in levelMap) return levelMap[i];
  }

  return [];
}

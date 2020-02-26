import { Graph } from "../shared/Graph";

export function addEdgeToGraph([start, end]: [string, string], graph: Graph) {
  if (!(start in graph)) {
    graph[start] = [];
  }
  if (graph[start].includes(end)) return;
  graph[start].push(end);
}

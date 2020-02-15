import { Graph } from "../shared/Graph";

export function addEdge([start, end]: [string, string], graph: Graph) {
  if (!(start in graph)) {
    graph[start] = [];
  }
  graph[start].push(end);
}

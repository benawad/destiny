import { Graph } from "../shared/Graph";

/** Adds an edge to the graph, adding the start if it doesn't already exist. */
export function addEdgeToGraph([start, end]: [string, string], graph: Graph) {
  if (!(start in graph)) {
    graph[start] = [];
  }
  graph[start].push(end);
}

//@todo — Needs a better name.
export function indexConditional(name: string, upperFolder: string) {
  return name === "index" && upperFolder !== "" && upperFolder !== ".";
}

import { Graph } from "../shared/Graph";

/** Recursively checks if the node has circular dependencies with it's structure. */
export const hasCycle = (
  node: string,
  graph: Graph,
  visited: Set<string> = new Set()
): string[] | null => {
  const edges = graph[node] || [];

  if (visited.has(node)) return [...visited, node];
  visited.add(node);

  for (const edge of edges) {
    const cycle = hasCycle(edge, graph, new Set(visited));
    if (cycle) return cycle;
  }

  return null;
};

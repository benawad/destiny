import { Graph } from "../shared/Graph";

export const hasCycle = (
  node: string,
  graph: Graph,
  visited: Set<string>
): string[] | null => {
  const edges = graph[node];

  if (visited.has(node)) {
    return [...visited, node];
  }
  visited.add(node);

  if (edges == null || edges.length === 0) return null;
  for (const edge of edges) {
    const cycle = hasCycle(edge, graph, new Set(visited));

    if (cycle) return cycle;
  }

  return null;
};

import { Graph } from "../shared/Graph";
export const hasCycle = (
  node: string,
  graph: Graph,
  visited: Set<string>
): string[] | null => {
  if (visited.has(node)) {
    return [...visited, node];
  }
  visited.add(node);
  const edges = graph[node];
  if (!edges || !edges.length) {
    return null;
  }
  for (const edge of edges) {
    const cycle = hasCycle(edge, graph, new Set(visited));
    if (cycle) {
      return cycle;
    }
  }
  return null;
};

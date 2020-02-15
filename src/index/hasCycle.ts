import { Graph } from "./shared/Graph";
export const hasCycle = (
  node: string,
  graph: Graph,
  visited: Set<string>
): string[] | null => {
  if (visited.has(node)) {
    return [...visited, node];
  }
  const edges = graph[node];
  if (!edges || !edges.length) {
    return null;
  }
  visited.add(node);
  for (const edge of edges) {
    const cycle = hasCycle(edge, graph, visited);
    if (cycle) {
      return cycle;
    }
  }
  return null;
};

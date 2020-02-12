import { Graph } from "./Graph";
import path from "path";
import { resolveExtensionAndIndex } from "./resolveExtensionAndIndex";
import { importToAbsolutePath } from "./importToAbsolutePath";

export function addEdge(
  [start, end]: [string, string],
  graph: Graph,
  folderPath: string
) {
  const key = path.relative(folderPath, start);
  if (!(key in graph)) {
    graph[key] = [];
  }

  // console.log('addEdge: ', start, end)

  const pathWithExtension = resolveExtensionAndIndex(
    importToAbsolutePath(start, end)
  );

  if (!pathWithExtension) {
    console.log("Could not resolve import: ", end);
  } else {
    graph[key].push(path.relative(folderPath, pathWithExtension));
  }
}

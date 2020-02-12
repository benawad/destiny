import { Graph } from "./Graph";
import path from "path";
import { resolveExtensionAndIndex } from "./resolveExtensionAndIndex";
import { importToAbsolutePath } from "./importToAbsolutePath";

export function addEdge(
  [start, end]: [string, string],
  graph: Graph,
  folderPath?: string
) {
  const key = folderPath ? path.relative(folderPath, start) : start;
  if (!(key in graph)) {
    graph[key] = [];
  }

  // if (folderPath) {
  //   console.log("----");
  //   console.log(folderPath);
  //   console.log(start, end);
  //   console.log(importToAbsolutePath(start, end));
  //   console.log(resolveExtensionAndIndex(importToAbsolutePath(start, end)));
  //   console.log(
  //     path.relative(
  //       folderPath,
  //       resolveExtensionAndIndex(importToAbsolutePath(start, end))
  //     )
  //   );
  // }

  graph[key].push(
    folderPath
      ? path.relative(
          folderPath,
          resolveExtensionAndIndex(importToAbsolutePath(start, end))
        )
      : end
  );
}

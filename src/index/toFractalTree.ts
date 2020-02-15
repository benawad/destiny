import { Graph } from "./shared/Graph";
import path from "path";
import { hasCycle } from "./hasCycle";
import { findSharedParent } from "./findSharedParent";

export function toFractalTree(graph: Graph, entryPoints: string[]) {
  const done: Record<string, string> = {};
  const deps: Record<string, string[]> = {};
  let containsCycle = false;

  const fn = (filePath: string, folderPath: string, graph: Graph) => {
    let folderName = path.basename(filePath, path.extname(filePath));
    const basenameWithExt = path.basename(filePath);
    const upperFolder = path.dirname(filePath);
    // ../package.json
    // keep globals where they are
    const location = filePath.includes("..")
      ? filePath
      : path.join(
          folderPath,
          folderName === "index" && upperFolder && upperFolder !== "."
            ? upperFolder + path.extname(filePath)
            : basenameWithExt
        );
    folderName = path.basename(location, path.extname(location));
    done[filePath] = location;
    const imports = graph[filePath];
    if (imports && imports.length) {
      const newDestination = path.join(folderPath, folderName);
      for (const importFilePath of imports) {
        if (importFilePath in done) {
          const cycle = hasCycle(importFilePath, graph, new Set());
          if (cycle) {
            containsCycle = true;
            console.log("Cycle detected:", cycle.join(" -> "));
          } else {
            if (!(importFilePath in deps)) {
              deps[importFilePath] = [];
            }

            deps[importFilePath].push(location);
          }
          continue;
        }

        if (!(importFilePath in deps)) {
          deps[importFilePath] = [];
        }
        deps[importFilePath].push(location);

        // console.log("import: ", importFilePath, newDestination);
        fn(importFilePath, newDestination, graph);
      }
    }
  };

  for (const filePath of entryPoints) {
    fn(filePath, "", graph);
  }

  if (!containsCycle) {
    Object.entries(deps).forEach(([k, v]) => {
      if (v.length > 1) {
        const parent = findSharedParent(v);
        const filename = path.basename(k);
        done[k] = path.join(parent, "shared", filename);
      }
    });
  }

  return done;
}

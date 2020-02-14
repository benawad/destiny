import { Graph } from "./shared/Graph";
import path from "path";

const hasCycle = (node: string, graph: Graph, visited: Set<string>) => {
  if (visited.has(node)) {
    return true;
  }

  const edges = graph[node];

  if (!edges || !edges.length) {
    return false;
  }
  visited.add(node);
  for (const edge of edges) {
    if (hasCycle(edge, graph, visited)) {
      return true;
    }
  }

  return false;
};

const findSharedParent = (paths: string[]) => {
  const parts: string[][] = paths.map(x => x.split("/"));
  const parentPath: string[] = [];

  for (let i = 0; i < parts[0].length; i++) {
    const v = parts[0][i];
    if (!parts.every(part => part.length > i && part[i] === v)) {
      break;
    }
    parentPath.push(v);
  }

  return parentPath.join("/");
};

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
          if (hasCycle(importFilePath, graph, new Set())) {
            containsCycle = true;
            console.log("Cycle detected");
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

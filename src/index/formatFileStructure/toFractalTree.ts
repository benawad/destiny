import path from "path";

import logger from "../../shared/logger";
import { Graph } from "./shared/Graph";
import { findSharedParent } from "./shared/findSharedParent";
import { hasCycle } from "./toFractalTree/hasCycle";
import { isTestFile } from "./shared/isTestFile";

export function toFractalTree(graph: Graph, entryPoints: string[]) {
  const res: Record<string, string> = {};
  const dependencies: Record<string, string[]> = {};
  const testFiles = new Set<string>();
  let containsCycle = false;

  const addDependency = (key: string, location: string) => {
    if (!Array.isArray(dependencies[key])) {
      dependencies[key] = [];
    }
    dependencies[key].push(location);
  };

  const checkDuplicates = (
    location: string,
    dirname: string,
    filePath: string
  ) => {
    let newLocation;

    if (Object.values(res).includes(location)) {
      newLocation = path.join(dirname, filePath.replace(/\//g, "-"));
      logger.info(`File renamed: ${filePath} -> ${newLocation}`);
    }

    return newLocation ?? location;
  };

  const fn = (filePath: string, folderPath: string, graph: Graph) => {
    const basenameWithExt = path.basename(filePath);
    if (isTestFile(basenameWithExt)) {
      testFiles.add(filePath);
      return;
    }
    let folderName = path.basename(filePath, path.extname(filePath));
    const upperFolder = path.basename(path.dirname(filePath));
    const isGlobal = filePath.includes("..");
    let location = isGlobal
      ? filePath
      : path.join(
          folderPath,
          folderName === "index" && upperFolder && upperFolder !== "."
            ? upperFolder + path.extname(filePath)
            : basenameWithExt
        );

    location = checkDuplicates(location, folderPath, filePath);
    folderName = path.basename(location, path.extname(location));

    if (!isGlobal) {
      res[filePath] = location;
    }
    const imports = graph[filePath];

    if (imports?.length > 0) {
      const newDestination = path.join(folderPath, folderName);

      for (const importFilePath of imports) {
        if (importFilePath in res) {
          const cycle = hasCycle(importFilePath, graph, new Set());

          if (cycle) {
            containsCycle = true;
            logger.warn(`Dependency cycle detected: ${cycle.join(" -> ")}`);
          } else {
            addDependency(importFilePath, location);
          }
          continue;
        }

        addDependency(importFilePath, location);
        fn(importFilePath, newDestination, graph);
      }
    }
  };

  for (const filePath of entryPoints) {
    fn(filePath, "", graph);
  }

  if (!containsCycle) {
    Object.entries(dependencies).forEach(([k, v]) => {
      if (v.length > 1 && !k.includes("..")) {
        const parent = findSharedParent(v);
        const filename = path.basename(k);
        const upperFolder = path.basename(path.dirname(k));

        res[k] = path.join(
          parent,
          "shared",
          path.basename(filename, path.extname(filename)) === "index" &&
            upperFolder &&
            upperFolder !== "."
            ? upperFolder + path.extname(filename)
            : filename
        );
      }
    });
  }

  if (testFiles.size > 0) {
    const globalTests = [];

    for (const testFile of testFiles) {
      const [firstRelativeImport] = graph[testFile];
      if (!firstRelativeImport) {
        globalTests.push(testFile);
        continue;
      }

      const testFilePath = res[firstRelativeImport];
      if (testFilePath) {
        let location = path.join(
          path.dirname(testFilePath),
          path.basename(testFile)
        );

        location = checkDuplicates(
          location,
          path.dirname(testFilePath),
          testFile
        );
        res[testFile] = location;
      }
    }
  }

  return res;
}

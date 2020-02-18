import { Graph } from "./shared/Graph";
import path from "path";
import { hasCycle } from "./toFractalTree/hasCycle";
import { findSharedParent } from "./shared/findSharedParent";
import { isTestFile } from "./shared/isTestFile";
import logger from "../../shared/logger";

export function toFractalTree(graph: Graph, entryPoints: string[]) {
  const done: Record<string, string> = {};
  const deps: Record<string, string[]> = {};
  let containsCycle = false;
  const testFiles = new Set<string>();

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

    // Check for duplicates
    if (Object.values(done).includes(location)) {
      location = path.join(folderPath, filePath.replace(/\//g, "-"));
      console.log(`file renamed: ${filePath} -> ${location}`);
    }
    folderName = path.basename(location, path.extname(location));
    // ../package.json
    // don't need to move global files
    if (!isGlobal) {
      done[filePath] = location;
    }
    const imports = graph[filePath];
    if (imports && imports.length) {
      const newDestination = path.join(folderPath, folderName);
      for (const importFilePath of imports) {
        if (importFilePath in done) {
          const cycle = hasCycle(importFilePath, graph, new Set());
          if (cycle) {
            containsCycle = true;
            logger.warn(`Cycle detected: ${cycle.join(" -> ")}`);
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
      if (v.length > 1 && !k.includes("..")) {
        const parent = findSharedParent(v);
        const filename = path.basename(k);
        const upperFolder = path.basename(path.dirname(k));
        done[k] = path.join(
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

  if (testFiles.size) {
    const globalTests = [];
    for (const testFile of testFiles) {
      // assuming this is the main thing your testing
      const [firstRelativeImport] = graph[testFile];
      if (!firstRelativeImport) {
        globalTests.push(testFile);
        continue;
      }

      const fileToTestPath = done[firstRelativeImport];
      if (fileToTestPath) {
        let location = path.join(
          path.dirname(fileToTestPath),
          path.basename(testFile)
        );
        // Check for duplicates
        if (Object.values(done).includes(location)) {
          location = path.join(
            path.dirname(fileToTestPath),
            testFile.replace(/\//g, "-")
          );
          console.log(`file renamed: ${testFile} -> ${location}`);
        }
        done[testFile] = location;
      }
    }
  }

  return done;
}

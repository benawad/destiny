import path from "path";

import { checkDuplicatesInTree } from "./checkDuplicatesInTree";
import { Graph } from "../shared/Graph";
import { FractalTree } from "./createFractalProperties";

export function ifTestFilesExist(
  testFiles: Set<string>,
  graph: Graph,
  tree: FractalTree
) {
  // not being used currently.
  // but returning in function for later.
  const globalTests = [];

  for (const testFile of testFiles) {
    const [firstRelativeImport] = graph[testFile];
    if (!firstRelativeImport) {
      globalTests.push(testFile);
      continue;
    }

    const testFilePath = tree[firstRelativeImport];
    if (!testFilePath) continue;

    const location = path.join(
      path.dirname(testFilePath),
      path.basename(testFile)
    );

    const newLocation = checkDuplicatesInTree({
      location,
      dirname: path.dirname(testFilePath),
      filePath: testFile,
      tree,
    });

    tree[testFile] = newLocation;
  }

  return { globalTests };
}

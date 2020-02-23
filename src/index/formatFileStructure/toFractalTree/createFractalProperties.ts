import path from "path";
import logger from "../../../shared/logger";
import { Graph } from "../shared/Graph";
import { isTestFile } from "../shared/isTestFile";
import { getPathProperties } from "./getFolderName";
import { hasCycle } from "./hasCycle";

/** Property is the name, value is the name. */
export type FractalTree = Record<string, string>;

/** A list of dependencies for each fileName. */
export type DependenciesTree = Record<string, string[]>;

/** An entry point to recursively create properties. */
export function createFractalProperties(graph: Graph, entryPoints: string[]) {
  const mutable: MutableParams = {
    containsCycle: false,
    dependencies: {},
    testFiles: new Set<string>(),
    tree: {},
  };

  for (const filePath of entryPoints) {
    recursiveFractalProperties({ filePath, graph }, mutable);
  }
  return mutable;
}

interface RecursiveParams {
  filePath: string;
  folderPath?: string;
  graph: Graph;
}

interface MutableParams {
  containsCycle: boolean;
  dependencies: DependenciesTree;
  testFiles: Set<string>;
  tree: FractalTree;
}

/** Recursively constructs the tree and additional properties. */
function recursiveFractalProperties(
  { filePath, folderPath = "", graph }: RecursiveParams,
  mutable: MutableParams
) {
  const basenameWithExt = path.basename(filePath);

  if (isTestFile(basenameWithExt)) {
    mutable.testFiles.add(filePath);
    return;
  }

  const { folderName, filePathIsGlobal, location } = getPathProperties({
    basenameWithExt,
    filePath,
    folderPath,
    tree: mutable.tree,
  });

  if (!filePathIsGlobal) mutable.tree[filePath] = location;

  const { hasImports, imports } = getImportsFromGraph(graph, filePath);
  if (!hasImports) return mutable;

  const newDestination = path.join(folderPath, folderName);

  const addDependency = createAddDependency(mutable.dependencies);

  // if import exist, do loop.
  for (const importFilePath of imports) {
    const importInTree = importFilePath in mutable.tree;
    if (importInTree) {
      const cycle = hasCycle(importFilePath, graph);
      if (cycle !== null) {
        mutable.containsCycle = true;
        logDependencyCycle(cycle);
        continue;
      }
    }
    addDependency(importFilePath, location);
    recursiveFractalProperties(
      { filePath: importFilePath, folderPath: newDestination, graph },
      mutable
    );
  }
  return mutable;
}

function logDependencyCycle(cycle: string[]) {
  logger.warn(`Dependency cycle detected: ${cycle.join(" -> ")}`);
}

function getImportsFromGraph(graph: Graph, filePath: string) {
  const imports = graph[filePath] || [];
  const hasImports = imports.length > 0;
  return { imports, hasImports };
}

/** returns a function that adds a dependency to the dependencies object. */
export function createAddDependency(dependencyIndex: Record<string, string[]>) {
  return (fileName: string, dependency: string) => {
    const is = fileName in dependencyIndex;
    if (!is) dependencyIndex[fileName] = [];
    dependencyIndex[fileName].push(dependency);
  };
}

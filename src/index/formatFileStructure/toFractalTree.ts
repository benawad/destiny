import { Graph } from "./shared/Graph";
import { createFractalProperties } from "./toFractalTree/createFractalProperties";
import { ifTestFilesExist } from "./toFractalTree/ifTestFilesExist";
import { notACycle } from "./toFractalTree/notACycle";

/** Property is the name, value is the name. */
export type FractalTree = Record<string, string>;

/** A list of dependencies for each fileName. */
export type DependenciesTree = Record<string, string[]>;

export function toFractalTree(graph: Graph, entryPoints: string[]) {
  // tree is what is returned

  const {
    containsCycle,
    dependencies,
    testFiles,
    tree,
  } = createFractalProperties(graph, entryPoints);

  // if no cycle, then create shared folders.
  // add it to tree
  if (!containsCycle) notACycle(dependencies, tree);

  // if test files exist...
  if (testFiles.size > 0) ifTestFilesExist(testFiles, graph, tree);

  return tree;
}

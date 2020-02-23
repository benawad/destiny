import { Graph } from "./shared/Graph";
import { createFractalProperties } from "./toFractalTree/createFractalProperties";
import { ifTestFilesExist } from "./toFractalTree/ifTestFilesExist";
import { addDependencyToTree } from "./toFractalTree/notACycle";

export function toFractalTree(graph: Graph, entryPoints: string[]) {
  const {
    containsCycle,
    dependencies,
    testFiles,
    tree,
  } = createFractalProperties(graph, entryPoints);

  // if no cycle, then create shared folders.
  // add it to tree
  if (!containsCycle) addDependencyToTree(dependencies, tree);

  if (testFiles.size > 0) ifTestFilesExist(testFiles, graph, tree);

  return tree;
}

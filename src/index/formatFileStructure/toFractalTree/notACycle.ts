import path from "path";
import { findSharedParent } from "../shared/findSharedParent";
import { DependenciesTree, FractalTree } from "../toFractalTree";

export function notACycle(
  dependencyIndex: DependenciesTree,
  tree: FractalTree
) {
  for (const [fileName, dependency] of Object.entries(dependencyIndex)) {
    if (dependency.length > 1 && !fileName.includes("..")) {
      const newDependency = createDependencyPath(dependency, fileName);
      tree[fileName] = newDependency;
    }
  }
}

/** @todo rename dependencies to something more meaningful. */
function createDependencyPath(dependencies: string[], fileName: string) {
  const parent = findSharedParent(dependencies);
  const filename = path.basename(fileName);
  const { name, dir } = path.parse(filename);

  const upperFolder = path.basename(dir);
  const conditional = indexConditional(name, upperFolder);
  const newBase = conditional ? upperFolder + path.extname(filename) : filename;
  const result = path.join(parent, "shared", newBase);

  return result;
}

export function indexConditional(name: string, upperFolder: string) {
  return name === "index" && upperFolder !== "" && upperFolder !== ".";
}

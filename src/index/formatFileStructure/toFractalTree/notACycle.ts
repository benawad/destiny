import path from "path";
import { findSharedParent } from "../shared/findSharedParent";
import { DependenciesTree, FractalTree } from "./createFractalProperties";

export function addDependencyToTree(
  dependencyIndex: DependenciesTree,
  tree: FractalTree
) {
  for (const [fileName, dependencies] of Object.entries(dependencyIndex)) {
    if (dependencies.length > 1 && !fileName.includes("..")) {
      const newDependency = createSharedPath(dependencies, fileName);
      tree[fileName] = newDependency;
    }
  }
}

function createSharedPath(dependencies: string[], fileName: string) {
  const parent = findSharedParent(dependencies);
  const filename = path.basename(fileName);
  const { name, dir } = path.parse(filename);

  const upperFolder = path.basename(dir);
  const conditional = indexConditional(name, upperFolder);
  const newBase = conditional ? upperFolder + path.extname(filename) : filename;
  const result = path.join(parent, "shared", newBase);

  return result;
}

//@todo — Needs a better name.
export function indexConditional(name: string, upperFolder: string) {
  return name === "index" && upperFolder !== "" && upperFolder !== ".";
}

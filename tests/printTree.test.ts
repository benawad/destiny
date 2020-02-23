import printTree from "../src/index/printTree";

printTree([
  "index.ts",
  "index/getFilePaths.ts",
  "shared/logger.ts",
  "index/formatFileStructure.ts",
  "index/formatFileStructure/buildGraph.ts",
  "index/formatFileStructure/shared/findEdges.ts",
  "index/formatFileStructure/buildGraph/addEdge.ts",
  "index/formatFileStructure/shared/Graph.ts",
  "index/formatFileStructure/shared/findSharedParent.ts",
  "index/formatFileStructure/shared/customResolve.ts",
  "index/formatFileStructure/findEntryPoints.ts",
  "index/formatFileStructure/shared/isTestFile.ts",
  "index/formatFileStructure/moveFiles.ts",
  "index/formatFileStructure/toFractalTree.ts",
  "index/formatFileStructure/toFractalTree/hasCycle.ts",
  "index/formatFileStructure/removeEmptyFolders.ts",
  "index/formatFileStructure/fixImports.ts",
  "index/formatFileStructure/fixImports/makeImportPath.ts",
  "index/shared/RootOption.ts",
  "index/shared/Foo.ts",
  "index/RootOption.ts",
  "index/Foo.ts",
  "foo/asd/asd.ts",
  "foo/bar/baz/baz.ts",
  "foo/bar/baz/qux.ts",
  "foo/quop/baz/qux.ts",
]);

describe("printTree", () => {
  it("should", () => {
    expect(true).toBe(true);
  });
});

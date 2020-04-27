import { makeImportPath } from "../src/index/formatFileStructure/fixImports/makeImportPath";

describe("makeImportPath", () => {
  it("../add/index => ../add", () => {
    expect(makeImportPath("src/app.js", "src/add/index.js", true)).toBe(
      "./add"
    );
  });
});

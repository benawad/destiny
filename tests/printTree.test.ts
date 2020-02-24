import printTree from "../src/index/generateTrees/printTree";

const filePathsList = [
  ["foo", "bar", "baz", "qux"],
  ["foo", "foo/bar", "foo/bar/baz", "foo/bar/baz/qux"],
  ["foo", "foo/bar", "foo/baz", "foo/qux"],
  [
    "foo",
    "foo/bar/a",
    "foo/bar/b",
    "foo/baz/a",
    "foo/baz/b",
    "foo/qux/a",
    "foo/qux/b",
  ],
  ["foo", "foo/bar", "foo/bar/baz", "foo/bar/baz/qux", "qux"],
  ["foo.ts", "bar", "bar/foo", "bar/foo/foo.ts", "bar/bar.ts"],
];

describe("printTree", () => {
  filePathsList.forEach(filePaths => {
    it("should visualize tree", () => {
      expect("\n" + printTree(filePaths)).toMatchSnapshot();
    });
  });
});

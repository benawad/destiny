import path from "path";
import glob from "glob";
import fs from "fs";

import { findSharedParent } from "../src/index/generateTrees/shared/findSharedParent";

const fixturesPath = fs.readdirSync(path.resolve(__dirname, "fixtures"));

describe(findSharedParent, () => {
  it.each(fixturesPath)("fixture — %s", fixtureName => {
    const fixture = path.resolve(__dirname, "fixtures", fixtureName);
    const filePaths = glob.sync(
      path.resolve(__dirname, "fixtures", fixtureName, "./**/*.js")
    );

    const result = findSharedParent(filePaths);
    expect(result).toEqual(fixture);
  });

  it("finds the path when length is one", () => {
    const result = findSharedParent(["/home/user/Documents/file-1.js"]);
    expect(result).toBe("/home/user/Documents");
  });

  it("finds share parent when array length greater than one", () => {
    const result = findSharedParent([
      "/home/user/Documents/file-1.js",
      "/home/user/Documents/file-2.js",
    ]);
    expect(result).toBe("/home/user/Documents");
  });

  it("finds shared parent when both files are at different depths", () => {
    const result = findSharedParent([
      "/home/user/Documents/folder-1/folder-2/file-1.js",
      "/home/user/Documents/folder-3/file-2.js",
    ]);
    expect(result).toBe("/home/user/Documents");
  });
});

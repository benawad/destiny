import path from "path";
import glob from "glob";
import fs from "fs";

import { findSharedParent } from "../src/index/generateTrees/shared/findSharedParent";

const t = (folder: string, g: string) => {
  it(folder, () => {
    expect(
      findSharedParent(
        glob.sync(path.join(__dirname, "fixtures", folder, "/**/*.js"))
      )
    ).toEqual(g);
  });
};

describe("findSharedParentTest", () => {
  for (const dir of fs.readdirSync(path.join(__dirname, "fixtures"))) {
    t(dir, path.resolve(path.join(__dirname, "fixtures", dir)));
  }
});

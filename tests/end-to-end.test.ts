import fs from "fs-extra";
import glob from "glob";
import path from "path";
import treeDir from "tree-node-cli";

import { buildGraph } from "../src/index/generateTrees/buildGraph";
import { run } from "../src/index";

const tmpPath = path.join(__dirname, "tmp");

beforeAll(() => {
  fs.ensureDir(tmpPath);
});

afterAll(() => {
  fs.removeSync(tmpPath);
});

const treeDirWithContents = (dir: string) => {
  const files = fs.readdirSync(dir);
  let tree: Record<string, string> = {};

  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      tree = {
        ...tree,
        ...treeDirWithContents(filePath),
      };
    } else {
      tree[path.relative(tmpPath, filePath)] = fs
        .readFileSync(filePath)
        .toString();
    }
  }

  return tree;
};

describe("end-to-end", () => {
  const fixturePath = path.join(__dirname, "fixtures");
  const testCases = fs.readdirSync(fixturePath);

  for (const testCase of testCases) {
    const templateFolder = path.join(fixturePath, testCase);
    const copyPath = path.join(tmpPath, testCase);

    fs.copySync(templateFolder, copyPath);
    it(testCase, async () => {
      const rootPath =
        testCase === "globals" ? path.join(testCase, "src") : testCase;

      await run(["--write", path.join(tmpPath, rootPath)]);
      buildGraph(glob.sync(path.join(copyPath, "/**/*.*")));
      expect(treeDir(path.join(tmpPath, rootPath))).toMatchSnapshot();

      const treeContents = treeDirWithContents(copyPath);
      Object.keys(treeContents).forEach(k => {
        expect(treeContents[k]).toMatchSnapshot(k);
      });
    });
  }
});

import fs from "fs-extra";
import path from "path";
import { formatFileStructure } from "../src/index/formatFileStructure";
import { buildGraph } from "../src/index/formatFileStructure/buildGraph";
import treeDir from "tree-node-cli";

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
    it(testCase, async () => {
      const testCasePath = path.join(fixturePath, testCase);
      fs.copySync(testCasePath, path.join(tmpPath, testCase));
      const copyPath = path.join(tmpPath, testCase);
      await formatFileStructure(copyPath);
      // make sure no imports broke
      buildGraph(copyPath, true);
      expect(treeDir(copyPath)).toMatchSnapshot();
      const treeContents = treeDirWithContents(copyPath);
      Object.keys(treeContents).forEach(k => {
        expect(treeContents[k]).toMatchSnapshot(k);
      });
    });
  }
});

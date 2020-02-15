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
  for (const ogTestCase of testCases) {
    const testCase =
      ogTestCase === "globals" ? path.join("globals", "src") : ogTestCase;
    it(testCase, async () => {
      const testCasePath = path.join(fixturePath, ogTestCase);
      fs.copySync(testCasePath, path.join(tmpPath, ogTestCase));
      const ogCopyPath = path.join(tmpPath, ogTestCase);
      const copyPath = path.join(tmpPath, testCase);
      await formatFileStructure(copyPath);
      // make sure no imports broke
      buildGraph(ogCopyPath, true);
      expect(treeDir(ogCopyPath)).toMatchSnapshot();
      const treeContents = treeDirWithContents(ogCopyPath);
      Object.keys(treeContents).forEach(k => {
        expect(treeContents[k]).toMatchSnapshot(k);
      });
    });
  }
});

import fs from "fs-extra";
import path from "path";
import { formatFileStructure } from "../src/index/formatFileStructure";
import { buildGraph } from "../src/index/formatFileStructure/buildGraph";

const tmpPath = path.join(__dirname, "tmp");

beforeAll(() => {
  fs.ensureDir(tmpPath);
});

afterAll(() => {
  fs.removeSync(tmpPath);
});

interface Node {
  filePath: string;
  contents: string;
}

const treeDirWithContents = (dir: string) => {
  const files = fs.readdirSync(dir);
  const nodes: Node[] = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      nodes.push(...treeDirWithContents(filePath));
    } else {
      nodes.push({
        filePath: path.relative(tmpPath, filePath),
        contents: fs.readFileSync(filePath).toString(),
      });
    }
  }

  return nodes;
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
      expect(treeDirWithContents(copyPath)).toMatchSnapshot();
    });
  }
});

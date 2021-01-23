import fs from "fs-extra";
import glob from "glob";
import path from "path";
import treeDir from "tree-node-cli";
import chalk from "chalk";

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

const mocks = {
  log: jest.spyOn(console, "log").mockImplementationOnce(() => {}),
  error: jest.spyOn(console, "error").mockImplementationOnce(() => {}),
  info: jest.spyOn(console, "info").mockImplementationOnce(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementationOnce(() => {}),
  exit: jest
    .spyOn(process, "exit")
    // @ts-ignore - eslint won't allow assertion of `code as never`
    .mockImplementationOnce(code => code),
};

function t(options: string[]) {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const fixturePath = path.join(__dirname, "fixtures");
  const testCases = fs.readdirSync(fixturePath);

  for (const testCase of testCases) {
    const templateFolder = path.join(fixturePath, testCase);
    const copyPath = path.join(tmpPath, testCase);

    fs.copySync(templateFolder, copyPath);
    it(testCase, async () => {
      const rootPath =
        testCase === "globals" ? path.join(testCase, "src") : testCase;

      await run([...options, path.join(tmpPath, rootPath)]);
      buildGraph(glob.sync(path.join(copyPath, "/**/*.*")));

      expect(treeDir(path.join(tmpPath, rootPath))).toMatchSnapshot();
      expect(mocks.log).toBeCalledWith(
        chalk.bold.blue(rootPath.split(path.sep).pop())
      );

      const treeContents = treeDirWithContents(copyPath);
      Object.keys(treeContents).forEach(k => {
        expect(treeContents[k]).toMatchSnapshot(k);
      });
    });
  }
}

describe("end-to-end", () => {
  t(["--write"]);
});

describe("end-to-end --avoid-single-file", () => {
  t(["--write", "--avoid-single-file"]);
});

describe("end-to-end --nested-main-modules", () => {
  t(["--write", "--nested-main-modules"]);
});

describe("end-to-end --nested-main-modules --avoid-single-file", () => {
  t(["--write", "--nested-main-modules", "--avoid-single-file"]);
});

import fs from "fs-extra";
import glob from "glob";
import path from "path";
import logger from "../shared/logger";

const isDirectory = (filePath: string) => fs.lstatSync(filePath).isDirectory();
const isFile = (filePath: string) => fs.lstatSync(filePath).isFile();

export const globSearch = (pattern: string, ignore: string[]) => {
  const matches = glob.sync(pattern, { ignore });
  const files = matches.filter(match => isFile(match));

  if (files.length === 0) {
    logger.error("Could not find any files for: " + pattern, 1);
  }

  return files;
};

export const getFilePaths = (rootPath: string, ignore: string[]) => {
  const filePaths: string[] = [];
  const paths = [rootPath];

  while (paths.length > 0) {
    const filePath = paths.shift();
    if (filePath == null || filePath.length === 0) break;

    const isGlobPattern = glob.hasMagic(filePath);
    if (isGlobPattern) {
      filePaths.push(...globSearch(filePath, ignore));
      continue;
    }

    if (!fs.existsSync(filePath)) {
      logger.error(`Unable to resolve the path: ${filePath}`);
      break;
    }

    if (isDirectory(filePath)) {
      paths.push(path.resolve(filePath, "./**/*.*"));
      continue;
    }

    if (isFile(filePath)) {
      filePaths.push(filePath);
    }
  }

  return filePaths;
};

/** Get a restructure map with rootPath keys and filePaths values. */
export const getRestructureMap = (rootPaths: string[], ignore: string[]) =>
  rootPaths.reduce<{ [key: string]: string[] }>(
    (acc, rootPath) => ({
      ...acc,
      [rootPath]: getFilePaths(rootPath, ignore),
    }),
    {}
  );

export default getRestructureMap;

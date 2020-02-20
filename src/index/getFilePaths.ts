import glob from "glob";
import path from "path";
import { existsSync, lstatSync, readdirSync } from "fs-extra";

import logger from "../shared/logger";

const isDirectory = (filePath: string) => lstatSync(filePath).isDirectory();
const isFile = (filePath: string) => lstatSync(filePath).isFile();

const globSearch = (pattern: string) => {
  const matches = glob.sync(pattern);
  const files = matches.filter(match => isFile(match));

  if (files.length === 0) {
    logger.error("Could not find any files for: " + pattern, 1);
  }

  return files;
};

/** Recursively get all file paths. */
export const getFilePaths = (
  paths: string[],
  options = { detectRoots: false }
) => {
  const files: string[][] = [];

  while (paths.length > 0) {
    const filePath = paths.pop();

    if (filePath == null || filePath.length === 0) continue;

    const isGlobPattern = glob.hasMagic(filePath);
    if (isGlobPattern) {
      files.push(globSearch(filePath));
      continue;
    }

    if (existsSync(filePath)) {
      if (isFile(filePath)) {
        files.push([filePath]);
      } else if (isDirectory(filePath)) {
        if (options.detectRoots) {
          const childDirectories = readdirSync(path.resolve(filePath))
            .map(x => path.join(filePath, x))
            .filter(x => isDirectory(x));

          paths.push(...childDirectories);
          options.detectRoots = false;
        } else {
          paths.push(path.join(filePath, "/**/*.*"));
        }
      }
    } else {
      logger.error(`Unable to resolve the path: ${filePath}`);
    }
  }

  return files;
};

export default getFilePaths;

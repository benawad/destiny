#!/usr/bin/env node

import chalk from "chalk";
import glob from "glob";
import { existsSync, lstatSync, readdirSync } from "fs-extra";
import path from "path";

import { formatFileStructure } from "./index/formatFileStructure";
import { version } from "../package.json";
import logger from "./shared/logger";

const { argv, env } = process;
const defaults = {
  options: {
    help: false,
    version: false,
    detectRoots: false,
  },
  paths: [],
};

type ParsedArgs = {
  options: { help: boolean; version: boolean; detectRoots: boolean };
  paths: string[];
};

const printVersion = () => console.log("v" + version);
const printHelp = (exitCode: number) => {
  console.log(
    chalk`{blue destiny} - Prettier for file structures.

{bold USAGE}

  {blue destiny} [option...] [{underline path}]

  The {underline path} argument can consist of either a {bold file path} or a {bold glob}.

{bold OPTIONS}

  -V, --version            output version number
  -h, --help               output usage information
  -dr, --detect-roots      structure after the first level
  `
  );

  return process.exit(exitCode);
};

const parseArgs = (args: any[]): ParsedArgs =>
  args.reduce((acc, arg) => {
    switch (arg) {
      case "-h":
      case "--help":
        acc.options.help = true;
        break;
      case "-V":
      case "--version":
        acc.options.version = true;
        break;
      case "-dr":
      case "--detect-roots":
        acc.options.detectRoots = true;
        break;
      default:
        acc.paths.push(arg);
    }

    return acc;
  }, defaults);

const getFilePaths = (paths: string[], detectRoots: boolean) => {
  const files: string[][] = [];

  while (paths.length > 0) {
    const filePath = paths.pop();

    if (!filePath) continue;
    if (glob.hasMagic(filePath)) {
      const globFiles = glob.sync(filePath);

      if (globFiles.length === 0) {
        logger.error("Could not find any files for: " + filePath, 1);
      }
      files.push(
        globFiles.filter(x => {
          const isFile = lstatSync(x).isFile();

          if (!isFile) {
            logger.warn(`Skipping non file: ${x}`);
          }
          return isFile;
        })
      );
    } else if (!existsSync(filePath)) {
      logger.error(`Unable to resolve the path: ${filePath}`);
    } else {
      const stats = lstatSync(filePath);

      if (stats.isDirectory()) {
        if (detectRoots) {
          paths.push(
            ...readdirSync(path.resolve(filePath)).map(x =>
              path.join(filePath, x)
            )
          );
          detectRoots = false;
        } else {
          paths.push(path.join(filePath, "/**/*.*"));
        }
      } else if (stats.isFile()) {
        files.push([filePath]);
      } else {
        logger.warn(`Skipping: ${filePath}`);
      }
    }
  }

  return files;
};

export const run = async (args: any[]) => {
  const { options, paths } = parseArgs(args);

  if (options.help) return printHelp(0);
  if (options.version) return printVersion();
  if (paths.length === 0) return printHelp(1);

  logger.info("Resolving files.");

  const filesToRestructure = getFilePaths(paths, options.detectRoots);
  const filesToEdit = filesToRestructure.flat();

  if (filesToRestructure.length === 0) {
    logger.error("Could not find any files to restructure", 1);
    return;
  }

  await formatFileStructure(filesToRestructure, filesToEdit);
};

if (env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

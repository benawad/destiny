import chalk from "chalk";
import { existsSync, lstatSync, readdirSync } from "fs-extra";
import glob from "glob";
import path from "path";
import { version } from "../package.json";
import logger from "./shared/logger";

export type ParsedArgs = {
  options: {
    help: boolean;
    version: boolean;
    detectRoots: boolean;
  };
  paths: string[];
};

const defaults: ParsedArgs = {
  options: {
    help: false,
    version: false,
    detectRoots: false,
  },
  paths: [],
};

export function printVersion() {
  return console.log("v" + version);
}

export function printHelp(exitCode = 0) {
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
}

export function parseArgs(args: any[]): ParsedArgs {
  return args.reduce((acc, arg) => {
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
}

export function getFilePaths(paths: string[], detectRoots: boolean) {
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
          console.log(paths);
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
}

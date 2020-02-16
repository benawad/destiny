#!/usr/bin/env node

import chalk from "chalk";
import glob from "glob";

import { formatFileStructure } from "./index/formatFileStructure";
import { version } from "../package.json";
import { existsSync, lstatSync } from "fs-extra";
import path from "path";
// import { existsSync } from "fs-extra";

const { argv, env } = process;
const defaults = {
  options: {
    help: false,
    version: false,
  },
  paths: [],
};

type ParsedArgs = {
  options: { help: boolean; version: boolean };
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
      default:
        acc.paths.push(arg);
    }

    return acc;
  }, defaults);

const pathsToFiles = (paths: string[]) => {
  const files: string[][] = [];
  while (paths.length) {
    const p = paths.pop();
    if (!p) {
      continue;
    }
    if (glob.hasMagic(p)) {
      const globFiles = glob.sync(p);
      if (!globFiles.length) {
        throw new Error("Could not find any files for: " + p);
      }
      files.push(globFiles);
    } else if (!existsSync(p)) {
      throw new Error("Unable to resolve the path: " + p);
    } else if (lstatSync(p).isDirectory()) {
      paths.push(path.join(p, "/**/*.*"));
    } else {
      files.push([p]);
    }
  }

  return files;
};

export const run = async (args: any[]) => {
  const { options, paths } = parseArgs(args);

  if (options.help) return printHelp(0);
  if (options.version) return printVersion();
  if (paths.length === 0) return printHelp(1);

  const filesToStructure = pathsToFiles(paths);
  const filesToFixImports = filesToStructure.flat();

  if (!filesToStructure.length) {
    console.log("Could not find any files to structure");
    return;
  }

  console.log("Files to structure:");
  console.log(filesToStructure);
  await formatFileStructure(filesToStructure, filesToFixImports);
};

if (env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

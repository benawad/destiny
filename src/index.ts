#!/usr/bin/env node

import chalk from "chalk";
import glob from "glob";

import { formatFileStructure } from "./index/formatFileStructure";
import { version } from "../package.json";
import { existsSync } from "fs-extra";

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

const run = (args: any[]) => {
  const { options, paths } = parseArgs(args);

  if (options.help) return printHelp(0);
  if (options.version) return printVersion();
  if (paths.length === 0) return printHelp(1);

  paths.forEach(path => {
    const filesToStructure = glob.sync(path);
    const filesToFixImports = filesToStructure;

    if (!existsSync(path)) {
      console.log("Unable to resolve the path:", path);
      return;
    }

    if (!filesToStructure.length) {
      console.log("Could not find any files for: ", path);
      return;
    }

    console.log("Files to structure:");
    console.log(filesToStructure);
    formatFileStructure(filesToStructure, filesToFixImports);
  });
};

if (env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

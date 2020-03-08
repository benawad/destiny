import chalk from "chalk";
import fs from "fs";
import glob from "glob";
import { cosmiconfigSync } from "cosmiconfig";

import getRestructureMap from "./index/getFilePaths";
import logger from "./shared/logger";
import { formatFileStructure } from "./index/formatFileStructure";
import { generateTrees } from "./index/generateTrees";
import { version } from "../package.json";

const { argv } = process;

export type Config = {
  help: boolean;
  include: string[];
  version: boolean;
  write: boolean;
  avoidSingleFile: boolean;
};

const defaultConfig: Config = {
  help: false,
  include: [],
  version: false,
  write: false,
  avoidSingleFile: false,
};

const printVersion = () => console.log("v" + version);
const printHelp = (exitCode: number) => {
  console.log(
    chalk`{blue destiny} - Prettier for file structures.

{bold USAGE}

  {blue destiny} [option...] [{underline path}]

  The {underline path} argument can consist of either a {bold file path} or a {bold glob}.

{bold OPTIONS}

  -V, --version               Output version number
  -h, --help                  Output usage information
  -w, --write                 Restructure and edit folders and files
  -S, --avoid-single-file     Flag to indicate if single files in folders should be avoided
  `
  );

  return process.exit(exitCode);
};

const parseArgs = (args: string[]) => {
  const cliConfig: Partial<Config> = {};

  while (args.length > 0) {
    const arg = args.shift();

    if (arg == null) break;

    switch (arg) {
      case "-h":
      case "--help":
        cliConfig.help = true;
        break;
      case "-V":
      case "--version":
        cliConfig.version = true;
        break;
      case "-w":
      case "--write":
        cliConfig.write = true;
        break;
      case "-S":
      case "--avoid-single-file":
        cliConfig.avoidSingleFile = true;
        break;
      default: {
        if (fs.existsSync(arg) || glob.hasMagic(arg)) {
          cliConfig.include = [...(cliConfig.include ?? []), arg];
        }
      }
    }
  }

  return cliConfig;
};

const getMergedConfig = (cliConfig: Partial<Config>): Config => {
  const externalConfig: Partial<Config> =
    cosmiconfigSync("destiny").search()?.config ?? {};

  return {
    ...defaultConfig,
    ...externalConfig,
    ...cliConfig,
  };
};

export const run = async (args: string[]) => {
  const cliConfig = parseArgs(args);
  const mergedConfig = getMergedConfig(cliConfig);

  if (mergedConfig.help) return printHelp(0);
  if (mergedConfig.version) return printVersion();
  if (mergedConfig.include.length === 0) return printHelp(1);

  const restructureMap = getRestructureMap(mergedConfig.include);
  const filesToEdit = Object.values(restructureMap).flat();

  if (filesToEdit.length === 0) {
    logger.error("Could not find any files to restructure", 1);
    return;
  }

  const rootOptions = generateTrees(restructureMap, mergedConfig);

  if (mergedConfig.write) {
    await formatFileStructure(filesToEdit, rootOptions);
  }
};

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

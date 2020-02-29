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

type Config = {
  help: boolean,
  include: string[],
  version: boolean,
  write: boolean,
};

const defaultConfig: Config = {
  help: false,
  include: [],
  version: false,
  write: false,
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
  -w, --write              restructure and edit folders and files
  `
  );

  return process.exit(exitCode);
};

const parseArgs = (args: string[]) =>
  args.reduce<Partial<Config>>((acc, arg) => {
    switch (arg) {
      case "-h":
      case "--help":
        acc.help = true;
        break;
      case "-V":
      case "--version":
        acc.version = true;
        break;
      case "-w":
      case "--write":
        acc.write = true;
        break;
      default: {
        if (fs.existsSync(arg) || glob.hasMagic(arg)) {
          acc.include = [...(acc.include ?? []), arg];
        }
      }
    }

    return acc;
  }, {});

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

  const rootOptions = generateTrees(restructureMap);

  if (mergedConfig.write) {
    await formatFileStructure(filesToEdit, rootOptions);
  }
};

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

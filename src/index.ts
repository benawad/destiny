import chalk from "chalk";
import { cosmiconfigSync } from "cosmiconfig";

import logger from "./shared/logger";
import { formatFileStructure } from "./index/formatFileStructure";
import { generateTrees } from "./index/generateTrees";
import { version } from "../package.json";
import getRestructureMap from "./index/getFilePaths";

const { argv } = process;

type Options = {
  help: boolean,
  version: boolean,
  write: boolean,
};

type Args = {
  options: Partial<Options>,
  rootPaths: string[],
};

const defaultOptions: Options = {
  help: false,
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

const parseArgs = (args: string[]): Args =>
  args.reduce<Args>(
    (acc, arg) => {
      switch (arg) {
        case "-h":
        case "--help":
          acc.options.help = true;
          break;
        case "-V":
        case "--version":
          acc.options.version = true;
          break;
        case "-w":
        case "--write":
          acc.options.write = true;
          break;
        default:
          acc.rootPaths.push(arg);
      }

      return acc;
    },
    { options: {}, rootPaths: [] }
  );

export const run = async (args: string[]) => {
  const config: Partial<Options> =
    cosmiconfigSync("destiny").search()?.config ?? {};
  const { options, rootPaths } = parseArgs(args);

  const mergedOptions: Options = {
    ...defaultOptions,
    ...config,
    ...options,
  };

  if (mergedOptions.help) return printHelp(0);
  if (mergedOptions.version) return printVersion();
  if (rootPaths.length === 0) return printHelp(1);

  logger.info("Resolving files.");

  const restructureMap = getRestructureMap(rootPaths);
  const filesToEdit = Object.values(restructureMap).flat();

  if (filesToEdit.length === 0) {
    logger.error("Could not find any files to restructure", 1);
    return;
  }

  const rootOptions = generateTrees(restructureMap);

  if (mergedOptions.write) {
    await formatFileStructure(filesToEdit, rootOptions);
  }
};

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

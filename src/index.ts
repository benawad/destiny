import fs from "fs";
import glob from "glob";
import { cosmiconfigSync } from "cosmiconfig";

import getRestructureMap from "./index/getFilePaths";
import logger from "./shared/logger";
import { formatFileStructure } from "./index/formatFileStructure";
import { generateTrees } from "./index/generateTrees";
import { version } from "../package.json";
import { printHelpMessage } from "./index/printHelpMessage";

const { argv } = process;

export type Config = {
  help: boolean;
  include: string[];
  version: boolean;
  write: boolean;
  avoidSingleFile: boolean;
  debug: boolean | string;
};

const defaultConfig: Config = {
  help: false,
  include: [],
  version: false,
  write: false,
  avoidSingleFile: false,
  debug: false,
};

const printVersion = () => console.log("v" + version);
const printHelp = (exitCode: number) => {
  printHelpMessage([
    {
      flags: ["-V", "--version"],
      description: "Output version number",
    },
    {
      flags: ["-h", "--help"],
      description: "Output usage information",
    },
    {
      flags: ["-w", "--write"],
      description: "Restructure and edit folders and files",
    },
    {
      flags: ["-S", "--avoid-single-file"],
      description:
        "Flag to indicate if single files in folders should be avoided",
    },
    {
      flags: ["--debug [?output file]"],
      description: "Print debugging info",
    },
  ]);

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
      case "--debug":
        cliConfig.debug =
          !args[0] || args[0].startsWith("-") ? true : args.shift();
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
  if (mergedConfig.debug) logger.enableDebugger();

  process.on("exit", () => {
    if (typeof mergedConfig.debug === "string") {
      logger.writeDebugStdout(mergedConfig.debug);
    }

    logger.debug("exiting");
  });

  logger.debug("config used:", mergedConfig);

  const restructureMap = getRestructureMap(mergedConfig.include);
  const filesToEdit = Object.values(restructureMap).flat();

  logger.debug("restructured map:", restructureMap);

  if (filesToEdit.length === 0) {
    logger.error("Could not find any files to restructure", 1);
    return;
  }

  const rootOptions = generateTrees(restructureMap, mergedConfig);

  logger.debug("generated tree(s):", rootOptions);

  if (mergedConfig.write) {
    await formatFileStructure(filesToEdit, rootOptions);
  }
};

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

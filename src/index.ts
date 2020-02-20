import chalk from "chalk";
import path from "path";
import { cosmiconfigSync } from "cosmiconfig";
import v8 from "v8";

import getFilePaths from "./index/getFilePaths";
import logger from "./shared/logger";
import { formatFileStructure } from "./index/formatFileStructure";
import { version } from "../package.json";

const { argv } = process;

interface InternalFlags {
  help: boolean;
  version: boolean;
}
const defaultInternalFlags: InternalFlags = {
  help: false,
  version: false,
};

interface Config {
  options: { detectRoots: boolean };
  paths: string[];
}
const defaultConfig: Config = {
  options: {
    detectRoots: false,
  },
  paths: [],
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

const parseArgs = (
  args: string[]
): { parsedArgs: Config; parsedInternalFlags: InternalFlags } => {
  const parsedArgs = args.reduce((acc, arg) => {
    switch (arg) {
      case "-dr":
      case "--detect-roots":
        acc.options.detectRoots = true;
        break;
      default:
        if (arg.startsWith("--") || arg.startsWith("-")) break;
        acc.paths.push(arg);
    }

    return acc;
  }, v8.deserialize(v8.serialize(defaultConfig)));

  const parsedInternalFlags = args.reduce((acc, arg) => {
    switch (arg) {
      case "-h":
      case "--help":
        acc.help = true;
        break;
      case "-V":
      case "--version":
        acc.version = true;
        break;
    }

    return acc;
  }, v8.deserialize(v8.serialize(defaultInternalFlags)));

  return {
    parsedArgs,
    parsedInternalFlags,
  };
};

const combineArgsAndConfigFile = (
  args: Config,
  config: Partial<Config> = {},
  recursedDefConfig = defaultConfig
): Config => {
  for (const key in config) {
    const argProp = args[key];
    const confProp = config[key];
    const defaultConfProp = recursedDefConfig[key];

    if (confProp && confProp.constructor === Object) {
      args[key] = combineArgsAndConfigFile(argProp, confProp, defaultConfProp);
    } else if (JSON.stringify(argProp) === JSON.stringify(defaultConfProp)) {
      args[key] = confProp;
    }
  }

  return args;
};

export const run = async (args: string[]) => {
  const { parsedArgs, parsedInternalFlags } = parseArgs(args);
  const configFile = cosmiconfigSync("destiny").search();
  const { paths, options } = combineArgsAndConfigFile(
    parsedArgs,
    configFile?.config
  );

  if (parsedInternalFlags.help) return printHelp(0);
  if (parsedInternalFlags.version) return printVersion();
  if (paths.length === 0) return printHelp(1);

  logger.info("Resolving files.");

  const filesToRestructure = getFilePaths(paths, options);
  const filesToEdit = filesToRestructure.flat();

  if (filesToRestructure.length === 0) {
    logger.error("Could not find any files to restructure", 1);
    return;
  }

  await formatFileStructure(filesToRestructure, filesToEdit);
};

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

import { getFilePaths, parseArgs, printHelp, printVersion } from "./cli";
import { formatFileStructure } from "./index/formatFileStructure";
import logger from "./shared/logger";

const { argv } = process;

export async function run(args: string[]) {
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
}

if (process.env.NODE_ENV !== "test") {
  run(argv.slice(2, argv.length));
}

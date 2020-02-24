import { moveFiles } from "./formatFileStructure/moveFiles";
import { removeEmptyFolders } from "./formatFileStructure/removeEmptyFolders";
import { fixImports } from "./formatFileStructure/fixImports";
import { RootOption } from "./shared/RootOption";
import logger from "../shared/logger";

export const formatFileStructure = async (
  filePaths: string[],
  rootOptions: RootOption[]
) => {
  logger.info("Fixing imports.");
  fixImports(filePaths, rootOptions);

  for (const { tree, parentFolder } of rootOptions) {
    logger.info("Moving files.");
    await moveFiles(tree, parentFolder);
    removeEmptyFolders(parentFolder);
  }

  logger.info("Restructure was successful!");
};

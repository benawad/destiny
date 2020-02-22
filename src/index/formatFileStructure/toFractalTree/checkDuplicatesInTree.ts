import path from "path";
import logger from "../../../shared/logger";
import { FractalTree } from "../toFractalTree";

export interface CheckDuplicatesParams {
  tree: FractalTree;
  /** Location to check for in the tree. */
  location: string;
  dirname: string;
  filePath: string;
}

/**
 * Handles duplicated items.
 * If the location already exists, it changes creates a new file.
 * @todo write a better description because I don't quite know why this needs to exist
 *
 * Flattens a directory name and file path into a file path,
 * separated by `-`.
 *
 */
export function checkDuplicatesInTree({
  // tree to check in
  tree,
  // location to check against
  location,
  // join dirname and path with regex
  dirname,
  filePath,
}: CheckDuplicatesParams) {
  let newLocation;

  if (Object.values(tree).includes(location)) {
    const newFilePath = filePath.replace(/\//g, "-");
    newLocation = path.join(dirname, newFilePath);
    logger.info(`File renamed: ${filePath} -> ${newFilePath}`);
  }

  return newLocation ?? location;
}

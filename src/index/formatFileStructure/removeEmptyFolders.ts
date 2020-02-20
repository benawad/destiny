import fs from "fs";
import path from "path";

/**
 * @summary
 * Recursively removes all empty folders.
 *
 * @param directory the full path of a directory.
 *
 * @example
 * removeEmptyFolders('/home/user/documents/project/src')
 */
export function removeEmptyFolders(directory: string): void {
  const files = fs.readdirSync(directory);
  if (!files) return fs.rmdirSync(directory);

  for (const base of files) {
    const fullPath = path.resolve(directory, base);

    const isDirectory = fs.lstatSync(fullPath).isDirectory();
    if (!isDirectory) continue;

    removeEmptyFolders(fullPath);

    const isEmpty = fs.readdirSync(fullPath).length === 0;
    if (isEmpty) fs.rmdirSync(fullPath);
  }
}

import fs from "fs";
import path from "path";

/**
 * @summary
 * Recursively removes all empty folders.
 */
export function removeEmptyFolders(directory: string): void {
  const files = fs.readdirSync(directory);
  if (!files) return fs.rmdirSync(directory);

  for (const filePath of files) {
    const fullPath = path.resolve(directory, filePath);

    const isDirectory = fs.lstatSync(fullPath).isDirectory();
    if (!isDirectory) continue;

    removeEmptyFolders(fullPath);

    const isEmpty = fs.readdirSync(fullPath).length === 0;
    if (isEmpty) fs.rmdirSync(fullPath);
  }
}

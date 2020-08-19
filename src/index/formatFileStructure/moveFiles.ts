import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";

import logger from "../../shared/logger";
import { RootOption } from "../shared/RootOption";

async function isFileGitTracked(git: Git.SimpleGit, location: string) {
  return git
    .silent(true)
    .raw(["ls-files", "--error-unmatch", location])
    .then(() => true)
    .catch(() => false);
}

/** Moves each file in the tree from old path to new path. */
export async function moveFiles(
  tree: RootOption["tree"],
  parentFolder: string
) {
  const git = Git(parentFolder);
  const isFolderGitTracked = await git.checkIsRepo();
  const entries = Object.entries(tree);
  const fileAlreadyExistsEntries = [] as typeof entries;
  while (entries.length || fileAlreadyExistsEntries.length) {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const [oldPath, newPath] = entries.length
      ? entries.pop()!
      : fileAlreadyExistsEntries.pop()!;
    /* eslint-enable */
    // skip globals
    if (oldPath.includes("..")) continue;

    const oldAbsolutePath = path.resolve(parentFolder, oldPath);
    const newAbsolutePath = path.resolve(parentFolder, newPath);

    if (oldAbsolutePath === newAbsolutePath) continue;

    // Create folder for files
    const newDirname = path.dirname(newAbsolutePath);
    fs.ensureDirSync(newDirname);

    if (fs.existsSync(newAbsolutePath)) {
      if (entries.length) {
        // try moving this file later after the other files have been moved
        fileAlreadyExistsEntries.push([oldPath, newPath]);
      } else {
        logger.warn(
          `not moving "${oldAbsolutePath}" to "${newAbsolutePath}" because "${newAbsolutePath}" already exists`
        );
      }
      continue;
    }

    const shouldGitMv =
      isFolderGitTracked && (await isFileGitTracked(git, oldAbsolutePath));

    logger.debug(`moving "${oldAbsolutePath}" to "${newAbsolutePath}"`);

    if (shouldGitMv) {
      await git.mv(oldAbsolutePath, newAbsolutePath);
    } else {
      fs.renameSync(oldAbsolutePath, newAbsolutePath);
    }
  }
}

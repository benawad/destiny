import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";

async function isFileGitTracked(git: Git.SimpleGit, location: string) {
  return git
    .silent(true)
    .raw(["ls-files", "--error-unmatch", location])
    .then(() => true)
    .catch(() => false);
}

/** Moves each file in the tree from old path to new path. */
export async function moveFiles(
  tree: Record<string, string>,
  parentFolder: string
) {
  const git = Git(parentFolder);
  const isFolderGitTracked = await git.checkIsRepo();
  for (const [oldPath, newPath] of Object.entries(tree)) {
    // skip globals
    if (oldPath.includes("..")) continue;

    const oldAbsolutePath = path.resolve(parentFolder, oldPath);
    const newAbsolutePath = path.resolve(parentFolder, newPath);

    if (oldAbsolutePath === newAbsolutePath) continue;

    // Create folder for files
    const newDirname = path.dirname(newAbsolutePath);
    fs.ensureDirSync(newDirname);

    const shouldGitMv =
      isFolderGitTracked && (await isFileGitTracked(git, oldAbsolutePath));

    if (shouldGitMv) {
      await git.mv(oldAbsolutePath, newAbsolutePath);
    } else {
      fs.renameSync(oldAbsolutePath, newAbsolutePath);
    }
  }
}

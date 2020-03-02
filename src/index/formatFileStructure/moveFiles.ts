import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";

/** Moves each file in the tree from old path to new path. */
export async function moveFiles(
  tree: Record<string, string>,
  parentFolder: string
) {
  const git = Git(parentFolder);

  for (const [oldPath, newPath] of Object.entries(tree)) {
    // skip globals
    if (oldPath.includes("..")) continue;

    const oldAbsolutePath = path.resolve(parentFolder, oldPath);
    const newAbsolutePath = path.resolve(parentFolder, newPath);

    const isSamePath = oldAbsolutePath === newAbsolutePath;
    if (oldAbsolutePath === newAbsolutePath) continue;

    // Create the folder that should contain this file,
    // if it does not already exist.
    const newDirname = path.dirname(newAbsolutePath);
    fs.ensureDirSync(newDirname);

    /** Reference: https://git-scm.com/docs/git-ls-files#Documentation/git-ls-files.txt---error-unmatch */
    const checkLsFiles = () => {
      return (
        git
          .silent(true)
          .raw(["ls-files", "--error-unmatch", oldAbsolutePath])
          .then(() => true)
          .catch(() => false)
      );
    };

    const shouldGitMv = (await git.checkIsRepo()) && (await checkLsFiles());

    if (shouldGitMv) await git.mv(oldAbsolutePath, newAbsolutePath);
    else fs.renameSync(oldAbsolutePath, newAbsolutePath);
  }
}

import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";

/** Moves each file in the tree from old path to new path. */
export const moveFiles = async (
  tree: Record<string, string>,
  parentFolder: string
) => {
  const git = Git(parentFolder);

  for (const [oldPath, newPath] of Object.entries(tree)) {
    // skip globals
    if (oldPath.includes("..")) continue;

    const oldAbsolutePath = path.resolve(parentFolder, oldPath);
    const newAbsolutePath = path.resolve(parentFolder, newPath);

    console.log({ oldAbsolutePath, newAbsolutePath });
    const isSamePath = oldAbsolutePath === newAbsolutePath;
    if (isSamePath) continue;

    // Create the folder that should contain this file,
    // if it does not already exist.
    const newDirname = path.dirname(newAbsolutePath);
    fs.ensureDirSync(newDirname);

    /**
     * Check if file is tracked in git:
     *
     * Reference: https://git-scm.com/docs/git-ls-files#Documentation/git-ls-files.txt---error-unmatch
     */
    const shouldGitMv = await git
      .silent(true)
      .raw(["ls-files", "--error-unmatch", oldAbsolutePath])
      .then(() => true)
      // If not a repo, this returns false immediately.
      .catch(() => false);

    // Move file, using git or fs depdning on cirumstance.
    if (shouldGitMv) await git.mv(oldAbsolutePath, newAbsolutePath);
    else fs.renameSync(oldAbsolutePath, newAbsolutePath);
  }
};

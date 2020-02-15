import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";

export const moveFiles = async (
  newStructure: Record<string, string>,
  parentFolder: string
) => {
  const git = Git(parentFolder);
  let isRepo = false;
  try {
    isRepo = await git.checkIsRepo();
  } catch {}
  for (const [k, newLocation] of Object.entries(newStructure)) {
    // skip globals
    if (k.includes("..")) {
      return;
    }
    const oldAbsLocation = path.resolve(path.join(parentFolder, k));
    const newAbsLocation = path.resolve(path.join(parentFolder, newLocation));
    // make folders
    fs.ensureDirSync(path.dirname(newAbsLocation));
    if (oldAbsLocation !== newAbsLocation) {
      let shouldGitMv = false;
      if (isRepo) {
        // check if file is tracked in git
        try {
          await git
            .silent(true)
            .raw(["ls-files", "--error-unmatch", oldAbsLocation]);
          shouldGitMv = true;
        } catch {}
      }
      if (shouldGitMv) {
        await git.mv(oldAbsLocation, newAbsLocation);
      } else {
        // move
        fs.renameSync(oldAbsLocation, newAbsLocation);
      }
    }
  }
};

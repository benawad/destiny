import { OldGraph } from "./shared/Graph";
import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";
import { fixImports } from "./syncFileSystem/fixImports";

export const syncFileSystem = async ({
  originalGraph,
  newStructure,
  destination,
  useForwardSlashes,
  startingFolder,
}: {
  originalGraph: OldGraph;
  newStructure: Record<string, string>;
  destination: string;
  useForwardSlashes: boolean;
  startingFolder: string;
}) => {
  const git = Git(startingFolder);
  let isRepo = false;
  try {
    isRepo = await git.checkIsRepo();
  } catch {}
  for (const [k, newLocation] of Object.entries(newStructure)) {
    // skip globals
    if (k.includes("..")) {
      return;
    }
    const { oldLocation, imports } = originalGraph[k];
    const newFullLocation = path.join(destination, newLocation);
    // make folders
    fs.ensureDirSync(path.dirname(newFullLocation));
    const resolvedNewLocation = path.resolve(newFullLocation);
    if (oldLocation !== resolvedNewLocation) {
      let shouldGitMv = false;
      if (isRepo) {
        // check if file is tracked in git
        try {
          await git
            .silent(true)
            .raw(["ls-files", "--error-unmatch", oldLocation]);
          shouldGitMv = true;
        } catch {}
      }
      if (shouldGitMv) {
        await git.mv(oldLocation, newFullLocation);
      } else {
        // move
        fs.renameSync(oldLocation, newFullLocation);
      }
    }

    if (!imports.length) {
      continue;
    }

    fixImports(
      newFullLocation,
      imports,
      newStructure,
      newLocation,
      useForwardSlashes
    );
  }
};

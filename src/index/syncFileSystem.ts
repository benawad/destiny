import { OldGraph } from "./shared/Graph";
import fs from "fs-extra";
import path from "path";
import Git from "simple-git/promise";
import { makeImportPath } from "./syncFileSystem/makeImportPath";

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
  let notAdded;
  try {
    isRepo = await git.checkIsRepo();
    if (isRepo) {
      notAdded = (await git.status()).not_added.map(x => path.resolve(x));
    }
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
      if (isRepo && !notAdded?.includes(resolvedNewLocation)) {
        await git.mv(oldLocation, newFullLocation);
      } else {
        // move
        fs.renameSync(oldLocation, newFullLocation);
      }
    }

    if (!imports.length) {
      continue;
    }

    // fix imports
    let oldText = fs.readFileSync(newFullLocation).toString();
    imports.forEach(imp => {
      const importLocation = newStructure[imp.resolved];
      // console.log("replace: ", imp.text, newImport);
      oldText = oldText.replace(
        imp.text,
        makeImportPath(newLocation, importLocation, useForwardSlashes)
      );
    });
    fs.writeFileSync(newFullLocation, oldText);
  }
};

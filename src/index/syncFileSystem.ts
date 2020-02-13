import { OldGraph } from "./shared/Graph";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

const makeImportPath = (p1: string, p2: string) => {
  const fullPath = path.relative(path.dirname(p1), p2);
  const ext = path.extname(fullPath);
  let newImport = path.join(
    path.dirname(fullPath),
    path.basename(fullPath, ext === ".json" ? undefined : ext)
  );

  if (!newImport.startsWith(".")) {
    newImport = "./" + newImport;
  }

  return newImport;
};

export const syncFileSystem = (
  originalGraph: OldGraph,
  newStructure: Record<string, string>,
  destination: string
) => {
  Object.entries(newStructure).forEach(([k, newLocation]) => {
    // skip globals
    if (k.includes("..")) {
      return;
    }
    const { oldLocation, imports } = originalGraph[k];
    const newFullLocation = path.join(destination, newLocation);
    // make folders
    mkdirp.sync(path.dirname(newFullLocation));
    // move
    fs.renameSync(oldLocation, newFullLocation);

    if (!imports.length) {
      return;
    }

    // fix imports
    let oldText = fs.readFileSync(newFullLocation).toString();
    imports.forEach(imp => {
      const importLocation = newStructure[imp.resolved];
      // console.log("replace: ", imp.text, newImport);
      oldText = oldText.replace(
        imp.text,
        makeImportPath(newLocation, importLocation)
      );
    });
    fs.writeFileSync(newFullLocation, oldText);
  });
};

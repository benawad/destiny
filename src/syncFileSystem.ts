import { OldGraph } from "./Graph";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";

export const syncFileSystem = (
  originalGraph: OldGraph,
  newStructure: Record<string, string>,
  destination: string
) => {
  Object.entries(newStructure).forEach(([k, newLocation]) => {
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
      // works better if they have a common parent
      const fullPath = path.relative(
        path.join("src", newLocation),
        path.join("src", importLocation)
      );
      const newImport = path.basename(fullPath, path.extname(fullPath));
      oldText = oldText.replace(imp.text, newImport);
    });
    fs.writeFileSync(newFullLocation, oldText);
  });
};

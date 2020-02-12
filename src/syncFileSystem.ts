import { OldGraph } from "./Graph";
import fs from "fs";
import path from "path";

export const syncFileSystem = (
  originalGraph: OldGraph,
  newStructure: Record<string, string>,
  destination: string
) => {
  Object.entries(newStructure).forEach(([k, newLocation]) => {
    const { oldLocation, imports } = originalGraph[k];
    const newFullLocation = path.join(destination, newLocation);
    // make folders
    try {
      fs.mkdirSync(path.dirname(newFullLocation), { recursive: true });
    } catch (err) {
      if (!err.message.includes("already exists")) {
        throw err;
      }
    }
    // move
    fs.renameSync(oldLocation, newFullLocation);

    if (!imports.length) {
      return;
    }

    // fix imports
    let oldText = fs.readFileSync(newFullLocation).toString();
    imports.forEach(imp => {
      const fullPath = path.relative(newLocation, newStructure[imp.resolved]);
      const newImport = path.basename(fullPath, path.extname(fullPath));
      console.log("yo: ", imp, fullPath, newImport);
      oldText = oldText.replace(imp.text, newImport);
    });
    fs.writeFileSync(newFullLocation, oldText);
  });
};

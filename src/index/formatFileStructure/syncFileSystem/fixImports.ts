import fs from "fs-extra";
import { makeImportPath } from "./fixImports/makeImportPath";
import { OldGraph } from "../shared/Graph";
export function oldFixImports(
  newFullLocation: string,
  imports: OldGraph[0]["imports"],
  newStructure: Record<string, string>,
  newLocation: string,
  useForwardSlashes: boolean
) {
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

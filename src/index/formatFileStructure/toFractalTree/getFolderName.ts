import { FractalTree } from "../toFractalTree";
import path from "path";
import { checkDuplicatesInTree } from "./checkDuplicatesInTree";
import { indexConditional } from "./notACycle";

export interface GetPathPropertiesParams {
  tree: FractalTree;
  filePath: string;
  folderPath: string;
  basenameWithExt: string;
}

export function getPathProperties({
  tree,
  folderPath,
  basenameWithExt: base,
  filePath,
}: GetPathPropertiesParams) {
  const filePathIsGlobal = filePath.includes("..");

  const tempLocation = createTempLocation({
    base,
    filePath,
    folderPath,
    isGlobal: filePathIsGlobal,
  });

  const location = checkDuplicatesInTree({
    location: tempLocation,
    dirname: folderPath,
    filePath,
    tree,
  });

  const newFolderName = path.parse(tempLocation).name;

  return { folderName: newFolderName, location, filePathIsGlobal };
}
type CreateTempLocationParams = {
  filePath: string;
  folderPath: string;
  base: string;
  isGlobal: boolean;
};

function createTempLocation({
  base,
  filePath,
  folderPath,
  isGlobal,
}: CreateTempLocationParams) {
  const genFilePath = () => createNewFilePath(filePath, folderPath, base);
  return isGlobal ? filePath : genFilePath();
}

function createNewFilePath(filePath: string, folderPath: string, base: string) {
  const { name: folderName, ext, dir } = path.parse(filePath);
  const upperFolder = path.basename(dir);
  const isIndexConditional = indexConditional(folderName, upperFolder);
  const newBase = upperFolder + ext;
  const newFilePath = path.join(
    folderPath,
    isIndexConditional ? newBase : base
  );
  return newFilePath;
}

import fs from "fs";
import path from "path";

export const removeEmptyFolders = (p: string) => {
  const files = fs.readdirSync(p);
  if (!files) {
    fs.rmdirSync(p);
  }
  for (const file of files) {
    const fullPath = path.join(p, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      removeEmptyFolders(fullPath);
      if (!fs.readdirSync(fullPath).length) {
        fs.rmdirSync(fullPath);
      }
    }
  }
};

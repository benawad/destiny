import fs from "fs";

export const removeEmptyFolders = (p: string) => {
  const files = fs.readdirSync(p);
  if (!files) {
    fs.rmdirSync(p);
  }
  for (const file of files) {
    if (fs.lstatSync(file).isDirectory()) {
      removeEmptyFolders(file);
      if (!fs.readdirSync(file).length) {
        fs.rmdirSync(file);
      }
    }
  }
};

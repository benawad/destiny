import path from "path";

export function getFileName(currentPath: string) {
  const fileName = path.basename(currentPath, path.extname(currentPath));
  const currentFolder = path.basename(path.dirname(currentPath));

  if (fileName === "index" && currentFolder && currentFolder !== ".") {
    return currentFolder;
  }

  return fileName;
}

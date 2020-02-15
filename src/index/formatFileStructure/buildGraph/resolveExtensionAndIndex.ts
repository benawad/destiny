import fs from "fs";
import path from "path";

export function resolveExtensionAndIndex(
  filePath: string,
  wasIndex = false
): string | null {
  if (path.extname(filePath)) {
    if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      return null;
    }
  }

  const basename = path.basename(filePath);
  const folder = path.dirname(filePath);
  const files = fs.readdirSync(folder);
  const filePathWithExtension = files.find(
    f =>
      fs.lstatSync(path.join(folder, f)).isFile() &&
      path.basename(f, path.extname(f)) === basename
  );

  if (
    !wasIndex &&
    !filePathWithExtension &&
    fs.existsSync(filePath) &&
    fs.lstatSync(filePath).isDirectory()
  ) {
    return resolveExtensionAndIndex(path.join(filePath, "index"), true);
  }

  const newPath = filePathWithExtension
    ? path.join(folder, filePathWithExtension)
    : path.resolve(filePath);

  if (fs.existsSync(newPath)) {
    return newPath;
  } else {
    return null;
  }
}

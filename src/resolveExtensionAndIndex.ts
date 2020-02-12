import fs from "fs";
import path from "path";

export function resolveExtensionAndIndex(filePath: string): string {
  if (path.extname(filePath)) {
    return filePath;
  }
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    return resolveExtensionAndIndex(path.join(filePath, "index"));
  }
  const basename = path.basename(filePath);
  const folder = path.dirname(filePath);
  const files = fs.readdirSync(folder);
  const filePathWithExtension = files.find(
    f => path.basename(f, path.extname(f)) === basename
  );
  return filePathWithExtension
    ? path.join(folder, filePathWithExtension)
    : path.resolve(filePath);
}

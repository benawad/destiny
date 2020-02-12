import path from "path";
export function importToAbsolutePath(filePath: string, importPath: string) {
  return path.join(path.dirname(filePath), importPath);
}

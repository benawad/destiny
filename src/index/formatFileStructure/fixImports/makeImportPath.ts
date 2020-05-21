import path from "path";

function getExtensionFromImport(relativePath: string) {
  const ext = path.extname(relativePath);
  const includeExtension = [".js", ".jsx", ".ts", ".tsx"].includes(ext);
  return includeExtension ? ext : undefined;
}

export const makeImportPath = (fromPath: string, toPath: string) => {
  const fromDirectory = path.dirname(fromPath);
  const relativePath = path.relative(fromDirectory, toPath);

  const relativeDirectory = path.dirname(relativePath);
  const ext = getExtensionFromImport(relativePath);
  let fileName = path.basename(relativePath, ext);

  // this will cleanup index imports
  // path.join("../add", ".") =>  "../add"
  // instead of: path.join("../add", "index") =>  "../add/index"
  if (fileName === "index") {
    fileName = ".";
  }

  let newImport = path.join(relativeDirectory, fileName);

  // Ensures relative imports.
  const notRelative = !newImport.startsWith(".");
  if (notRelative) {
    newImport = "./" + newImport;
  }

  // Replace \\ by /.
  if (process.platform === "win32") {
    newImport = newImport.replace(/\\/g, "/");
  }

  return newImport;
};

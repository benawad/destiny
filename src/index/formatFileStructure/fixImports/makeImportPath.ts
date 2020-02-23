import path from "path";

/** Creates a new import path from `path1` to `path2`.  */
export const makeImportPath = (
  fromPath: string,
  toPath: string,
  useForwardSlashes: boolean
) => {
  const fromDirectory = path.dirname(fromPath);
  const relativePath = path.relative(fromDirectory, toPath);

  const relativeDirectory = path.dirname(relativePath);
  const ext = getExtensionFromImport(relativePath);
  const fileName = path.basename(relativePath, ext);

  let newImport = path.join(relativeDirectory, fileName);

  // ensures import is relative
  const notRelative = !newImport.startsWith(".");
  if (notRelative) newImport = "./" + newImport;

  // Replace / and \ with \\.
  if (!useForwardSlashes) newImport = newImport.replace(/\/|\\+/g, "\\\\");
  // Replace \ with /.
  else newImport = newImport.replace(/\\/g, "/");

  return newImport;
};

/**
 * Gets the extension of the imported file,
 * only if it was included in the original import.
 */
function getExtensionFromImport(relativePath: string) {
  const ext = path.extname(relativePath);
  const includeExtension = [".js", ".jsx", ".ts", ".tsx"].includes(ext);
  return includeExtension ? ext : undefined;
}

import path from "path";

export const makeImportPath = (
  p1: string,
  p2: string,
  useForwardSlashes: boolean
) => {
  const fullPath = path.relative(path.dirname(p1), p2);
  const ext = path.extname(fullPath);
  let newImport = path.join(
    path.dirname(fullPath),
    path.basename(
      fullPath,
      ![".js", ".jsx", ".ts", ".tsx"].includes(ext) ? undefined : ext
    )
  );
  if (!newImport.startsWith(".")) {
    newImport = "./" + newImport;
  }
  if (useForwardSlashes) {
    // Replace \ with /
    newImport = newImport.replace(/\\/g, "/");
  } else {
    // Replace / and \ with \\
    newImport = newImport.replace(/\/|\\+/g, "\\\\");
  }
  return newImport;
};

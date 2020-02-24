import resolve from "resolve";

/** Resolve with a list of predefined extensions. */
export const customResolve = (id: string, basedir: string) => {
  return resolve.sync(id, {
    basedir,
    extensions: [".js", ".jsx", ".sass", ".scss", ".svg", ".ts", ".tsx"],
  });
};

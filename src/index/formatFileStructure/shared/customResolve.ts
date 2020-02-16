import resolve = require("resolve");

export const customResolve = (id: string, basedir: string) => {
  return resolve.sync(id, {
    basedir,
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  });
};

import resolve from "resolve";

const extensions = [
  ".js",
  ".jsx",
  ".json",
  ".sass",
  ".scss",
  ".svg",
  ".ts",
  ".tsx",
];

/** Checks if the file exists */
export const canResolve = (id: string, basedir: string) => {
  try {
    resolve.sync(id, { basedir, extensions });
    return true;
  } catch (err) {
    return false;
  }
};

/** Resolve with a list of predefined extensions. */
export const customResolve = (id: string, basedir: string) => {
  return resolve.sync(id, { basedir, extensions });
};

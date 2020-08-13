import resolve from "resolve";

const extensions = [
  ".js",
  ".json",
  ".jsx",
  ".sass",
  ".scss",
  ".svg",
  ".ts",
  ".d.ts",
  ".tsx",
  ".js.flow",
  ".png",
  ".jpeg",
  ".jpg",
];

/** Resolve with a list of predefined extensions. */
export const customResolve = (id: string, basedir: string) => {
  try {
    return resolve.sync(id, { basedir, extensions });
  } catch (err) {
    return null;
  }
};

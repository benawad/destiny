import path from "path";

export const fileWithoutExtension = (f: string) =>
  path.basename(f, path.extname(f));

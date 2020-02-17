import { toFractalTree } from "../src/index/formatFileStructure/toFractalTree";
import { buildGraph } from "../src/index/formatFileStructure/buildGraph";
import { findEntryPoints } from "../src/index/formatFileStructure/findEntryPoints";
import path from "path";
import glob from "glob";

const t = (folder: string, g2: any, entryPoints?: string[]) => {
  it(folder, () => {
    const g1 = buildGraph(
      glob.sync(path.join(__dirname, "fixtures", folder, "/**/*.js"))
    ).graph;
    expect(toFractalTree(g1, entryPoints || findEntryPoints(g1))).toEqual(g2);
  });
};

describe("toFractalTree", () => {
  t("simple", {
    "index.js": "index.js",
    "routes.js": "index/routes.js",
    "home.js": "index/routes/home.js",
  });

  t("index-cycle", {
    "index.js": "index.js",
    "routes/index.js": "index/routes.js",
    "login/index.js": "index/login.js",
    "home/index.js": "index/routes/home.js",
    "utils/search.js": "index/login/search.js",
  });

  t("sharing", {
    "index.js": "index.js",
    "footer/index.js": "index/footer.js",
    "header/index.js": "index/header.js",
    "header/helper.js": "index/shared/helper.js",
  });

  t("spec-files", {
    "index.js": "index.js",
    "index.spec.js": "index.spec.js",
    "level1.js": "index/level1.js",
    "level1.spec.js": "index/level1.spec.js",
    "level2.js": "index/level1/level2.js",
    "level2.spec.js": "index/level1/level2.spec.js",
  });

  t("duplicates", {
    "index.js": "index.js",
    "dir1/file.js": "index/file.js",
    "dir2/file.js": "index/dir2-file.js",
    "dir3/sub/file.js": "index/dir3-sub-file.js",
    "dir4/sub/file.js": "index/dir4-sub-file.js",
    "dir5/index.js": "index/dir5.js",
    "dir5/sub1/file.js": "index/dir5/file.js",
    "dir5/sub2/file.js": "index/dir5/dir5-sub2-file.js",
  });
});

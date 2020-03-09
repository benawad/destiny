import path from "path";
import glob from "glob";

import { toFractalTree } from "../src/index/generateTrees/toFractalTree";
import { buildGraph } from "../src/index/generateTrees/buildGraph";
import { findEntryPoints } from "../src/index/generateTrees/findEntryPoints";

const table: [string, { [key: string]: string }][] = [
  [
    "simple",
    {
      "index.js": "index.js",
      "routes.js": "index/routes.js",
      "home.js": "index/routes/home.js",
    },
  ],
  [
    "index-cycle",
    {
      "index.js": "index.js",
      "routes/index.js": "index/routes.js",
      "login/index.js": "index/login.js",
      "home/index.js": "index/routes/home.js",
      "utils/search.js": "index/login/search.js",
    },
  ],
  [
    "sharing",
    {
      "index.js": "index.js",
      "footer/index.js": "index/footer.js",
      "header/index.js": "index/header.js",
      "header/helper.js": "index/shared/helper.js",
    },
  ],
  [
    "spec-files",
    {
      "index.js": "index.js",
      "index.spec.js": "index.spec.js",
      "level1.js": "index/level1.js",
      "level1.spec.js": "index/level1.spec.js",
      "level2.js": "index/level1/level2.js",
      "level2.spec.js": "index/level1/level2.spec.js",
    },
  ],
  [
    "duplicates",
    {
      "index.js": "index.js",
      "dir1/file.js": "index/file.js",
      "dir2/file.js": "index/dir2-file.js",
      "dir3/sub/file.js": "index/dir3-sub-file.js",
      "dir4/sub/file.js": "index/dir4-sub-file.js",
      "dir5/index.js": "index/dir5.js",
      "dir5/sub1/file.js": "index/dir5/file.js",
      "dir5/sub1/file.spec.js": "index/dir5/file.spec.js",
      "dir5/sub2/file.js": "index/dir5/dir5-sub2-file.js",
      "dir5/sub2/file.spec.js": "index/dir5/dir5-sub2-file.spec.js",
    },
  ],
  [
    "commented-imports",
    {
      "index.js": "index.js",
      "existent.js": "index/existent.js",
    },
  ],
];

describe(toFractalTree, () => {
  test.each(table)("%s", (folder, resultingTree) => {
    const filePaths = glob.sync(
      path.resolve(__dirname, "fixtures", folder, "./**/*.js")
    );
    const { graph } = buildGraph(filePaths);

    const tree = toFractalTree(graph, findEntryPoints(graph));
    expect(tree).toEqual(resultingTree);
  });

  t("single-file-folder", {
    "file.js": "file.js",
    "page/page.js": "file/page.js",
  });
});

import { toFractalTree } from "../src/index/toFractalTree";
import { buildGraph } from "../src/index/buildGraph";
import { findEntryPoints } from "../src/index/findEntryPoints";
import path from "path";

const t = (folder: string, g2: any, entryPoints?: string[]) => {
  it(folder, () => {
    const g1 = buildGraph(path.join(__dirname, "fixtures", folder)).graph;
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
    "index.spec.js": "index/index.spec.js",
    "level1.js": "index/level1.js",
    "level1.spec.js": "index/level1/level1.spec.js",
    "level2.js": "index/level1/level2.js",
    "level2.spec.js": "index/level1/level2/level2.spec.js",
  });
});

import { buildGraph } from "../src/index/buildGraph";
import path from "path";

const t = (folder: string, g: any) => {
  it(folder, () => {
    expect(buildGraph(path.join(__dirname, folder)).graph).toEqual(g);
  });
};

describe("build graph", () => {
  t("simple", {
    "index.js": ["routes.js"],
    "routes.js": ["home.js"]
  });

  t("index-cycle", {
    "index.js": ["routes/index.js", "login/index.js"],
    "routes/index.js": ["home/index.js"],
    "login/index.js": ["utils/search.js"],
    "utils/search.js": ["index.js"]
  });
});

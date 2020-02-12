import { buildGraph } from "../src/buildGraph";
import path from "path";

describe("build graph", () => {
  it("simple", () => {
    expect(buildGraph(path.join(__dirname, "simple")).graph).toEqual({
      "index.js": ["routes.js"],
      "routes.js": ["home.js"]
    });
  });

  it("index", () => {
    expect(buildGraph(path.join(__dirname, "index")).graph).toEqual({
      "index.js": ["routes/index.js", "login/index.js"],
      "routes/index.js": ["home/index.js"],
      "login/index.js": ["utils/search.js"],
      "utils/search.js": ["index.js"]
    });
  });
});

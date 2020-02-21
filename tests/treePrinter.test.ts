import treePrinter from "../src/index/treePrinter";

treePrinter([
  "index.js",
  "index/index.css",
  "index/App.js",
  "index/Foo/foo.svg",
  "index/Foo/Bar/bar.css",
  "index/App/logo.svg",
  "index/App/App.css",
  "index/serviceWorker.js",
  "index/App.test.js",
]);

describe("treePrinter", () => {
  it("should", () => {
    expect(true).toBe(true);
  });
});

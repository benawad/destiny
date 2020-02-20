import treePrinter from "../src/index/treePrinter";

treePrinter({
  "index.js": "index.js",
  "index.css": "index/index.css",
  "App.js": "index/App.js",
  "foo.svg": "index/Foo/foo.svg",
  "logo.svg": "index/App/logo.svg",
  "App.css": "index/App/App.css",
  "serviceWorker.js": "index/serviceWorker.js",
  "App.test.js": "index/App.test.js",
});

describe("treePrinter", () => {
  it("should", () => {
    expect(true).toBe(true);
  });
});

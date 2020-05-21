import path from "path";
import fs from "fs";
import { findImports } from "../src/index/shared/findImports";

const t = (
  name: string,
  fixtureName: string,
  result: ReturnType<typeof findImports>
) => {
  it(name, () => {
    const fixturePath = path.resolve(
      __dirname,
      "imports",
      fixtureName,
      "index.js"
    );

    if (!fs.existsSync(fixturePath))
      throw Error(`Unable to resolve ${fixturePath}`);

    const resolvedImport = findImports(fixturePath);

    expect(resolvedImport).toEqual(result);
  });
};

describe("findImports", () => {
  t("resolve es6 default import", "es6-default", [
    { path: "./module", start: 25, end: 33 },
  ]);

  t("resolve es6 export from module", "es6-export-module", [
    { path: "./module", start: 15, end: 23 },
  ]);

  t("resolve es6 alias default import", "es6-alias-default", [
    { path: "./module", start: 25, end: 33 },
  ]);

  t("resolve es6 named import", "es6-named", [
    { path: "./module", start: 29, end: 37 },
  ]);

  t("resolve es5 require", "es5-require", [
    { path: "./module", start: 9, end: 17 },
  ]);

  t("resolve es5 require stored in variable", "es5-variable-require", [
    { path: "./module", start: 29, end: 37 },
  ]);

  t(
    "resolve es5 multiple require stored in chained variables",
    "es5-chained-variable-require",
    [
      { path: "./module1", start: 61, end: 70 },
      { path: "./module2", start: 95, end: 104 },
    ]
  );

  t(
    "doesn't ignore imports with a comment on the same line",
    "commented-line",
    [{ path: "./module", start: 20, end: 28 }]
  );

  t("doesn't match with imports in string", "import-in-string", [
    { path: "./module", start: 20, end: 28 },
  ]);
});

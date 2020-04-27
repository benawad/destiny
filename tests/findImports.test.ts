import path from "path";
import fs from "fs";
import { findImports } from "../src/index/shared/findImports";

const t = (name: string, fixtureName: string, result: string[]) => {
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
  t("resolve es6 default import", "es6-default", ["./module"]);

  t("resolve es6 export from module", "es6-export-module", ["./module"]);

  t("resolve es6 alias default import", "es6-alias-default", ["./module"]);

  t("resolve es6 named import", "es6-named", ["./module"]);

  t("resolve es5 require", "es5-require", ["./module"]);

  t("resolve es5 require stored in variable", "es5-variable-require", [
    "./module",
  ]);

  t(
    "resolve es5 multiple require stored in chained variables",
    "es5-chained-variable-require",
    ["./module1", "./module2"]
  );
});

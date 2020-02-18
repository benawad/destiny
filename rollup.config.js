import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import shebang from "rollup-plugin-add-shebang";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const dependencies = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  // Used Node.js built-ins:
  "path",
  "fs",
];

const removeRelativePath = dep => dep.replace(/^(\.{1,2}\/)+/, "");
const isExternalDependency = id =>
  dependencies.map(dep => removeRelativePath(id).startsWith(dep)).some(Boolean);

const defaults = {
  external: isExternalDependency,
  input: "src/index.ts",
  output: { exports: "named", indent: false },
  plugins: [
    nodeResolve({ extensions }),
    replace({ "process.env.NODE_ENV": "'production'" }),
    commonjs(),
    json(),
    babel({ extensions, runtimeHelpers: true }),
  ],
  treeshake: true,
};

export default [
  {
    // Default CommonJS build.
    ...defaults,
    output: { format: "cjs", file: `lib/${pkg.name}.js` },
    plugins: [
      ...defaults.plugins,
      shebang({
        include: `lib/${pkg.name}.js`,
      }),
    ],
  },

  {
    // Minified CommonJS build.
    ...defaults,
    output: { format: "cjs", file: `lib/${pkg.name}.min.js` },
    plugins: [
      ...defaults.plugins,
      shebang({
        include: `lib/${pkg.name}.min.js`,
      }),
      terser(),
    ],
  },
];

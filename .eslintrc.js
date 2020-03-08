const defaultSettings = {
  env: { es6: true, node: true },
  extends: ["standard", "prettier"],
  parser: "babel-eslint",
  rules: {
    "no-unused-vars": [
      "error",
      {
        args: "none",
        ignoreRestSiblings: true,
        vars: "all",
        varsIgnorePattern: "^_+$",
      },
    ],
  },
};

const typescriptSettings = {
  files: ["src/**/*.ts"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    project: "./tsconfig.json",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    ...defaultSettings.rules,
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: false },
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};

const testSettings = {
  ...typescriptSettings,
  env: { ...defaultSettings.env, jest: true },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  files: ["tests/**/*.ts", "**/*.test.ts"],
  rules: {
    ...typescriptSettings.rules,
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/first": "off",
  },
};

module.exports = {
  ...defaultSettings,
  overrides: [testSettings, typescriptSettings],
};

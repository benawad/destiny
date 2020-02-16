module.exports = {
  presets: [
    [
      "@babel/env",
      {
        corejs: 3,
        loose: true,
        modules: "cjs",
        targets: { node: 10 },
        useBuiltIns: "usage",
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-transform-typescript"],
    ["@babel/transform-runtime"],
  ],
};

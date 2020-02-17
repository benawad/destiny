const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        corejs: 3,
        loose: true,
        modules: NODE_ENV === "test" ? "auto" : false,
        targets: { node: 10 },
        useBuiltIns: "usage",
      },
    ],
    "@babel/typescript",
  ],
  plugins: [["@babel/transform-runtime"]],
};

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        corejs: 3,
        loose: true,
        modules: process.env.NODE_ENV === "test" ? "auto" : false,
        targets: { node: 10 },
        useBuiltIns: "usage",
      },
    ],
    "@babel/typescript",
  ],
  plugins: [["@babel/transform-runtime"]],
};

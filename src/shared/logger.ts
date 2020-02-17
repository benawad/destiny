import chalk from "chalk";

export const error = (err: Error | string, code = 0) => {
  if (err instanceof Error) {
    console.error(err);
  } else {
    console.error(chalk`{red.bold ERROR:} ${err}`);
  }
  console.log(
    "If you think this is a bug, you can report it: https://github.com/benawad/destiny/issues"
  );

  process.exit(code);
};

export const warn = (msg: string) => {
  console.log(chalk`{yellow.bold WARN:} ${msg}`);
};

export const info = (msg: string) => {
  console.log(chalk`{green.bold INFO:} ${msg}`);
};

export default { error, warn, info };

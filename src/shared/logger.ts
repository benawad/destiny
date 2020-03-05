import chalk from "chalk";

export const error = (err: Error | string, code = 0) => {
  if (process.env.NODE_ENV === "test") return;
  const text = err instanceof Error ? err : chalk.red.bold("ERROR: ") + err;
  console.error(text);
  console.log(
    "If you think this is a bug, you can report it: https://github.com/benawad/destiny/issues"
  );
  process.exit(code);
};

export const info = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  const text = chalk.green.bold("INFO: ") + msg;
  console.info(text);
};

export const log = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  console.log(msg);
};

export const warn = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  const text = chalk.yellow.bold("WARN: ") + msg;
  console.warn(text);
};

export default { error, info, log, warn };

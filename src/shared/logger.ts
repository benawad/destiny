import chalk from "chalk";
import fs from "fs";
import path from "path";

let loggerStdout = "";

export const error = (err: Error | string, code = 0) => {
  if (process.env.NODE_ENV === "test") return;
  const text = err instanceof Error ? err : chalk.red.bold("ERROR: ") + err;
  loggerStdout += `${err}\n`;
  console.error(text);
  console.log(
    "If you think this is a bug, you can report it: https://github.com/benawad/destiny/issues"
  );
  process.exit(code);
};

export const info = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  const text = chalk.green.bold("INFO: ") + msg;
  loggerStdout += `${msg}\n`;
  console.info(text);
};

export const log = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  loggerStdout += `${msg}\n`;
  console.log(msg);
};

export const warn = (msg: string) => {
  if (process.env.NODE_ENV === "test") return;
  const text = chalk.yellow.bold("WARN: ") + msg;
  loggerStdout += `${msg}\n`;
  console.warn(text);
};

let isDebuggerEnabled = false;
let lastDebugTimestamp: number | null = null;

export const enableDebugger = () => {
  isDebuggerEnabled = true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (msg: string, ...data: any[]) => {
  if (process.env.NODE_ENV === "test" || !isDebuggerEnabled) return;

  const currentDebugTimestamp = Date.now();
  const text =
    chalk.magenta.bold("DEBUG: ") +
    chalk.yellow.bold(
      `+${
        lastDebugTimestamp ? currentDebugTimestamp - lastDebugTimestamp : 0
      }ms `
    ) +
    msg;

  loggerStdout += `${msg}\n`;
  console.info(text);

  lastDebugTimestamp = currentDebugTimestamp;

  if (data.length > 0) {
    console.group();
    data.forEach(d => {
      console.log(d, "\n");
    });
    console.groupEnd();
  }
};

export const writeDebugStdout = (filePath: string) => {
  if (process.env.NODE_ENV === "test" || !isDebuggerEnabled) return;

  const resolvedFilePath = path.resolve(filePath);

  if (fs.existsSync(resolvedFilePath))
    error(
      `The debug file output already exist "${resolvedFilePath}".\nPlease give a path to a non existing file.`
    );

  fs.writeFileSync(resolvedFilePath, loggerStdout, "utf8");

  debug(`stdout written in "${resolvedFilePath}"`);
};

export default {
  error,
  info,
  log,
  warn,
  enableDebugger,
  debug,
  writeDebugStdout,
};

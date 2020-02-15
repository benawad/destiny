#!/usr/bin/env node
import commander from "commander";
import glob from "glob";
import { formatFileStructure } from "./index/formatFileStructure";

export const cli = new commander.Command();

cli
  .version("0.0.11")
  .name("butler")
  .description("Prettier for File Structures")
  .arguments("<path>")
  .action(path => {
    if (path === "help") return;

    const filesToStructure = glob.sync(path);
    const filesToFixImports = filesToStructure;
    formatFileStructure(filesToStructure, filesToFixImports);
  })
  // keep at the end
  .parse(process.argv);

if (process.argv.length < 3) {
  cli.help();
}

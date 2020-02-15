#!/usr/bin/env node
import { existsSync } from "fs";
import commander from "commander";
import { formatFileStructure } from "./index/formatFileStructure";

export const cli = new commander.Command();

cli
  .version("0.0.11")
  .name("butler")
  .description("Prettier for File Structures")
  .arguments("<path>")
  .action(async start => {
    if (start === "help") return;

    if (!existsSync(start)) {
      console.log("path does not exist: ", start);
      process.exit(1);
    }

    await formatFileStructure(start);
  })
  // keep at the end
  .parse(process.argv);

if (process.argv.length < 3) {
  cli.help();
}

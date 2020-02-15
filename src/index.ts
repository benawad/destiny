#!/usr/bin/env node
import { existsSync } from "fs";
import { formatFileStructure } from "./index/formatFileStructure";

(async () => {
  if (process.argv.length < 3) {
    console.log("expected argument (path to your src folder)");
    return;
  }

  const start = process.argv[2];
  if (!existsSync(start)) {
    console.log("path does not exist: ", start);
    return;
  }

  formatFileStructure(start);
})();

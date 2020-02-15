#!/usr/bin/env node
import { buildGraph } from "./index/buildGraph";
import { findEntryPoints } from "./index/findEntryPoints";
import { syncFileSystem } from "./index/syncFileSystem";
import { toFractalTree } from "./index/toFractalTree";
import { removeEmptyFolders } from "./index/removeEmptyFolders";
import { existsSync } from "fs";
import { flatten } from "./shared/flatten";

(() => {
  if (process.argv.length < 3) {
    console.log("expected argument (path to your src folder)");
    return;
  }

  const start = process.argv[2];
  if (!existsSync(start)) {
    console.log("path does not exist: ", start);
  }

  const { graph, oldGraph, files, useForwardSlash } = buildGraph(start);
  const tree = toFractalTree(graph, findEntryPoints(graph));
  syncFileSystem(oldGraph, tree, start, useForwardSlash);
  removeEmptyFolders(start);
  const usedFiles = new Set([
    ...Object.keys(graph),
    ...flatten(Object.values(graph)),
  ]);
  const unusedFiles: string[] = [];
  files.forEach(file => {
    if (!usedFiles.has(file)) {
      unusedFiles.push(file);
    }
  });
  if (unusedFiles.length) {
    console.log("unused files:");
    unusedFiles.forEach(f => console.log(f));
  }
})();

import fs from "fs";
import path from "path";
import { buildGraph } from "./buildGraph";
import { toFractalTree } from "./toFractalTree";
import { findEntryPoints } from "./findEntryPoints";
import { syncFileSystem } from "./syncFileSystem";

(() => {
  console.log("hear");
  // testing :)
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  fs.rmdirSync(path.join(__dirname, "../tmp/src"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, "../tmp/src"));
  if (process.argv.length < 3) {
    return;
  }

  const { graph, oldGraph } = buildGraph(process.argv[2]);
  const tree = toFractalTree(graph, findEntryPoints(graph));
  syncFileSystem(oldGraph, tree, path.join(__dirname, "../tmp/src"));
  // graphToFractalTree(
  //   graph,
  //   "../../debugging/recyclerlistview/src",
  //   path.join(__dirname, "../tmp/src")
  // );
})();

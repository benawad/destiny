import fs from "fs";
import path from "path";
import { buildGraph } from "./buildGraph";
import { toFractalTree } from "./toFractalTree";
import { findEntryPoints } from "./findEntryPoints";
import { syncFileSystem } from "./syncFileSystem";
import rimraf from "rimraf";

(() => {
  console.log("hear");
  // testing :
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  rimraf.sync(path.join(__dirname, "../tmp/src"));
  fs.mkdirSync(path.join(__dirname, "../tmp/src"));
  if (process.argv.length < 3) {
    return;
  }

  const { graph, oldGraph } = buildGraph(process.argv[2]);
  const tree = toFractalTree(graph, findEntryPoints(graph));
  // syncFileSystem(oldGraph, tree, path.join(__dirname, "../tmp/src"));
  syncFileSystem(oldGraph, tree, process.argv[2]);
  // graphToFractalTree(
  //   graph,
  //   "../../debugging/recyclerlistview/src",
  //   path.join(__dirname, "../tmp/src")
  // );
})();

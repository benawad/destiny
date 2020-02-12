import { buildGraph } from "./buildGraph";
import { toFractalTree } from "./toFractalTree";
import { findEntryPoints } from "./findEntryPoints";
import { syncFileSystem } from "./syncFileSystem";
import { removeEmptyFolders } from "./removeEmptyFolders";
import path = require("path");

(() => {
  console.log("hear");
  // testing :
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  // const start = process.argv[2];
  const start = path.join(__dirname, "../src");
  if (process.argv.length < 3) {
    return;
  }

  const { graph, oldGraph } = buildGraph(start);
  const tree = toFractalTree(graph, findEntryPoints(graph));
  // syncFileSystem(oldGraph, tree, path.join(__dirname, "../tmp/src"));
  syncFileSystem(oldGraph, tree, start);
  removeEmptyFolders(start);
  // graphToFractalTree(
  //   graph,
  //   "../../debugging/recyclerlistview/src",
  //   path.join(__dirname, "../tmp/src")
  // );
})();

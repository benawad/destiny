import fs from "fs";
import path from "path";
import { buildGraph } from "./buildGraph";

function getSharedParent(path1: string, path2: string) {
  while (true) {
    if (!path1 || !path2) {
      throw new Error("could not find shared parent");
    }

    if (path1 === path2) {
      return path1;
    }

    if (path1.includes(path2)) {
      return path2;
    }

    if (path2.includes(path1)) {
      return path1;
    }

    path1 = path.dirname(path1);
    path2 = path.dirname(path2);
  }
}

(() => {
  console.log("hear");
  // testing :)
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  fs.rmdirSync(path.join(__dirname, "../tmp/src"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, "../tmp/src"));
  if (process.argv.length < 3) {
    return;
  }

  const { graph } = buildGraph(process.argv[2]);
  console.log(graph);
  // graphToFractalTree(
  //   graph,
  //   "../../debugging/recyclerlistview/src",
  //   path.join(__dirname, "../tmp/src")
  // );
})();

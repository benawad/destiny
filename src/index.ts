import fs from "fs";
import path from "path";

type Graph = Record<string, string[]>;

function importToAbsolutePath(filePath: string, importPath: string) {
  return path.join(path.dirname(filePath), importPath);
}

const importRegex = /(?:from\s+|require\()["']((?:\.|\.\.)\/.+)["']/gm;
function findEdges(filePath: string) {
  const text = fs.readFileSync(filePath).toString();
  const edges: Array<[string, string]> = [];
  const filePathWithoutExtension = path.join(
    path.dirname(filePath),
    path.basename(filePath)
  );

  let m;

  while ((m = importRegex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === importRegex.lastIndex) {
      importRegex.lastIndex++;
    }

    const importPath = importToAbsolutePath(filePath, m[1]);

    // if (
    //   "/Users/benawad/Documents/programming/debugging/recyclerlistview/src/core/sticky/StickyFooter" ===
    //   filePathWithoutExtension
    // ) {
    //   console.log("----");
    //   console.log(filePathWithoutExtension, m[1]);
    //   console.log(importPath);
    // }
    // if (filePathWithoutExtension.includes("ResizeDebugHandler")) {
    //   console.log("----");
    //   console.log(filePath);
    //   console.log(m[1], importPath);
    // }
    edges.push([filePathWithoutExtension, importPath]);
  }

  return edges;
}

function addEdge([start, end]: [string, string], graph: Graph) {
  if (!(start in graph)) {
    graph[start] = [];
  }

  graph[start].push(end);
}

function buildGraph(folderPath: string) {
  const graph: Graph = {};
  const files: string[] = [];
  const recurse = (folderPath: string) => {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (file === ".git") {
        continue;
      }
      // console.log(file);
      const fullPath = path.resolve(path.join(folderPath, file));
      // check if it's a file if it has an extension
      if (file.split(".").length > 1) {
        findEdges(fullPath).map(edge => addEdge(edge, graph));
      } else {
        recurse(fullPath);
      }
    }
  };

  recurse(folderPath);

  return { graph, files };
}

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

function resolveExtensionAndIndex(filePath: string): string {
  if (path.extname(filePath)) {
    return filePath;
  }

  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    return resolveExtensionAndIndex(path.join(filePath, "index"));
  }

  const basename = path.basename(filePath);
  const folder = path.dirname(filePath);
  const files = fs.readdirSync(folder);

  const filePathWithExtension = files.find(
    f => path.basename(f, path.extname(f)) === basename
  );

  return filePathWithExtension
    ? path.join(folder, filePathWithExtension)
    : path.resolve(filePath);
}

function buildFileStructure(filePaths: string[], graph: Graph) {
  const done: Record<string, string> = {};

  const fn = (filePath: string, graph: Graph) => {
    if (path.extname(filePath)) {
      // console.log(filePath, destination);
    }
    const filePathWithExtension = resolveExtensionAndIndex(filePath);
    // console.log(
    //   filePathWithExtension,
    //   path.join(destination, basenameWithExtension)
    // );
    const fullDest = path.join(fileDest, path.basename(filePathWithExtension));
    try {
      fs.copyFileSync(filePathWithExtension, fullDest);
    } catch (err) {
      if (!err.message.includes("already exists")) {
        throw err;
      }
    }
    done[filePath] = fullDest;
    const imports = graph[filePath];
    if (imports && imports.length) {
      const folderName = path.basename(filePath, path.extname(filePath));
      const newDestination = path.join(fileDest, folderName);
      try {
        fs.mkdirSync(newDestination);
      } catch (err) {
        if (!err.message.includes("already exists")) {
          throw err;
        }
      }
      for (const importFilePath of imports) {
        if (importFilePath in done) {
          // check for cycle
          const depImports = graph[importFilePath];
          if (depImports && depImports.includes(filePath)) {
            console.log("found cycle");
            continue;
          } else {
            // shared file so move it up
            console.log("shared: ", importFilePath, filePath);
            // @todo use new [path]
            const parent = getSharedParent(importFilePath, filePath);
            const sharedPath = path.join(parent, "shared");
            if (!fs.existsSync(sharedPath)) {
              fs.mkdirSync(sharedPath);
            }
            const currentPath = done[importFilePath];
            console.log(
              "found shared file: ",
              path.basename(importFilePath),
              currentPath
            );
            const newImportDest = path.join(
              sharedPath,
              path.basename(currentPath)
            );
            fs.renameSync(currentPath, newImportDest);
            done[importFilePath] = newImportDest;
            continue;
          }
        }
        console.log("import: ", importFilePath, filePath);
        fn(importFilePath, graph, newDestination);
      }
    }
  };

  for (const filePath of filePaths) {
    fn(filePath, graph);
  }
}

function graphToFractalTree(graph: Graph, oldPath: string, newPath: string) {
  const importedFiles = new Set(Object.values(graph).flat());
  const possibleEntryPoints = Object.keys(graph);

  const entryPoints = possibleEntryPoints.filter(
    file => !importedFiles.has(file)
  );

  // console.log(entryPoints);
  buildFileStructure(entryPoints, graph, oldPath, newPath);
}

(() => {
  // testing :)
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  fs.rmdirSync(path.join(__dirname, "../tmp/src"), { recursive: true });
  fs.mkdirSync(path.join(__dirname, "../tmp/src"));
  if (process.argv.length < 3) {
    return;
  }

  const { graph } = buildGraph(process.argv[2]);
  graphToFractalTree(
    graph,
    "../../debugging/recyclerlistview/src",
    path.join(__dirname, "../tmp/src")
  );
})();

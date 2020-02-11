import fs from "fs";
import path from "path";

type Graph = Record<string, string[]>;

function fileToFolder(filePath: string) {
  const parts = filePath.split("/");
  return parts.slice(0, parts.length - 1).join("/");
}

function importToAbsolutePath(filePath: string, importPath: string) {
  return path.join(fileToFolder(filePath), importPath);
}

const importRegex = /(?:from\s+|require\()["']((?:\.|\.\.)\/.+)["']/gm;
function findEdges(filePath: string) {
  const text = fs.readFileSync(filePath).toString();
  const edges: Array<[string, string]> = [];

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
    edges.push([filePath, importPath]);
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

function resolveExtensionAndIndex(filePath: string): string {
  if (path.extname(filePath)) {
    return filePath;
  }

  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
    return resolveExtensionAndIndex(path.join(filePath, "index"));
  }

  const basename = path.basename(filePath);
  const folder = fileToFolder(filePath);
  const files = fs.readdirSync(folder);

  const filePathWithExtension = files.find(
    f => path.basename(f, path.extname(f)) === basename
  );

  return filePathWithExtension
    ? path.join(folder, filePathWithExtension)
    : path.resolve(filePath);
}

// let i = 0;
function buildFileStructure(
  filePath: string,
  graph: Graph,
  destination: string
) {
  const done: Record<string, string> = {};

  const fn = (filePath: string, graph: Graph, destination: string) => {
    const filePathWithExtension = resolveExtensionAndIndex(filePath);
    // console.log(
    //   filePathWithExtension,
    //   path.join(destination, basenameWithExtension)
    // );
    const fullDest = path.join(
      destination,
      path.basename(filePathWithExtension)
    );
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
      const newDestination = path.join(destination, folderName);
      try {
        fs.mkdirSync(newDestination);
      } catch (err) {
        if (!err.message.includes("already exists")) {
          throw err;
        }
      }
      for (const importFilePath of imports) {
        if (importFilePath in done) {
          continue;
        }
        fn(importFilePath, graph, newDestination);
      }
    }
  };

  fn(filePath, graph, destination);
}

function graphToFractalTree(graph: Graph) {
  const importedFiles = new Set(Object.values(graph).flat());
  const possibleEntryPoints = Object.keys(graph);

  const entryPoints = possibleEntryPoints.filter(
    file => !importedFiles.has(file)
  );

  const destination = path.join(__dirname, "../tmp/src");

  // console.log(entryPoints);
  for (const entryPoint of entryPoints) {
    buildFileStructure(entryPoint, graph, destination);
  }

  // console.log(entryPoints);
  // console.log(
  //   graph[
  //     "/Users/benawad/Documents/programming/debugging/recyclerlistview/src/core/sticky/StickyFooter"
  //   ]
  // );
}

(() => {
  // testing :)
  process.argv = ["", "", "../../debugging/recyclerlistview/src"];
  if (process.argv.length < 3) {
    return;
  }

  const { graph } = buildGraph(process.argv[2]);
  graphToFractalTree(graph);
})();

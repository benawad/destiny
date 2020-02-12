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

// function buildFileStructure(filePaths: string[], graph: Graph) {
//   const done: Record<string, string> = {};

//   const fn = (filePath: string, graph: Graph) => {
//     if (path.extname(filePath)) {
//       // console.log(filePath, destination);
//     }
//     const filePathWithExtension = resolveExtensionAndIndex(filePath);
//     // console.log(
//     //   filePathWithExtension,
//     //   path.join(destination, basenameWithExtension)
//     // );
//     const fullDest = path.join(fileDest, path.basename(filePathWithExtension));
//     try {
//       fs.copyFileSync(filePathWithExtension, fullDest);
//     } catch (err) {
//       if (!err.message.includes("already exists")) {
//         throw err;
//       }
//     }
//     done[filePath] = fullDest;
//     const imports = graph[filePath];
//     if (imports && imports.length) {
//       const folderName = path.basename(filePath, path.extname(filePath));
//       const newDestination = path.join(fileDest, folderName);
//       try {
//         fs.mkdirSync(newDestination);
//       } catch (err) {
//         if (!err.message.includes("already exists")) {
//           throw err;
//         }
//       }
//       for (const importFilePath of imports) {
//         if (importFilePath in done) {
//           // check for cycle
//           const depImports = graph[importFilePath];
//           if (depImports && depImports.includes(filePath)) {
//             console.log("found cycle");
//             continue;
//           } else {
//             // shared file so move it up
//             console.log("shared: ", importFilePath, filePath);
//             // @todo use new [path]
//             const parent = getSharedParent(importFilePath, filePath);
//             const sharedPath = path.join(parent, "shared");
//             if (!fs.existsSync(sharedPath)) {
//               fs.mkdirSync(sharedPath);
//             }
//             const currentPath = done[importFilePath];
//             console.log(
//               "found shared file: ",
//               path.basename(importFilePath),
//               currentPath
//             );
//             const newImportDest = path.join(
//               sharedPath,
//               path.basename(currentPath)
//             );
//             fs.renameSync(currentPath, newImportDest);
//             done[importFilePath] = newImportDest;
//             continue;
//           }
//         }
//         console.log("import: ", importFilePath, filePath);
//         fn(importFilePath, graph, newDestination);
//       }
//     }
//   };

//   for (const filePath of filePaths) {
//     fn(filePath, graph);
//   }
// }

// function graphToFractalTree(graph: Graph, oldPath: string, newPath: string) {
//   const importedFiles = new Set(Object.values(graph).flat());
//   const possibleEntryPoints = Object.keys(graph);

//   const entryPoints = possibleEntryPoints.filter(
//     file => !importedFiles.has(file)
//   );

//   // console.log(entryPoints);
//   buildFileStructure(entryPoints, graph);
// }

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

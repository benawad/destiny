import path from "path";

import logger from "../../shared/logger";
import { Graph } from "./shared/Graph";
import { findSharedParent } from "./shared/findSharedParent";
import { hasCycle } from "./toFractalTree/hasCycle";
import { RootOption } from "../shared/RootOption";
import { isLinkedFile, linkedFileToOriginal } from "./shared/isLinkedFile";
import chalk from "chalk";
import { fileWithoutExtension } from "../shared/fileWithoutExtension";
import { isTestFile } from "./shared/isTestFile";

function getFileName(currentPath: string) {
  const fileName = path.basename(currentPath, path.extname(currentPath));
  const currentFolder = path.basename(path.dirname(currentPath));

  if (fileName === "index" && currentFolder && currentFolder !== ".") {
    return currentFolder;
  }

  return fileName;
}

interface FractalTreeConfig {
  nestMainModules: boolean;
}

export function toFractalTree(
  graph: Graph,
  entryPoints: string[],
  { nestMainModules }: FractalTreeConfig
) {
  const tree: RootOption["tree"] = {};
  const treeSet = new Set<string>();
  const dependencies: Record<string, string[]> = {};
  const linkedFiles = new Set<string>();
  let containsCycle = false;

  const addDependency = (key: string, location: string) => {
    if (!Array.isArray(dependencies[key])) {
      dependencies[key] = [];
    }

    dependencies[key].push(location);
  };

  const checkDuplicates = (
    location: string,
    dirname: string,
    filePath: string
  ) => {
    const hasLocation = treeSet.has(location);

    if (hasLocation) {
      const newLocation = path.join(dirname, filePath.replace(/\//g, "-"));
      logger.info(`File renamed: ${filePath} -> ${newLocation}`);

      return newLocation;
    }

    return location;
  };

  const changeImportLocation = (
    filePath: string,
    newLocation: string
  ): void => {
    tree[filePath] = newLocation;

    treeSet.add(newLocation);
  };

  const updateDependencyImportPaths = (
    currentPath: string,
    newDirPath: string
  ): void => {
    const imports = graph[currentPath];
    if (imports?.length > 0) {
      for (const importFilePath of imports) {
        const filename = path.basename(importFilePath);
        const newLocation = path.join(newDirPath, filename);
        changeImportLocation(importFilePath, newLocation);
        updateDependencyImportPaths(importFilePath, tree[importFilePath]);
      }
    }
  };

  const fn = (
    filePath: string,
    parentfolderPath: string,
    parentFileName: string,
    graph: Graph
  ) => {
    const basename = path.basename(filePath);
    if (isLinkedFile(basename)) {
      linkedFiles.add(filePath);
      return;
    }

    let fileName = getFileName(filePath);
    const isGlobal = filePath.includes("..");
    const imports = graph[filePath];

    let folderPath;
    if (nestMainModules) {
      if (imports?.length > 0 && !entryPoints.includes(filePath)) {
        folderPath = path.join(parentfolderPath, fileName);
      } else {
        folderPath = parentfolderPath;
      }
    } else {
      folderPath = path.join(parentfolderPath, parentFileName);
    }

    const tempLocation = isGlobal
      ? filePath
      : path.join(folderPath, fileName + path.extname(filePath));

    const location = checkDuplicates(tempLocation, folderPath, filePath);
    fileName = path.basename(location, path.extname(location));

    if (!isGlobal) {
      changeImportLocation(filePath, location);
    }

    if (imports?.length > 0) {
      for (const importFilePath of imports) {
        // if importFilePath includes .. then it's a global
        // we don't store globals in tree, so check if cycle
        if (importFilePath in tree || importFilePath.includes("..")) {
          const cycle = hasCycle(importFilePath, graph, new Set());

          if (cycle) {
            containsCycle = true;
            logger.warn(`Dependency cycle detected: ${cycle.join(" -> ")}`);
          } else {
            addDependency(importFilePath, location);
          }
          continue;
        }

        addDependency(importFilePath, location);

        fn(importFilePath, folderPath, fileName, graph);
      }
    }
  };

  for (const filePath of entryPoints) {
    fn(filePath, "", "", graph);
  }

  if (!containsCycle) {
    Object.entries(dependencies).forEach(([currentPath, dependencies]) => {
      if (dependencies.length <= 1 || currentPath.includes("..")) {
        return;
      }

      const parent = findSharedParent(dependencies);

      const fileName = getFileName(currentPath);

      const newFilePath = path.join(parent, "shared");

      let newDirPath;
      if (nestMainModules) {
        if (graph[currentPath]?.length > 0) {
          newDirPath = path.join(newFilePath, fileName);
        } else {
          newDirPath = path.join(newFilePath);
        }
      } else {
        newDirPath = path.join(newFilePath);
      }

      changeImportLocation(
        currentPath,
        path.join(newDirPath, fileName + path.extname(currentPath))
      );
      // propagate path changes to sub-dependencies
      const dependenciesDirPath = nestMainModules
        ? newDirPath
        : path.join(newDirPath, fileName);

      updateDependencyImportPaths(currentPath, dependenciesDirPath);
    });
  }

  const treeKeys = Object.keys(tree);

  if (linkedFiles.size > 0) {
    // const globalTests = [];

    for (const linkedFile of linkedFiles) {
      const sourceFile = linkedFileToOriginal(linkedFile);
      const oneDirUp = path.join(
        path.dirname(sourceFile),
        "..",
        path.basename(sourceFile)
      );
      // source file will either be in the current dir or one up
      let sourceFilePath = tree[sourceFile] || tree[oneDirUp];

      // sometimes the test is add.test.jsx and the source is add.test.js
      // so we have to do a linear search to find source key
      // we could probably optimize this if needed by doing some work in the fn above
      if (!sourceFilePath) {
        const sourceFileWithoutFileExtension = fileWithoutExtension(sourceFile);
        for (const key of treeKeys) {
          if (path.basename(key).startsWith(sourceFileWithoutFileExtension)) {
            sourceFilePath = tree[key];
            break;
          }
        }
      }

      if (!sourceFilePath && isTestFile(linkedFile)) {
        // could not link by filename
        // so the backup is linking by first relative import
        const [firstRelativeImport] = graph[linkedFile];
        if (firstRelativeImport) {
          sourceFilePath = tree[firstRelativeImport];
        }
      }

      if (!sourceFilePath) {
        logger.warn(
          `could not find source file that is linked to ${chalk.blueBright(
            linkedFile
          )} | 2 locations were checked: ${chalk.blueBright(
            sourceFile
          )} and ${chalk.blueBright(oneDirUp)}`
        );
        continue;
      }

      const isSnapshot = linkedFile.endsWith(".snap");

      const location = checkDuplicates(
        path.join(
          path.dirname(sourceFilePath),
          isSnapshot ? "__snapshot__" : "",
          path.basename(linkedFile)
        ),
        path.dirname(sourceFilePath),
        linkedFile
      );

      changeImportLocation(linkedFile, location);
    }
  }

  return tree;
}

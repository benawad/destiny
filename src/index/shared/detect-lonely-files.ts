import path from "path";

const extractParentDirectory = (destination: string): string | undefined => {
  const parts = destination.split(path.sep);

  if (parts.length === 1) {
    return;
  }

  parts.pop();

  return parts.join(path.sep);
};

const moveUp = (destinationPath: string) => {
  const parts = destinationPath.split(path.sep);

  return [...parts.slice(0, parts.length - 2), parts[parts.length - 1]].join(
    path.sep
  );
};

export const detectLonelyFiles = (tree: Record<string, string>) => {
  const fractalTree = { ...tree };
  // Reverse lookup destination -> current location
  const reversedFractalTree: Record<string, string> = {};

  for (const [currentFilePath, destinationFilePath] of Object.entries(
    fractalTree
  )) {
    reversedFractalTree[destinationFilePath] = currentFilePath;
  }

  const dirCounter: Record<string, number> = {};

  // Sort is important here since we want to go from deep in the file structure to top
  const currentDestinations = Object.values(fractalTree).sort(
    (a, b) => b.length - a.length
  );

  // Count all occurencies of the parent dirs of the current destinations
  for (const currentDestination of currentDestinations) {
    const parentDir = extractParentDirectory(currentDestination);

    if (!parentDir) {
      continue;
    }

    if (parentDir in dirCounter) {
      dirCounter[parentDir] = dirCounter[parentDir] + 1;
      continue;
    }

    dirCounter[parentDir] = 1;
  }

  /**
   * Loop over all the destinations again and move them up if they are lonely files
   */
  for (const currentDestination of currentDestinations) {
    const startParentDir = extractParentDirectory(currentDestination);

    if (!startParentDir) {
      continue;
    }

    let counter = dirCounter[startParentDir];
    let newDestination = currentDestination;
    let parentDir: string | undefined = startParentDir;

    while (counter === 1) {
      parentDir = extractParentDirectory(newDestination);

      if (!parentDir) {
        break;
      }

      if (startParentDir === parentDir) {
        counter = 1;
      } else if (parentDir in dirCounter) {
        counter = dirCounter[parentDir] + 1;
      }

      dirCounter[parentDir] = counter;

      if (counter === 1) {
        newDestination = moveUp(newDestination);
      }
    }

    fractalTree[reversedFractalTree[currentDestination]] = newDestination;
  }

  return fractalTree;
};

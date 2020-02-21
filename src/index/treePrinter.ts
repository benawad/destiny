/**
 * TODO:
 * - ASCII pieces to use: ├, │, └, ─.
 */

const createBranchFromParts = (parts: string[], count: number) =>
  parts.slice(0, count).join("/");

const removePathDuplication = (target: string, match: string) =>
  target.replace(new RegExp(`^(/*)${match.replace(/\//, "")}(/+)`), "$1$2");

const sanitizeDots = (text: string) => text.replace(/\./g, "");
const compareLeafs = (a: string, b: string) =>
  sanitizeDots(a).localeCompare(sanitizeDots(b));

/** Resolve every unique leaf from a list of paths. */
const resolveLeafs = (paths: string[]) => {
  const leafs = paths.reduce<Set<string>>((acc, target) => {
    const parts = target.split("/");

    parts.forEach((_, idx) => acc.add(createBranchFromParts(parts, idx + 1)));
    return acc;
  }, new Set());

  return Array.from(leafs).sort(compareLeafs);
};

/**
 * Iterates over all leafs and positions them on the correct branches, ie
 * resolving their end name in relation to their branch and their position.
 */
const positionLeafs = (leafs: string[]) => {
  const res = [];

  let queue = [...leafs];
  while (queue.length > 0) {
    const leaf = queue.shift();

    if (leaf == null) break;
    queue = queue.map(queuedLeaf => removePathDuplication(queuedLeaf, leaf));

    res.push(leaf);
  }

  return res.map(x => {
    const parts = x.split("/");
    return { text: parts.pop() ?? "", position: parts.length };
  });
};

/** Prints a tree visualization of given paths. */
export const treePrinter = (paths: string[]) => {
  const leafs = resolveLeafs(paths);
  const positionedLeafs = positionLeafs(leafs);

  console.log(leafs);
  console.log(positionedLeafs);
};

export default treePrinter;

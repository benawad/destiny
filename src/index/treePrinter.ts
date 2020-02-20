/**
 * TODO:
 * - ASCII pieces to use: ├, │, └, ─.
 */

const createBranchFromParts = (parts: string[], count: number) =>
  parts.slice(0, count).join("/");
const sanitizeDots = (text: string) => text.replace(/\./g, "");
const compareLeafs = (a: string, b: string) =>
  sanitizeDots(a).localeCompare(sanitizeDots(b));

const resolveLeafs = (targets: string[]) => {
  const leafs = targets.reduce<Set<string>>((acc, target) => {
    const parts = target.split("/");

    parts.forEach((_, idx) => acc.add(createBranchFromParts(parts, idx + 1)));
    return acc;
  }, new Set());

  return Array.from(leafs).sort(compareLeafs);
};

export const treePrinter = (tree: Record<string, string>) => {
  const targets = Object.values(tree);
  const leafs = resolveLeafs(targets);

  console.log(leafs);
};

export default treePrinter;

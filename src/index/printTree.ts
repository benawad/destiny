type PositionedLeaf = { text: string; position: number };

const createBranchFromParts = (parts: string[], count: number) =>
  parts.slice(0, count).join("/");

/** Remove path that matches `match` but save '/' to calculate position. */
const removePathDuplication = (target: string, match: string) =>
  target.replace(new RegExp(`^(/*)${match.replace(/\//g, "")}(/+)`), "$1$2");

/**
 * Matches anything between '/' and '.' and prepends the highest possible char
 * code to it. This enables us sort files lower than directories.
 */
const prependMaxCharCodeToFile = (text: string) =>
  text.replace(
    /([^/]+)(?=\.)/g,
    String.fromCharCode(Number.MAX_SAFE_INTEGER) + "$1"
  );
const compareLeafs = (a: string, b: string) =>
  prependMaxCharCodeToFile(a).localeCompare(prependMaxCharCodeToFile(b));

/** Check if leaf is the last of its siblings excluding children. */
const isLeafLastSibling = (
  leaf: PositionedLeaf,
  remainingLeafs: PositionedLeaf[]
) => {
  for (const remaningLeaf of remainingLeafs) {
    if (remaningLeaf.position > leaf.position) continue;
    if (remaningLeaf.position < leaf.position) return true;
    return false;
  }

  return true;
};

const removeIllicitIndentGuidelines = (line: string, pastLine: string) => {
  const isCharEndConnectorOrWhitespace = (char: string) =>
    char === "└" || char === " ";

  return Array.from(line)
    .map((char, idx) =>
      char === "│" && isCharEndConnectorOrWhitespace(pastLine[idx]) ? " " : char
    )
    .join("");
};

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
 * Iterates over all leafs and positions them on the correct branches, ie.
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

/** Print a visualization of a tree of paths. */
export const printTree = (paths: string[]) => {
  const leafs = resolveLeafs(paths);
  const positionedLeafs = positionLeafs(leafs);

  const treeVisualization = positionedLeafs
    .reduce<string[]>((lines, currentLeaf, idx) => {
      const pastLine = lines[idx - 1] ?? "";
      const remainingLeafs = positionedLeafs.slice(idx + 1);

      const indent =
        currentLeaf.position > 0 ? "│  ".repeat(currentLeaf.position) : "";
      const connector = isLeafLastSibling(currentLeaf, remainingLeafs)
        ? "└──"
        : "├──";
      const line = indent + connector + currentLeaf.text;

      lines.push(removeIllicitIndentGuidelines(line, pastLine));
      return lines;
    }, [])
    .join("\n");

  console.log(treeVisualization);
};

export default printTree;

export function flatten<T>(input: T[][]): T[] {
  const stack: Array<T[] | T> = [...input];
  const res: T[] = [];
  while (stack.length) {
    // pop value from stack
    const next = stack.pop();
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next!);
    }
  }
  // reverse to restore input order
  return res.reverse();
}

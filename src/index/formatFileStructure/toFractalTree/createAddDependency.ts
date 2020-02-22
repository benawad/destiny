export function createAddDependency(dependencyIndex: Record<string, string[]>) {
  return (fileName: string, dependency: string) => {
    const is = fileName in dependencyIndex;
    if (!is) dependencyIndex[fileName] = [];
    dependencyIndex[fileName].push(dependency);
  };
}

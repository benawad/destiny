export const isTestFile = (f: string) =>
  /\.test\.|\.spec\.|\.stories\./.test(f);

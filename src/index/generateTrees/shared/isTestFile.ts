export const isTestFile = (f: string) =>
  /\.test\.|\.spec\.|\.story\.|\.stories\./.test(f);

const linkedRegex = /\.test\.|\.spec\.|\.d\.|@2x\.|@3x\.|\.snap|\.story\.|\.stories\./;

export const isLinkedFile = (f: string) => linkedRegex.test(f);

// add.test.js => add.js
export const linkedFileToOriginal = (f: string) => {
  if (f.endsWith(".snap")) {
    return f.replace(".snap", "");
  }
  return f.replace(linkedRegex, ".");
};

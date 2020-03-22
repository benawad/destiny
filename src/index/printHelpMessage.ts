import chalk from "chalk";

type Option = {
  flags: string[];
  description: string;
};

/** Format the given options and print the help message */
export const printHelpMessage = (options: Option[]) => {
  const indent = "  ";

  console.log(chalk`{blue destiny} - Prettier for file structures.

{bold USAGE}

${indent}{blue destiny} [option...] [{underline path}]

${indent}The {underline path} argument can consist of either a {bold file path} or a {bold glob}.

{bold OPTIONS}
`);

  // options
  const optionsWithJoinedFlags = options.map(opt => ({
    ...opt,
    flags: opt.flags.join(", "),
  }));

  const [longestFlag] = [...optionsWithJoinedFlags].sort(
    (a, b) => b.flags.length - a.flags.length
  );

  const descriptionsX = `${longestFlag.flags}${indent}${indent}`.length;

  const parsedOptionsMessage = optionsWithJoinedFlags
    .map(({ flags, description }) => {
      const numOfSpacesToAdd = descriptionsX - flags.length;

      return `${indent}${flags}${Array(numOfSpacesToAdd)
        .fill(" ")
        .join("")}${description}`;
    })
    .join("\n");

  console.log(parsedOptionsMessage, "\n");
};

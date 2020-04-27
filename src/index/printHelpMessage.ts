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

  const descriptionsPosX = `${longestFlag.flags}${indent.repeat(2)}`.length;

  const parsedOptionsMessage = optionsWithJoinedFlags
    .map(({ flags, description }) => {
      const numOfSpacesToAdd = descriptionsPosX - flags.length;

      return `${indent}${flags}${" ".repeat(numOfSpacesToAdd)}${description}`;
    })
    .join("\n");

  console.log(parsedOptionsMessage, "\n");
};

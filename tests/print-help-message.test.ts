import { printHelpMessage } from "../src/index/printHelpMessage";

const mocks = {
  log: jest.spyOn(console, "log").mockImplementation(() => null),
};

afterAll(() => {
  jest.resetAllMocks();
});

describe("print help message", () => {
  it("format the given options", () => {
    const firstOption = {
      flags: ["-v", "--version"],
      description: "print the version",
    };
    const secondOption = {
      flags: ["--help"],
      description: "print the help message",
    };

    printHelpMessage([firstOption, secondOption]);

    expect(mocks.log).toHaveBeenNthCalledWith(
      2,
      `  ${firstOption.flags.join(", ")}    ${
        firstOption.description
      }\n  ${secondOption.flags.join(", ")}           ${
        secondOption.description
      }`,
      "\n"
    );
  });
});

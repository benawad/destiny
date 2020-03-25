import chalk from "chalk";
import logger from "../src/shared/logger";

const mocks = {
  error: jest.spyOn(console, "error").mockImplementationOnce(() => {}),
  log: jest.spyOn(console, "log").mockImplementationOnce(() => {}),
  info: jest.spyOn(console, "info").mockImplementationOnce(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementationOnce(() => {}),
  group: jest.spyOn(console, "group").mockImplementationOnce(() => {}),
  groupEnd: jest.spyOn(console, "groupEnd").mockImplementationOnce(() => {}),
  exit: jest
    .spyOn(process, "exit")
    // @ts-ignore - eslint won't allow assertion of `code as never`
    .mockImplementationOnce(code => code),
};

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe('NODE_ENV === "test"', () => {
  describe.each(Object.keys(logger))("logger.%s", name => {
    test(`stops execution of logger.${name} if in a test environment`, () => {
      logger[name]("a test message");
      for (const mock of Object.values(mocks)) {
        expect(mock).not.toBeCalled();
      }
    });
  });
});

describe('NODE_ENV === "production"', () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  const message = "a test message!";
  const table = [
    ["info", chalk.green.bold("INFO: ") + message],
    ["warn", chalk.yellow.bold("WARN: ") + message],
    ["log", message],
  ];

  describe.each(table)("logger.%s", (name, msg) => {
    test(`calls "console.${name}()" with "${msg}"`, () => {
      logger[name](message);
      const mock = mocks[name];
      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(msg);
    });
  });

  describe("logger.error", () => {
    it('calls "console.error()" when passed an error instances', () => {
      const error = new Error("test error");
      logger.error(error);

      expect(mocks.error).toBeCalledTimes(1);
      expect(mocks.error).toBeCalledWith(error);
      expect(mocks.log).toBeCalledTimes(1);
      expect(mocks.exit).toBeCalledTimes(1);
    });

    it('calls "console.error()" with chalk when passed a string', () => {
      const msg = "A test message";
      const result = chalk.red.bold("ERROR: ") + msg;
      logger.error(msg);
      expect(mocks.error).toBeCalledTimes(1);
      expect(mocks.error).toBeCalledWith(result);
      expect(mocks.exit).toBeCalledTimes(1);
    });

    it('exits process with error code "1"', () => {
      const exitCode = 1;
      logger.error("", exitCode);
      expect(mocks.error).toBeCalledTimes(1);
      expect(mocks.exit).toBeCalledTimes(1);
      expect(mocks.exit).toBeCalledWith(exitCode);
    });
  });
});

describe("logger.debug", () => {
  it('calls "console.info" with the time and the given message', () => {
    const msg = "test debug message";
    logger.debug(msg);

    expect(mocks.info).toBeCalledTimes(1);
    expect(mocks.info).toBeCalledWith(
      chalk.magenta.bold("DEBUG: ") + chalk.yellow.bold("+0ms ") + msg
    );
  });

  it("logs the given data in a group", () => {
    const data = [
      {
        name: "test data n1",
      },
      {
        name: "test data n2",
      },
    ];

    logger.debug("", ...data);

    expect(mocks.group).toBeCalledTimes(1);
    expect(mocks.log).toBeCalledTimes(data.length);
    data.forEach(d => {
      expect(mocks.log).toBeCalledWith(d, "\n");
    });
    expect(mocks.groupEnd).toBeCalledTimes(1);
  });
});

import chalk from "chalk";
import logger from "../src/shared/logger";

const mocks = {
  error: jest.spyOn(console, "error").mockImplementationOnce(() => {}),
  log: jest.spyOn(console, "log").mockImplementationOnce(() => {}),
  info: jest.spyOn(console, "info").mockImplementationOnce(() => {}),
  warn: jest.spyOn(console, "warn").mockImplementationOnce(() => {}),
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
      expect(mocks.error).toBeCalledTimes(0);
      expect(mocks.info).toBeCalledTimes(0);
      expect(mocks.log).toBeCalledTimes(0);
      expect(mocks.warn).toBeCalledTimes(0);
      expect(mocks.exit).toBeCalledTimes(0);
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

  describe(`logger.error`, () => {
    it('calls "console.error()" when passed an error instances', () => {
      const error = new Error();
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
      logger.error("", 1);
      expect(mocks.error).toBeCalledTimes(1);
      expect(mocks.exit).toBeCalledTimes(1);
      expect(mocks.exit).toBeCalledWith(1);
    });
  });
});

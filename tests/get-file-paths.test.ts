import path from "path";
import { getFilePaths, globSearch } from "../src/index/getFilePaths";
import logger from "../src/shared/logger";

const mocks = {
  error: jest.spyOn(logger, "error").mockImplementation(() => {}),
};

afterEach(() => jest.resetAllMocks());

describe(globSearch, () => {
  it("logs an error if a pattern only has directories", () => {
    globSearch(__dirname);
    expect(mocks.error).toBeCalled();
  });
});

describe(getFilePaths, () => {
  it("is empty so do nothing", () => {
    const fromUndefined = getFilePaths(undefined);
    const fromEmptyString = getFilePaths("");

    expect(fromUndefined).toEqual([]);
    expect(fromEmptyString).toEqual([]);
  });

  it("continues in the loop if file path does not exist", () => {
    const input = path.resolve(__dirname, "__fake-test-file.js");
    const res = getFilePaths(input);
    expect(res).toEqual([]);
    expect(mocks.error).toBeCalled();
  });

  it("pushes a file path and continues when its a file", () => {
    const input = path.resolve(__dirname, __filename);
    const res = getFilePaths(input);
    expect(res).toEqual([input]);
    expect(mocks.error).not.toBeCalled();
  });
});

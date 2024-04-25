import { NelaAGIError } from "../src";

describe("NelaAGIError", () => {
  // The status_code and detail properties of an instance of NelaAGIError should be set to the values passed in the constructor.
  it("should set the status_code and detail properties correctly", () => {
    const status_code = 200;
    const detail = "Test error message";

    const error = new NelaAGIError(status_code, detail);

    expect(error.status_code).toBe(status_code);
    expect(error.detail).toBe(detail);
  });

  // The message property of an instance of NelaAGIError should be set to the detail parameter passed in the constructor.
  it("should set the message property to the detail parameter", () => {
    const status_code = 200;
    const detail = "Test error message";

    const error = new NelaAGIError(status_code, detail);

    expect(error.message).toBe(detail);
  });

  // An instance of NelaAGIError should be an instance of the Error class.
  it("should be an instance of the Error class", () => {
    const status_code = 200;
    const detail = "Test error message";

    const error = new NelaAGIError(status_code, detail);

    expect(error).toBeInstanceOf(Error);
  });
});

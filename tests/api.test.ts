import { NelaAGI } from "../src";
import { API } from "../src/api";

describe("API", () => {
  // API instance can be created with valid accountId and authKey
  it("should create API instance with valid accountId and authKey", () => {
    const accountId = "123456789012";
    const authKey = "My API Key";
    const client = new NelaAGI(accountId, authKey);
    const api = new API(client);
    expect(api).toBeInstanceOf(API);
    expect(api.getClient()).toBe(client);
  });
});

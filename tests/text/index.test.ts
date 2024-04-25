import { NelaAGI } from "../../src";
import { Text } from "../../src/text";
import { ChatCompletion } from "../../src/text/chat-completion";

describe("Text", () => {
  // Text class can be instantiated with an instance of NelaAGI class.
  it("should instantiate Text class with an instance of NelaAGI class", () => {
    const client = new NelaAGI("123456789012", "validAuthKey");
    const text = new Text(client);

    expect(text).toBeInstanceOf(Text);
    expect(text.getClient()).toBe(client);
    expect(text).toHaveProperty("chatCompletion");
    expect(text.chatCompletion).toBeInstanceOf(ChatCompletion);
    expect(text.chatCompletion.getClient()).toBe(client);
  });
});

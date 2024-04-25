import { API } from "../api";
import { ChatCompletion } from "./chat-completion";

/**
 * The `Text` class provides access to various text based AI tasks, including chat completion.
 *
 * @param _client - An instance of the `NelaAGI` class.
 *
 * @property {ChatCompletion} chatCompletion - provides methods for generation of text completions within a conversational chat context.
 */
export class Text extends API {
  /**
   * The `chatCompletion` property provides methods for generation of text completions within a conversational chat context.
   *
   * @function fetch - Fetch chat completion from the Nela AGI API.
   */
  chatCompletion: ChatCompletion = new ChatCompletion(this._client);
}

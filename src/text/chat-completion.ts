import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";

/**
 * Represents a class for fetching chat completion from the Nela AGI API.
 */
export class ChatCompletion extends API {
  private allowedMaxNewTokens = [128, 256, 512, 1024];
  private allowedRoles: string[] = ["system", "user", "ai"];

  /**
   * Fetch chat completion from the Nela AGI API based on the provided conversations and parameters.
   *
   * @param conversations - The conversations parameter expects a list of conversation objects, each containing a role ("system," "user," or "ai") and content. It is mandatory for the conversations list not to be empty. The structure of the conversation is essential, with a system message at index 0, followed by alternating user and AI conversations. The system role must be in the conversation's first position, the user role in odd positions (1, 3, 5, ...), and the AI role in even positions (2, 4, 6, ...). The user role must be in the last position, and the content of each conversation index must be at least 2 characters long.
   * @param maxNewTokens - The max_new_tokens parameter, with a default of 512, specifies the maximum number of tokens the chat completion AI API should generate. The allowed values are 128, 256, 512, or 1024 providing flexibility based on the desired length of the generated text.
   * @param doSample - The do_sample parameter, with a default value of True, determines whether the model should use sampling during text generation. Setting it to True enables the model to introduce randomness in its responses.
   * @param temperature - The temperature parameter, ranging from 0.05 to 1.0 with a default of 0.5, controls the randomness of the generated text. Lower values (e.g., 0.05) make the output more deterministic, while higher values (e.g., 1.0) introduce more randomness.
   * @param topP - The top_p parameter, with a default value of 0.8, influences the nucleus sampling mechanism by specifying the cumulative probability for the top-p tokens to be considered during text generation. It ranges from 0 to 1.0.
   * @param topK - The top_k parameter, set to 50 by default, determines the number of top-k tokens to consider during text generation. It ranges from 0 to 100, allowing control over the diversity of the generated responses.
   * @param repetitionPenalty - The repetition_penalty parameter, with a default value of 1.0, discourages the repetition of identical or similar phrases in the generated text. It ranges from 1.0 to 2.0, providing a means to control the redundancy of the AI-generated content.
   * @returns {Promise<AxiosResponse>} A promise that resolves to the chat completion response from the API in the following format: 
   * @example
   * ```json
   * {
      "data": {
        "output": [
          {
              "type": "text",
              "data": "string"
          }
        ],
        "input_token_length": int,
        "output_token_length": int,
        "model_time_taken": float,
        "throughput": float,
        "latency": float
      },
      "status": number,
      "statusText": string,
      "headers": RawAxiosResponseHeaders | AxiosResponseHeaders,
      "config": InternalAxiosRequestConfig<D>,
      "request"?: any
    }
   * ```
   * @throws {NelaAGIError} If there are any validation errors with the input parameters.
   */
  async fetch(
    conversations: { role: string; content: string }[],
    maxNewTokens: number = 512,
    doSample: boolean = true,
    temperature: number = 0.5,
    topP: number = 0.8,
    topK: number = 50,
    repetitionPenalty: number = 1
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      if (
        !Array.isArray(conversations) ||
        conversations.some(
          (obj) =>
            typeof obj !== "object" ||
            !obj.hasOwnProperty("role") ||
            !obj.hasOwnProperty("content")
        )
      ) {
        return reject(
          new NelaAGIError(
            422,
            "conversations must be an array of objects with role and content properties"
          )
        );
      }

      const convErrors: string[] = [];

      if (conversations.length === 0) {
        convErrors.push("conversations list cannot be empty.");
      }

      const convLength: number = conversations.length - 1;

      conversations.forEach((conversation, index) => {
        const { role, content } = conversation;

        if (!this.allowedRoles.includes(role)) {
          convErrors.push(
            `Invalid Role Name: '${role}' in conversation index '${index}'.`
          );
        }

        if (index === 0 && role !== "system") {
          convErrors.push(
            `Invalid Role Position: System role needed to be in conversation index '${index}'.`
          );
        }

        if (index % 2 !== 0 && role !== "user") {
          convErrors.push(
            `Invalid Role Position: User role needed to be in odd position of conversation index '${index}'.`
          );
        }

        if (index % 2 === 0 && index !== 0 && role !== "ai") {
          convErrors.push(
            `Invalid Role Position: AI role needed to be in even position of conversation index '${index}'.`
          );
        }

        if (index === convLength && role !== "user") {
          convErrors.push(
            `Invalid Role Position: User role needed to be in end of conversation index '${index}'.`
          );
        }

        if (typeof content !== "string" || content.length < 2) {
          convErrors.push(
            `Invalid Content: Content of conversation index '${index}' must be at least 2 characters long.`
          );
        }
      });

      if (convErrors.length > 0) {
        return reject(new NelaAGIError(422, convErrors.join("\n")));
      }

      if (!this.allowedMaxNewTokens.includes(maxNewTokens)) {
        return reject(
          new NelaAGIError(
            422,
            "allowedMaxNewTokens values are 128, 256, 512, or 1024"
          )
        );
      }

      if (typeof doSample !== "boolean") {
        return reject(
          new NelaAGIError(422, "doSample must be a boolean value")
        );
      }

      if (
        typeof temperature !== "number" ||
        temperature < 0.05 ||
        temperature > 1
      ) {
        return reject(
          new NelaAGIError(
            422,
            "temperature must be a number between 0.05 and 1"
          )
        );
      }

      if (typeof topP !== "number" || topP < 0 || topP > 1) {
        return reject(
          new NelaAGIError(422, "topP must be a number between 0 and 1")
        );
      }

      if (typeof topK !== "number" || topK < 0 || topK > 100) {
        return reject(
          new NelaAGIError(422, "topK value must be between 0 and 100")
        );
      }

      if (
        typeof repetitionPenalty !== "number" ||
        repetitionPenalty < 1 ||
        repetitionPenalty > 2
      ) {
        return reject(
          new NelaAGIError(
            422,
            "repetitionPenalty value must be number between 1.0 and 2.0"
          )
        );
      }

      const url =
        "https://beta-apis.eliteappmakers.in/llm_gpt_neox_3b/v0_2/chat_completion";
      const method = "POST";
      const requestData = {
        conversations,
        max_new_tokens: maxNewTokens,
        do_sample: doSample,
        temperature,
        top_p: topP,
        top_k: topK,
        repetition_penalty: repetitionPenalty,
      };
      const isMultipartFormData = false;
      return resolve(
        this._client.fetch(url, method, requestData, isMultipartFormData)
      );
    });
  }
}

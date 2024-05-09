import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Audio } from "./audio";
import { NelaAGIError } from "./error";
import { Image } from "./image";
import { Text } from "./text";
import {
  convertUrlToBlob,
  getContentTypeFromArrayBuffer,
  getContentTypeFromExtension,
  readEnv,
  readLocalFileAsArrayBuffer,
  readLocalFileAsBlob,
} from "./utils";

/**
 * The NelaAGI class represents an instance of the NelaAGI API client.
 * The NelaAGI API client provides access to various AI tasks, including text-based, image-based, and audio-based tasks.
 *
 * @param accountId - The account ID for the NelaAGI client. If not provided, it will attempt to read the "NELA_ACCOUNTID" environment variable.
 * @param authKey - The authentication key for the NelaAGI client. If not provided, it will attempt to read the "NELA_AUTHKEY" environment variable.
 * @param maxRetries - The maximum number of retries for API requests. Defaults to 2.
 * @param timeout - The timeout for API requests in milliseconds. Defaults to 600000 (10 minutes).
 * 
 * @throws {NelaAGIError} - Throws an error if the accountId or authKey is missing or empty.
 * 
 * @property {Text} text - The `text` provides access to various text based AI tasks, including chat completion.
 * @property {Image} image - The `image` provides access to various image based AI tasks, including image generation, image-to-image translation, and image inpainting.
 * @property {Audio} audio - The `audio` provides access to various audio based AI tasks, including text to speech, speech to text, speech enhancement and music separation.
 *
 * @example
 * ```typescript
 * const nelaAGI = new NelaAGI("account_id", "auth_key");
 *
 * // Access text-based AI tasks
 * nelaAGI.text.chatCompletion
      .fetch([
        {
          role: "system",
          content: "default",
        },
        {
          role: "user",
          content: "hi",
        },
        {
          role: "ai",
          content: "hello, how can i help you?",
        },
        {
          role: "user",
          content: "who is Elon Musk?",
        },
      ])
      .then((result) => {
        console.log("then");
        console.log(result);
      })
      .catch((error) => {
        console.log("catch");
        console.log(error);
      });
 *
 * // Access image-based AI tasks
 * nelaAGI.image.imageGeneration
      .fetch("space monkey")
      .then((result) => {
        console.log("then");
        console.log(result);
      })
      .catch((error) => {
        console.log("catch");
        console.log(error);
      });
 *
 * // Access audio-based AI tasks
 * nelaAGI.audio.textToSpeech
      .fetch("hello")
      .then((result) => {
        console.log("then");
        console.log(result);
      })
      .catch((error) => {
        console.log("catch");
        console.log(error);
      });
 * ```
 */
class NelaAGI {
  private accountId: string;
  private authKey: string;
  private maxRetries: number;
  private timeout: number;
  private allowedHttpMethods: string[] = [
    "get",
    "GET",
    "post",
    "POST",
    "put",
    "PUT",
    "delete",
    "DELETE",
  ];

  constructor(
    accountId = readEnv("NELA_ACCOUNTID"),
    authKey = readEnv("NELA_AUTHKEY"),
    maxRetries = 2,
    timeout = 600000
  ) {
    if (accountId === undefined || accountId.length !== 12) {
      throw new NelaAGIError(
        400,
        "The NELA_ACCOUNTID environment variable is missing or empty or length of the accountId provided is not equal to 12 characters; either provide it, or instantiate the NelaAGI client with an accountId option, like new NelaAGI('123456789012', 'My API Key')."
      );
    }
    if (authKey === undefined || authKey.length < 8) {
      throw new NelaAGIError(
        400,
        "The NELA_AUTHKEY environment variable is missing or empty; either provide it, or instantiate the NelaAGI client with an authKey option, like new NelaAGI('123456789012', 'My API Key')."
      );
    }
    this.accountId = accountId;
    this.authKey = authKey;
    this.maxRetries = maxRetries;
    this.timeout = timeout;
  }

  /**
   * The `text` provides access to various text based AI tasks, including chat completion.
   *
   * @property {ChatCompletion} chatCompletion - provides methods for generation of text completions within a conversational chat context.
   *
   */
  text: Text = new Text(this);
  /**
   * The `Image` class provides access to various image based AI tasks, including image generation, image-to-image translation, and image inpainting.
   *
   * @property {ImageGeneration} imageGeneration - Provides methods for generating images.
   * @property {ImageToImage} imageToImage - Provides methods for transforming images to other image forms.
   * @property {ImageInpainting} imageInpainting - Provides methods for inpainting missing or corrupted parts of images.
   *
   */
  image: Image = new Image(this);
  /**
   * The `Audio` class provides access to various audio based AI tasks, including text to speech, speech to text, speech enhancement and music separation.
   *
   * @property {TextToSpeech} textToSpeech - Provides methods for converting text into spoken audio.
   * @property {SpeechToText} speechToText - Provides methods for transcribing speech into text.
   * @property {SpeechEnhancement} speechEnhancement - Provides methods for enhancing speech audio quality.
   * @property {MusicSeparation} musicSeparation - Provides methods for separating music sources from music songs.
   */
  audio: Audio = new Audio(this);

  /**
   * Fetch data from the API.
   * @param url - API endpoint URL.
   * @param method - HTTP method (GET, POST, PUT, DELETE).
   * @param requestData - Request data.
   * @param isMultipartFormData - Whether the request is multipart form data or not.
   * @returns {Promise<AxiosResponse>} - Promise resolved with the response on success, rejected with an error message on failure.
   */
  async fetch(
    url: string,
    method: string,
    requestData: object,
    isMultipartFormData: Boolean
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      if (typeof url !== "string" || url === "") {
        return reject(new NelaAGIError(400, "url should not be empty"));
      }

      if (!this.allowedHttpMethods.includes(method)) {
        return reject(
          new NelaAGIError(
            400,
            "Allowed HttpMethods are 'GET', 'POST', 'PUT', 'DELETE'"
          )
        );
      }

      const config: AxiosRequestConfig = {
        url,
        method,
        headers: {
          "Auth-Key": `api-key ${this.authKey}`,
          "Account-Id": this.accountId,
          "Content-Type": isMultipartFormData
            ? "multipart/form-data"
            : "application/json",
        },
      };

      if (method.toLowerCase() === "get") {
        config.params = requestData;
      } else if (
        method.toLowerCase() === "post" ||
        method.toLowerCase() === "put" ||
        method.toLowerCase() === "delete"
      ) {
        config.data = requestData;
      }

      try {
        const response: AxiosResponse = await axios(config);
        return resolve(response);
      } catch (error: AxiosError | any) {
        const errorResponse: AxiosResponse = error.response;
        if (errorResponse) {
          if (errorResponse.data.detail) {
            return reject(
              new NelaAGIError(errorResponse.status, errorResponse.data.detail)
            );
          } else if (errorResponse.status === 500) {
            return reject(
              new NelaAGIError(
                500,
                "This may be a bug on our side. Please contact us at contact@eliteappmakers.com"
              )
            );
          } else if (
            errorResponse.status === 502 ||
            errorResponse.status === 503
          ) {
            return reject(
              new NelaAGIError(
                errorResponse.status,
                `Unable to connect to the server at this moment due to ${errorResponse.statusText}`
              )
            );
          }
        }
        return reject(
          new NelaAGIError(
            501,
            `Unable to connect to the server at this moment due to ${
              error.code ? error.code : "501 Not Implemented"
            }, reason: ${error.message}`
          )
        );
      }
    });
  }
}

export {
  NelaAGI,
  NelaAGIError,
  convertUrlToBlob,
  getContentTypeFromArrayBuffer,
  getContentTypeFromExtension,
  readEnv,
  readLocalFileAsArrayBuffer,
  readLocalFileAsBlob,
};

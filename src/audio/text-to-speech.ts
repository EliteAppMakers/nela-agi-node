import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";

/**
 * Represents a class for fetching Text To Speech from the Nela AGI API.
 */
export class TextToSpeech extends API {
  /**
   * Fetches Text To Speech from the Nela AGI API based on the provided text and parameters.
   *
   * @param text - The text to convert into speech. It should be a string with a character length between 2 and 5000 characters.
   * @param speakerId - (Optional) The ID of the speaker for the generated speech. Should be an integer between 1 and 110, representing different speaker profiles.
   * @param speakerGender - (Optional) The gender of the speaker for the generated speech. Should be either "MALE" or "FEMALE".
   * 
   * @returns {Promise<AxiosResponse>} - A Promise resolving to the generated audio from the API in the following format: 
   * @example
   * ```json
   * {
      "data": {
        "output": [
          {
            "type": "audio_base64",
            "data": "string"
          }
        ],
        "model_time_taken": float
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
    text: String,
    speakerId?: Number,
    speakerGender?: String
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      if (typeof text !== "string" || text.length < 2 || text.length > 5000) {
        return reject(
          new NelaAGIError(
            422,
            "text length should be between 2 and 5000 characters"
          )
        );
      }

      if (
        typeof speakerId !== "undefined" &&
        (typeof speakerId !== "number" || speakerId < 1 || speakerId > 110)
      ) {
        return reject(
          new NelaAGIError(422, "speakerId should be between 1 and 110")
        );
      }

      if (
        typeof speakerGender !== "undefined" &&
        speakerGender !== "MALE" &&
        speakerGender !== "FEMALE"
      ) {
        return reject(
          new NelaAGIError(422, `speakerGender should be "MALE" or "FEMALE"`)
        );
      }

      const url =
        "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/text_to_speech_ms";
      const method = "POST";
      const requestData = {
        text,
        speaker_id: speakerId,
        speaker_gender: speakerGender,
      };
      const isMultipartFormData = false;
      return resolve(
        this._client.fetch(url, method, requestData, isMultipartFormData)
      );
    });
  }
}

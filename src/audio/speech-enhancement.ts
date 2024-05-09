import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";
import { convertUrlToBlob, getContentTypeFromArrayBuffer } from "../utils";

/**
 * Represents a class for fetching Speech Enhancement from the Nela AGI API.
 */
export class SpeechEnhancement extends API {
  private allowedAudioFormats: string[] = [
    "audio/mp3",
    "audio/wav",
    "audio/mpeg",
    "audio/wave",
  ];

  /**
   * Fetches speech enhancement from the Nela AGI API based on the provided speech audio.
   *
   * @param audio - The audio file to be enhanced. It should be provided as a File object. The supported audio formats are MP3, MPEG, and WAV.
   *
   * @returns {Promise<AxiosResponse>} - A Promise that resolves with the result of the speech enhancement operation in the following format: 
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
    audio: string | File | Blob | ArrayBuffer
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      if (typeof window !== "undefined") {
        if (
          !(typeof audio === "string") &&
          !(audio instanceof File) &&
          !(audio instanceof Blob) &&
          !(audio instanceof ArrayBuffer)
        ) {
          return reject(
            new NelaAGIError(
              422,
              "audio should be url string or an instance of File or Blob or ArrayBuffer"
            )
          );
        }
      } else {
        if (
          !(typeof audio === "string") &&
          !(audio instanceof Blob) &&
          !(audio instanceof ArrayBuffer)
        ) {
          return reject(
            new NelaAGIError(
              422,
              "audio should be url string or an instance of Blob or ArrayBuffer since File is undefined in node.js environment"
            )
          );
        }
      }

      if (typeof audio === "string") {
        try {
          audio = await convertUrlToBlob(audio);
        } catch (error) {
          return reject(
            new NelaAGIError(
              422,
              `audio should be a valid url string failed due to ${error}`
            )
          );
        }
      }

      if (audio instanceof ArrayBuffer) {
        let audioContentType = getContentTypeFromArrayBuffer(audio);
        audio = new Blob([audio], { type: audioContentType });
      }

      if (!this.allowedAudioFormats.includes(audio.type)) {
        return reject(
          new NelaAGIError(422, "audio format should be MP3, MPEG or WAV")
        );
      }

      const url =
        "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/speech_enhancement";
      const method = "POST";
      const requestFormData = new FormData();
      requestFormData.append("audio", audio);
      const isMultipartFormData = true;
      return resolve(
        this._client.fetch(url, method, requestFormData, isMultipartFormData)
      );
    });
  }
}

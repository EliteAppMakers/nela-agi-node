import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";
import { getContentTypeFromBuffer } from "../utils";

/**
 * Represents a class for fetching Music Separation from the Nela AGI API.
 */
export class MusicSeparation extends API {
  private allowedAudioFormats: string[] = [
    "audio/mp3",
    "audio/wav",
    "audio/mpeg",
    "audio/wave",
  ];
  private allowedSplitModes: string[] = ["ALL", "KARAOKE"];

  /**
   * Fetches Music Separation from the Nela AGI API based on the provided music audio and parameters.
   *
   * @param audio - The audio parameter specifies the audio file that you want to segment or dissect into all music sections or only karaoke. It should be in MP3, MPEG, or WAV audio formats.
   * @param split - The split parameter determines the type of separation to be performed on the provided audio file. It accepts a string value that specifies the separation mode. Currently, the API supports two split modes:
   *   - "ALL": Separates the entire audio file into distinct sections based on various musical attributes, such as "vocals", "drums", "bass", "piano", "guitar", and "other".
   *   - "KARAOKE": Focuses on isolating vocals from the background music or instrumental tracks within the audio file, facilitating tasks like karaoke creation, vocal enhancement, or remixing where separate control over vocals and instrumental parts is desired.
   * 
   * @returns {Promise<AxiosResponse>} A Promise that resolves with the result of the music separation API call in the following format: 
   * @example
   * ```json
   * {
      "data": {
        "output": [
          {
            "type": "text",
            "data": "string"
          },
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
    audio: File | Blob | Buffer,
    split: string
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      try {
        if (
          !(audio instanceof File) &&
          !(audio instanceof Blob) &&
          !(audio instanceof Buffer)
        ) {
          return reject(
            new NelaAGIError(
              422,
              "audio should be instance of File or Blob or Buffer"
            )
          );
        }
      } catch (error) {
        if (!(audio instanceof Blob) && !(audio instanceof Buffer)) {
          return reject(
            new NelaAGIError(
              422,
              "audio should be instance of Blob or Buffer since File is undefined in node.js environment"
            )
          );
        }
      }

      if (Buffer.isBuffer(audio)) {
        let audioContentType = getContentTypeFromBuffer(audio);
        audio = new Blob([audio], { type: audioContentType });
      }

      if (!this.allowedAudioFormats.includes(audio.type)) {
        return reject(
          new NelaAGIError(422, "Audio format should be MP3, MPEG or WAV")
        );
      }

      if (!this.allowedSplitModes.includes(split.toUpperCase())) {
        return reject(
          new NelaAGIError(422, "Split format should be 'ALL' or 'KARAOKE'")
        );
      }

      const url =
        "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/music_separation";
      const method = "POST";
      const requestFormData = new FormData();
      requestFormData.append("audio", audio);
      requestFormData.append("split", split);
      const isMultipartFormData = true;
      return resolve(
        this._client.fetch(url, method, requestFormData, isMultipartFormData)
      );
    });
  }
}

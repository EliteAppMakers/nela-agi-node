import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";

/**
 * Represents a class for generating images using the NelaAGI API.
 */
export class ImageGeneration extends API {
  /**
   * Fetch Image Generation from the Nela AGI API based on the provided prompts and parameters.
   *
   * @param prompt - The prompt parameter is a required component of the request data format representing the instruction provided to the AI model for transforming the desired image. It typically consists of a textual description or a prompt that guides the AI in creating the image. Prompt length should be between 3 and 275 characters.
   * @param negativePrompt - An optional parameter providing additional context to the AI model by specifying a negative prompt or constraint. It helps in refining the generated image by guiding the model away from undesired outcomes or themes. Negative Prompt length should be between 3 and 275 characters.
   * @param width - The desired width of the generated image in pixels, controlling its horizontal dimension. Width should be between 512 and 1024 px. Default value is 1024.
   * @param height - The desired height of the generated image in pixels, controlling its vertical dimension. Height should be between 512 and 1024 px. Default value is 1024.
   * @param cropsCoordsTopLeftX - The x-coordinate of the top-left corner of the crop area within the generated image. It assists in specifying a region of interest or focusing the AI's attention on a particular section of the image. cropsCoordsTopLeftX value must be between 0 and 1024 px. Default value is 0.
   * @param cropsCoordsTopLeftY - The y-coordinate of the top-left corner of the crop area within the generated image. Similar to the x-coordinate parameter, this helps in defining a specific area of interest within the image. cropsCoordsTopLeftY value must be between 0 and 1024 px. Default value is 0.
   * @param seed - The seed used for initializing the random number generator, ensuring reproducibility of results. Seed should be between 0 and 9999999999 value. Default value is 0.
   * @param numInferenceSteps - The number of inference steps or iterations the AI model should perform during the image generation process. Increasing this parameter can enhance the complexity and detail of the generated image but may also prolong the processing time. numInferenceSteps should be between 1 and 75 value. Default value is 25.
   * @param guidanceScale - A scaling factor applied to the guidance provided by the prompt and negative prompt, influencing the relative importance or impact of these prompts on the image generation process. guidanceScale should be between 0 and 15 value. Default value is 5.0.
   * @param imageFormat - The desired format of the generated image, such as JPEG or PNG. This parameter ensures compatibility with various image viewing and processing applications. imageFormat should be in "PNG" and "JPEG" image formats. Default value is "JPEG".
   * 
   * @returns {Promise<AxiosResponse>} - A promise that resolves to the generated image in the following format: 
   * @example
   * ```json
   * {
      "data": {
        "output": [
            {
                "type": "image_base64",
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
    prompt: string,
    negativePrompt?: string,
    width: number = 1024,
    height: number = 1024,
    cropsCoordsTopLeftX: number = 0,
    cropsCoordsTopLeftY: number = 0,
    seed: number = 0,
    numInferenceSteps: number = 25,
    guidanceScale: number = 5.0,
    imageFormat: string = "JPEG"
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      if (
        typeof prompt !== "string" ||
        prompt.length < 3 ||
        prompt.length > 275
      ) {
        return reject(
          new NelaAGIError(
            422,
            "Prompt length should be between 3 and 275 characters"
          )
        );
      }

      if (
        typeof negativePrompt !== "undefined" &&
        (typeof negativePrompt !== "string" ||
          negativePrompt.length < 3 ||
          negativePrompt.length > 275)
      ) {
        return reject(
          new NelaAGIError(
            422,
            "Negative Prompt length should be between 3 and 275 characters"
          )
        );
      }

      if (typeof width !== "number" || width < 512 || width > 1024) {
        return reject(
          new NelaAGIError(422, "Width should be between 512 and 1024 pixels")
        );
      }

      if (typeof height !== "number" || height < 512 || height > 1024) {
        return reject(
          new NelaAGIError(422, "Height should be between 512 and 1024 pixels")
        );
      }

      if (
        typeof cropsCoordsTopLeftX !== "number" ||
        cropsCoordsTopLeftX < 0 ||
        cropsCoordsTopLeftX > 1024
      ) {
        return reject(
          new NelaAGIError(
            422,
            "cropsCoordsTopLeftX value must be between 0 and 1024 pixels"
          )
        );
      }

      if (
        typeof cropsCoordsTopLeftY !== "number" ||
        cropsCoordsTopLeftY < 0 ||
        cropsCoordsTopLeftY > 1024
      ) {
        return reject(
          new NelaAGIError(
            422,
            "cropsCoordsTopLeftY value must be between 0 and 1024 pixels"
          )
        );
      }

      if (typeof seed !== "number" || seed < 0 || seed > 9999999999) {
        return reject(
          new NelaAGIError(422, "Seed should be between 0 and 9999999999 value")
        );
      }

      if (
        typeof numInferenceSteps !== "number" ||
        numInferenceSteps < 1 ||
        numInferenceSteps > 75
      ) {
        return reject(
          new NelaAGIError(
            422,
            "numInferenceSteps should be between 1 and 75 value"
          )
        );
      }

      if (
        typeof guidanceScale !== "number" ||
        guidanceScale < 0 ||
        guidanceScale > 15
      ) {
        return reject(
          new NelaAGIError(
            422,
            "guidanceScale should be between 0 and 15 value"
          )
        );
      }

      if (imageFormat !== "PNG" && imageFormat !== "JPEG") {
        return reject(
          new NelaAGIError(
            422,
            "imageFormat should be in 'PNG' and 'JPEG' image formats"
          )
        );
      }

      const url =
        "https://beta-apis.eliteappmakers.in/im_sdxl_base_v1/v0_2/image_generation";
      const method = "POST";
      const requestData = {
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        crops_coords_top_left_x: cropsCoordsTopLeftX,
        crops_coords_top_left_y: cropsCoordsTopLeftY,
        seed,
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        image_format: imageFormat,
      };
      const isMultipartFormData = false;
      return resolve(
        this._client.fetch(url, method, requestData, isMultipartFormData)
      );
    });
  }
}

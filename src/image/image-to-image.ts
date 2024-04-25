import { AxiosResponse } from "axios";
import { API } from "../api";
import { NelaAGIError } from "../error";
import { getContentTypeFromBuffer } from "../utils";

/**
 * Represents a class for performing image to image using the NelaAGI API.
 */
export class ImageToImage extends API {
  private allowedImageFormats: string[] = [
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  /**
   * Fetch Image To Image from the Nela AGI API based on the provided image, prompts and parameters.
   *
   * @param image - The image parameter is a required component of the request data format for the Image To Image API. It specifies the image file provided as a reference or starting point for generating the desired output image according to the provided prompts and parameters. image_content_type should be in PNG and JPEG image formats.
   * @param prompt - The prompt parameter is a required component of the request data format representing the instruction provided to the AI model for transforming the desired image. It typically consists of a textual description or a prompt that guides the AI in transforming the image. Prompt length should be between 3 and 275 characters.
   * @param negativePrompt - The negative_prompt parameter (optional) provides additional context to the AI model by specifying a negative prompt or constraint. It helps in refining the generated image by guiding the model away from undesired outcomes or themes. Negative Prompt length should be between 3 and 275 characters.
   * @param cropsCoordsTopLeftX - The crops_coords_top_left_x parameter, set to 0 by default, indicates the x-coordinate of the top-left corner of the crop area within the generated image. It assists in specifying a region of interest or focusing the AI's attention on a particular section of the image. crops_coords_top_left_x value must be between 0 and 1024 px.
   * @param cropsCoordsTopLeftY - The crops_coords_top_left_y parameter, set to 0 by default, represents the y-coordinate of the top-left corner of the crop area within the generated image. Similar to the x-coordinate parameter, this helps in defining a specific area of interest within the image. crops_coords_top_left_y value must be between 0 and 1024 px.
   * @param seed - The seed, set to 0 by default, is used for initializing the random number generator. It allows for reproducibility of results, ensuring that the same input prompts produce consistent output images across different executions. Seed should be between 0 and 9999999999 value.
   * @param numInferenceSteps - The num_inference_steps parameter, set to 25 by default, specifies the number of inference steps or iterations the AI model should perform during the image transformation process. Increasing this parameter can enhance the complexity and detail of the generated image but may also prolong the processing time. num_inference_steps should be between 1 and 75 value.
   * @param strength - The Strength parameter influences the intensity or magnitude of the transformation applied to the input image by the AI model. It controls the degree to which the prompts and other guiding factors influence the generated image. By increasing or decreasing the Strength parameter, users can effectively control the extent of changes applied to the image during the transformation process.
   * @param guidanceScale - The guidance_scale parameter, set to 5.0 by default, represents a scaling factor applied to the guidance provided by the prompt and negative prompt. It influences the relative importance or impact of these prompts on the image transformation process, allowing fine-tuning of the AI's response. guidance_scale should be between 0 and 15 value.
   * @param imageFormat - The image_format parameter, set to JPEG by default, specifies the desired format of the generated image, such as JPEG, PNG, or other supported formats. This parameter ensures compatibility with various image viewing and processing applications by selecting the appropriate file format for the output. image_format should be in "PNG" and "JPEG" image formats.
   * 
   * @returns {Promise<AxiosResponse>} - A Promise that resolves with the result of the image to image process in the following format: 
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
    image: File | Blob | Buffer,
    prompt: string,
    negativePrompt?: string,
    cropsCoordsTopLeftX: number = 0,
    cropsCoordsTopLeftY: number = 0,
    seed: number = 0,
    numInferenceSteps: number = 25,
    strength: number = 0.5,
    guidanceScale: number = 5.0,
    imageFormat: string = "JPEG"
  ): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>(async (resolve, reject) => {
      try {
        if (
          !(image instanceof File) &&
          !(image instanceof Blob) &&
          !(image instanceof Buffer)
        ) {
          return reject(
            new NelaAGIError(
              422,
              "Image should be instance of File or Blob or Buffer"
            )
          );
        }
      } catch (error) {
        if (!(image instanceof Blob) && !(image instanceof Buffer)) {
          return reject(
            new NelaAGIError(
              422,
              "Image should be instance of Blob or Buffer since File is undefined in node.js environment"
            )
          );
        }
      }

      if (Buffer.isBuffer(image)) {
        let imageContentType = getContentTypeFromBuffer(image);
        image = new Blob([image], { type: imageContentType });
      }

      if (!this.allowedImageFormats.includes(image.type)) {
        return reject(
          new NelaAGIError(422, "Image format should be PNG or JPEG")
        );
      }

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

      if (typeof strength !== "number" || strength < 0 || strength > 1) {
        return reject(
          new NelaAGIError(422, "Strength should be between 0.0 and 1.0")
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
        "https://beta-apis.eliteappmakers.in/im_sdxl_base_v1/v0_2/image_to_image";
      const method = "POST";
      const requestFormData = new FormData();
      requestFormData.append("image", image);
      requestFormData.append("prompt", prompt);
      if (negativePrompt)
        requestFormData.append("negative_prompt", negativePrompt);
      requestFormData.append(
        "crops_coords_top_left_x",
        String(cropsCoordsTopLeftX)
      );
      requestFormData.append(
        "crops_coords_top_left_y",
        String(cropsCoordsTopLeftY)
      );
      requestFormData.append("seed", String(seed));
      requestFormData.append("num_inference_steps", String(numInferenceSteps));
      requestFormData.append("strength", String(strength));
      requestFormData.append("guidance_scale", String(guidanceScale));
      requestFormData.append("image_format", imageFormat);
      const isMultipartFormData = true;
      return resolve(
        this._client.fetch(url, method, requestFormData, isMultipartFormData)
      );
    });
  }
}

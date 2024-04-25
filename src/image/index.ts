import { API } from "../api";
import { ImageGeneration } from "./image-generation";
import { ImageInpainting } from "./image-inpainting";
import { ImageToImage } from "./image-to-image";

/**
 * The `Image` class provides access to various image based AI tasks, including image generation, image-to-image translation, and image inpainting.
 *
 * @param client - An instance of the `NelaAGI` class.
 *
 * @property {ImageGeneration} imageGeneration - Provides methods for generating images.
 * @property {ImageToImage} imageToimage - Provides methods for transforming images to other image forms.
 * @property {ImageInpainting} imageInpainting - Provides methods for inpainting missing or corrupted parts of images.
 *
 */
export class Image extends API {
  /**
   * The `imageGeneration` property provides methods for generating images.
   *
   * @function fetch - Fetch image generation from the Nela AGI API.
   */
  imageGeneration = new ImageGeneration(this._client);
  /**
   * The `imageToImage` property provides methods for transforming images to other image forms.
   *
   * @function fetch - Fetch image to image from the Nela AGI API.
   */
  imageToImage = new ImageToImage(this._client);
  /**
   * The `imageInpainting` property provides methods for inpainting missing or corrupted parts of images.
   *
   * @function fetch - Fetch image inpainting from the Nela AGI API.
   */
  imageInpainting = new ImageInpainting(this._client);
}

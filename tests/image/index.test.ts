import { NelaAGI } from "../../src";
import { Image } from "../../src/image";
import { ImageGeneration } from "../../src/image/image-generation";
import { ImageInpainting } from "../../src/image/image-inpainting";
import { ImageToImage } from "../../src/image/image-to-image";

describe("Image", () => {
  // Text class can be instantiated with an instance of NelaAGI class.
  it("should instantiate Image class with an instance of NelaAGI class", () => {
    const client = new NelaAGI("123456789012", "validAuthKey");
    const image = new Image(client);

    expect(image).toBeInstanceOf(Image);
    expect(image.getClient()).toBe(client);
    expect(image).toHaveProperty("imageGeneration");
    expect(image).toHaveProperty("imageToImage");
    expect(image).toHaveProperty("imageInpainting");
    expect(image.imageGeneration).toBeInstanceOf(ImageGeneration);
    expect(image.imageToImage).toBeInstanceOf(ImageToImage);
    expect(image.imageInpainting).toBeInstanceOf(ImageInpainting);
    expect(image.imageGeneration.getClient()).toBe(client);
    expect(image.imageToImage.getClient()).toBe(client);
    expect(image.imageInpainting.getClient()).toBe(client);
  });
});

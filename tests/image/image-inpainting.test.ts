import fs from "fs";
import { NelaAGI, NelaAGIError, createBlobFromFilePath } from "../../src";
import { ImageInpainting } from "../../src/image/image-inpainting";
import { getContentTypeFromBuffer } from "../../src/utils";

describe("ImageInpainting", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let imageInpainting: ImageInpainting;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    imageInpainting = new ImageInpainting(client);
  });

  // Successfully fetch imageInpainting with only required image as Blob, maskImage as Blob, prompt and default parameters
  it("should successfully fetch imageInpainting with only required image as Blob, maskImage as Blob, prompt and default parameters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-inpainting.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.png"
    );
    const prompt = "a beautiful landscape image";
    const url =
      "https://beta-apis.eliteappmakers.in/im_sdxl_base_v1/v0_2/image_inpainting";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("image", image);
    requestFormData.append("mask_image", maskImage);
    requestFormData.append("prompt", prompt);
    requestFormData.append("width", "1024");
    requestFormData.append("height", "1024");
    requestFormData.append("crops_coords_top_left_x", "0");
    requestFormData.append("crops_coords_top_left_y", "0");
    requestFormData.append("seed", "0");
    requestFormData.append("num_inference_steps", "25");
    requestFormData.append("strength", "0.5");
    requestFormData.append("guidance_scale", "5");
    requestFormData.append("image_format", "JPEG");
    const responseData = {
      output: [
        {
          type: "image_base64",
          data: expect.any(String),
        },
      ],
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await imageInpainting.fetch(image, maskImage, prompt);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.data).toMatchObject(requestFormData);
    expect(axiosConfig.headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
  }, 120000);

  // Successfully fetch imageInpainting with only required image as Buffer, maskImage as Buffer, prompt and default parameters
  it("should successfully fetch imageInpainting with only required image as Buffer, maskImage as Buffer, prompt and default parameters", async () => {
    // Arrange
    const image = fs.readFileSync("./tests/assets/image-inpainting-mask.jpg");
    const maskImage = fs.readFileSync(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const imageContentType = getContentTypeFromBuffer(image);
    const maskImageContentType = getContentTypeFromBuffer(maskImage);
    const imageBlob = new Blob([image], {
      type: imageContentType,
    });
    const maskImageBlob = new Blob([image], {
      type: maskImageContentType,
    });
    const prompt = "a beautiful landscape image";
    const url =
      "https://beta-apis.eliteappmakers.in/im_sdxl_base_v1/v0_2/image_inpainting";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("image", imageBlob);
    requestFormData.append("mask_image", maskImageBlob);
    requestFormData.append("prompt", prompt);
    requestFormData.append("width", "1024");
    requestFormData.append("height", "1024");
    requestFormData.append("crops_coords_top_left_x", "0");
    requestFormData.append("crops_coords_top_left_y", "0");
    requestFormData.append("seed", "0");
    requestFormData.append("num_inference_steps", "25");
    requestFormData.append("strength", "0.5");
    requestFormData.append("guidance_scale", "5");
    requestFormData.append("image_format", "JPEG");
    const responseData = {
      output: [
        {
          type: "image_base64",
          data: expect.any(String),
        },
      ],
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await imageInpainting.fetch(image, maskImage, prompt);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.data).toMatchObject(requestFormData);
    expect(axiosConfig.headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
  }, 120000);

  // Successfully fetch imageInpainting with valid prompt and custom parameters
  it("should successfully fetch imageInpainting with valid prompt and custom parameters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-inpainting.jpg");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 512;
    const height = 512;
    const cropsCoordsTopLeftX = 100;
    const cropsCoordsTopLeftY = 100;
    const seed = 100;
    const numInferenceSteps = 10;
    const strength = 0.9;
    const guidanceScale = 1.0;
    const imageFormat = "PNG";
    const requestFormData = new FormData();
    requestFormData.append("image", image);
    requestFormData.append("mask_image", maskImage);
    requestFormData.append("prompt", prompt);
    requestFormData.append("negative_prompt", negativePrompt);
    requestFormData.append("width", String(width));
    requestFormData.append("height", String(height));
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
    const responseData = {
      output: [
        {
          type: "image_base64",
          data: expect.any(String),
        },
      ],
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await imageInpainting.fetch(
      image,
      maskImage,
      prompt,
      negativePrompt,
      width,
      height,
      cropsCoordsTopLeftX,
      cropsCoordsTopLeftY,
      seed,
      numInferenceSteps,
      strength,
      guidanceScale,
      imageFormat
    );

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.data).toMatchObject(requestFormData);
  }, 120000);

  // Reject with NelaAGIError if Image format is not PNG or JPEG
  it("should reject with NelaAGIError when Image format is not PNG or JPEG", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/speech-to-text.mp3");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "abc";
    const expectedErrorCode = 422;
    const expectedErrorMessage = "Image format should be PNG or JPEG";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if maskImage format is not PNG or JPEG
  it("should reject with NelaAGIError when maskImage format is not PNG or JPEG", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-inpainting.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/speech-to-text.mp3"
    );
    const prompt = "abc";
    const expectedErrorCode = 422;
    const expectedErrorMessage = "Mask image format should be PNG or JPEG";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if prompt length is less than 3 characters
  it("should reject with NelaAGIError when prompt length is less than 3 characters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-inpainting.jpg");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "ab";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if prompt length is greater than 275 characters
  it("should reject with NelaAGIError when prompt length is greater than 275 characters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt =
      "This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters.";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if negativePrompt length is less than 3 characters
  it("should reject with NelaAGIError when negativePrompt length is less than 3 characters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "ab";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Negative Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt,
        negativePrompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if negativePrompt length is greater than 275 characters
  it("should reject with NelaAGIError when negativePrompt length is greater than 275 characters", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt =
      "This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters.";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Negative Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt,
        negativePrompt
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  it("should reject with NelaAGIError when width parameter is not between 512 and 1024", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const widths = [511.99, 1024.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "Width should be between 512 and 1024 pixels";
    let catchExecuted = false;

    // Act & Assert
    widths.forEach(async (width) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if height parameter is not between 512 and 1024
  it("should reject with NelaAGIError when height parameter is not between 512 and 1024", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const heights = [511.99, 1024.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "Height should be between 512 and 1024 pixels";
    let catchExecuted = false;

    // Act & Assert
    heights.forEach(async (height) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if cropsCoordsTopLeftX parameter is not between 0 and 1024
  it("should reject with NelaAGIError when cropsCoordsTopLeftX parameter is not between 0 and 1024", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftXs = [-0.01, 1024.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "cropsCoordsTopLeftX value must be between 0 and 1024 pixels";
    let catchExecuted = false;

    // Act & Assert
    cropsCoordsTopLeftXs.map(async (cropsCoordsTopLeftX) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if cropsCoordsTopLeftY parameter is not between 0 and 1024
  it("should reject with NelaAGIError when cropsCoordsTopLeftY parameter is not between 0 and 1024", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftYs = [-0.01, 1024.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "cropsCoordsTopLeftY value must be between 0 and 1024 pixels";
    let catchExecuted = false;

    // Act & Assert
    cropsCoordsTopLeftYs.map(async (cropsCoordsTopLeftY) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if seed parameter is not between 0 and 9999999999
  it("should reject with NelaAGIError when seed parameter is not between 0 and 9999999999", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seeds = [-0.01, 9999999999.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Seed should be between 0 and 9999999999 value";
    let catchExecuted = false;

    // Act & Assert
    seeds.map(async (seed) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY,
          seed
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if numInferenceSteps parameter is not between 1 and 75
  it("should reject with NelaAGIError when numInferenceSteps parameter is not between 1 and 75", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceStepsList = [0.99, 75.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "numInferenceSteps should be between 1 and 75 value";
    let catchExecuted = false;

    // Act & Assert
    numInferenceStepsList.map(async (numInferenceSteps) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY,
          seed,
          numInferenceSteps
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if guidanceScale parameter is not between 0 and 15
  it("should reject with NelaAGIError when strength parameter is not between 0.0 and 1.0", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceSteps = 40;
    const strengths = [-0.01, 1.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "Strength should be between 0.0 and 1.0";
    let catchExecuted = false;

    // Act & Assert
    strengths.map(async (strength) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY,
          seed,
          numInferenceSteps,
          strength
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if guidanceScale parameter is not between 0 and 15
  it("should reject with NelaAGIError when guidanceScale parameter is not between 0 and 15", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceSteps = 40;
    const strength = 0.5;
    const guidanceScales = [-0.01, 15.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "guidanceScale should be between 0 and 15 value";
    let catchExecuted = false;

    // Act & Assert
    guidanceScales.map(async (guidanceScale) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageInpainting.fetch(
          image,
          maskImage,
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY,
          seed,
          numInferenceSteps,
          strength,
          guidanceScale
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if imageFormat parameter is not PNG or JPEG
  it("should reject with NelaAGIError when imageFormat parameter is not PNG or JPEG", async () => {
    // Arrange
    const image = createBlobFromFilePath("./tests/assets/image-to-image.png");
    const maskImage = createBlobFromFilePath(
      "./tests/assets/image-inpainting-mask.jpg"
    );
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceSteps = 40;
    const strength = 0.5;
    const guidanceScale = 10;
    const imageFormat = "MP3";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "imageFormat should be in 'PNG' and 'JPEG' image formats";
    let catchExecuted = false;

    // Act & Assert
    catchExecuted = false;
    try {
      const resultPromise = await imageInpainting.fetch(
        image,
        maskImage,
        prompt,
        negativePrompt,
        width,
        height,
        cropsCoordsTopLeftX,
        cropsCoordsTopLeftY,
        seed,
        numInferenceSteps,
        strength,
        guidanceScale,
        imageFormat
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });
});

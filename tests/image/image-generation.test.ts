import { NelaAGI, NelaAGIError } from "../../src";
import { ImageGeneration } from "../../src/image/image-generation";

describe("ImageGeneration", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let imageGeneration: ImageGeneration;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    imageGeneration = new ImageGeneration(client);
  });

  // Successfully fetch image generation with only required prompt and default parameters
  it("should successfully fetch image generation with only required prompt and default parameters", async () => {
    // Arrange
    const prompt = "a beautiful landscape image";
    const url =
      "https://beta-apis.eliteappmakers.in/im_sdxl_base_v1/v0_2/image_generation";
    const method = "post";
    const requestData = {
      prompt,
      negative_prompt: undefined,
      width: 1024,
      height: 1024,
      crops_coords_top_left_x: 0,
      crops_coords_top_left_y: 0,
      seed: 0,
      num_inference_steps: 25,
      guidance_scale: 5.0,
      image_format: "JPEG",
    };
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
    const result = await imageGeneration.fetch(prompt);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
    expect(axiosConfig.headers["Content-Type"]).toContain("application/json");
  }, 120000);

  // Successfully fetch image generation with valid prompt and custom parameters
  it("should successfully fetch image generation with valid prompt and custom parameters", async () => {
    // Arrange
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const cropsCoordsTopLeftX = 0;
    const cropsCoordsTopLeftY = 0;
    const width = 512;
    const height = 512;
    const seed = 100;
    const numInferenceSteps = 10;
    const guidanceScale = 1.0;
    const imageFormat = "PNG";
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
    const result = await imageGeneration.fetch(
      prompt,
      negativePrompt,
      width,
      height,
      cropsCoordsTopLeftX,
      cropsCoordsTopLeftY,
      seed,
      numInferenceSteps,
      guidanceScale,
      imageFormat
    );

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
  }, 120000);

  // Reject with NelaAGIError if prompt length is less than 3 characters
  it("should reject with NelaAGIError when prompt length is less than 3 characters", async () => {
    // Arrange
    const prompt = "ab";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageGeneration.fetch(prompt);
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
    const prompt =
      "This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters. This is a prompt with more than 275 characters.";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageGeneration.fetch(prompt);
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
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "ab";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Negative Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageGeneration.fetch(prompt, negativePrompt);
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
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt =
      "This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters. This is a negativePrompt with more than 275 characters.";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Negative Prompt length should be between 3 and 275 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await imageGeneration.fetch(prompt, negativePrompt);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if width parameter is not between 512 and 1024
  it("should reject with NelaAGIError when width parameter is not between 512 and 1024", async () => {
    // Arrange
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
        const resultPromise = await imageGeneration.fetch(
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
        const resultPromise = await imageGeneration.fetch(
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
        const resultPromise = await imageGeneration.fetch(
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
        const resultPromise = await imageGeneration.fetch(
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
        const resultPromise = await imageGeneration.fetch(
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
        const resultPromise = await imageGeneration.fetch(
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
  it("should reject with NelaAGIError when guidanceScale parameter is not between 0 and 15", async () => {
    // Arrange
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceSteps = 40;
    const guidanceScales = [-0.01, 15.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "guidanceScale should be between 0 and 15 value";
    let catchExecuted = false;

    // Act & Assert
    guidanceScales.map(async (guidanceScale) => {
      catchExecuted = false;
      try {
        const resultPromise = await imageGeneration.fetch(
          prompt,
          negativePrompt,
          width,
          height,
          cropsCoordsTopLeftX,
          cropsCoordsTopLeftY,
          seed,
          numInferenceSteps,
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
    const prompt = "Generate a beautiful landscape image";
    const negativePrompt = "Avoid any buildings or man-made structures";
    const width = 720;
    const height = 720;
    const cropsCoordsTopLeftX = 512;
    const cropsCoordsTopLeftY = 512;
    const seed = 123456;
    const numInferenceSteps = 40;
    const guidanceScale = 10;
    const imageFormat = "MP3";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "imageFormat should be in 'PNG' and 'JPEG' image formats";
    let catchExecuted = false;

    // Act & Assert
    catchExecuted = false;
    try {
      const resultPromise = await imageGeneration.fetch(
        prompt,
        negativePrompt,
        width,
        height,
        cropsCoordsTopLeftX,
        cropsCoordsTopLeftY,
        seed,
        numInferenceSteps,
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

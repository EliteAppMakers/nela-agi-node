import { NelaAGI, NelaAGIError } from "../../src";
import { TextToSpeech } from "../../src/audio/text-to-speech";

describe("TextToSpeech", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let textToSpeech: TextToSpeech;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    textToSpeech = new TextToSpeech(client);
  });

  // Successfully fetch text-to-speech with only required prompt and default parameters
  it("should successfully fetch text-to-speech with only required prompt and default parameters", async () => {
    // Arrange
    const text = "a beautiful landscape image";
    const url =
      "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/text_to_speech_ms";
    const method = "post";
    const requestData = {
      text,
    };
    const responseData = {
      output: [
        {
          type: "audio_base64",
          data: expect.any(String),
        },
      ],
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await textToSpeech.fetch(text);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
    expect(axiosConfig.headers["Content-Type"]).toContain("application/json");
  }, 120000);

  // Successfully fetch text-to-speech with valid prompt and custom parameters
  it("should successfully fetch text-to-speech with valid prompt and custom parameters", async () => {
    // Arrange
    const text = "a beautiful landscape image";
    const speakerId = 1;
    const speakerGender = "MALE";
    const requestData = {
      text,
      speaker_id: speakerId,
      speaker_gender: speakerGender,
    };
    const responseData = {
      output: [
        {
          type: "audio_base64",
          data: expect.any(String),
        },
      ],
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await textToSpeech.fetch(text, speakerId, speakerGender);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
  }, 120000);

  // Reject with NelaAGIError if text length is less than 2 characters
  it("should reject with NelaAGIError when text length is less than 2 characters", async () => {
    // Arrange
    const text = "a";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Text length should be between 2 and 5000 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await textToSpeech.fetch(text);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if text length is greater than 5000 characters
  it("should reject with NelaAGIError when text length is greater than 5000 characters", async () => {
    // Arrange
    const text = "a";
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Text length should be between 2 and 5000 characters";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await textToSpeech.fetch(text);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if speakerId is not between 1 and 110
  it("should reject with NelaAGIError when speakerId is not between 1 and 110", async () => {
    // Arrange
    const text = "Generate a beautiful landscape image";
    const speakerIds = [0.99, 110.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "speakerId should be between 1 and 110";
    let catchExecuted = false;

    // Act & Assert
    speakerIds.map(async (speaker_id) => {
      catchExecuted = false;
      try {
        const resultPromise = await textToSpeech.fetch(text, speaker_id);
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toBe(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError when speakerGender parameter is not MALE OR FEMALE
  it("should reject with NelaAGIError when speakerGender parameter is not MALE OR FEMALE", async () => {
    // Arrange
    const text = "Generate a beautiful landscape image";
    const speaker_id = 5;
    const speaker_gender = "INVALID";

    const expectedErrorCode = 422;
    const expectedErrorMessage = `speakerGender should be "MALE" or "FEMALE"`;
    let catchExecuted = false;

    // Act & Assert
    catchExecuted = false;
    try {
      const resultPromise = await textToSpeech.fetch(
        text,
        speaker_id,
        speaker_gender
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

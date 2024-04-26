import fs from "fs";
import { NelaAGI, NelaAGIError, createBlobFromFilePath } from "../../src";
import { SpeechEnhancement } from "../../src/audio/speech-enhancement";
import { getContentTypeFromBuffer } from "../../src/utils";

describe("SpeechEnhancement", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let speechEnhancement: SpeechEnhancement;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    speechEnhancement = new SpeechEnhancement(client);
  });

  // Successfully fetch SpeechEnhancement with only required required audio as Blob
  it("should successfully fetch SpeechEnhancement with only required required audio as Blob", async () => {
    // Arrange
    const audio = createBlobFromFilePath(
      "./tests/assets/speech-enhancement.mp3"
    );
    const url =
      "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/speech_enhancement";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("audio", audio);
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
    const result = await speechEnhancement.fetch(audio);

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

  // Successfully fetch SpeechEnhancement with only required required audio as Buffer
  it("should successfully fetch SpeechEnhancement with only required required audio as Buffer", async () => {
    // Arrange
    const audio = fs.readFileSync("./tests/assets/speech-enhancement.wav");
    const audioContentType = getContentTypeFromBuffer(audio);
    const audioBlob = new Blob([audio], {
      type: audioContentType,
    });
    const url =
      "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/speech_enhancement";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("audio", audioBlob);
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
    const result = await speechEnhancement.fetch(audio);

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

  // Reject with NelaAGIError if Audio format should be MP3, MPEG or WAV"
  it("should reject with NelaAGIError when Audio format should be MP3, MPEG or WAV", async () => {
    // Arrange
    const audio = createBlobFromFilePath("./tests/assets/image-inpainting.jpg");
    const expectedErrorCode = 422;
    const expectedErrorMessage = "audio format should be MP3, MPEG or WAV";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await speechEnhancement.fetch(audio);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });
});

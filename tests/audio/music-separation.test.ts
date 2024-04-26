import fs from "fs";
import { NelaAGI, NelaAGIError, createBlobFromFilePath } from "../../src";
import { MusicSeparation } from "../../src/audio/music-separation";
import { getContentTypeFromBuffer } from "../../src/utils";

describe("MusicSeparation", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let musicSeparation: MusicSeparation;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    musicSeparation = new MusicSeparation(client);
  });

  // Successfully fetch music-separation with only required audio as Blob and split
  it("should successfully fetch music-separation with only required audio as Blob and split", async () => {
    // Arrange
    const audio = createBlobFromFilePath("./tests/assets/music-separation.mp3");
    const split = "ALL";
    const url =
      "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/music_separation";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("audio", audio);
    requestFormData.append("split", split);
    const responseData = {
      output: expect.arrayContaining([
        { type: expect.any(String), data: expect.any(String) },
      ]),
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await musicSeparation.fetch(audio, split);

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

  // Successfully fetch music-separation with only required audio as Buffer and split
  it("should successfully fetch music-separation with only required audio as Buffer and split", async () => {
    // Arrange
    const audio = fs.readFileSync("./tests/assets/music-separation.wav");
    const audioContentType = getContentTypeFromBuffer(audio);
    const audioBlob = new Blob([audio], {
      type: audioContentType,
    });
    const split = "ALL";
    const url =
      "https://beta-apis.eliteappmakers.in/am_muspnet_v1/v0_2/music_separation";
    const method = "post";
    const requestFormData = new FormData();
    requestFormData.append("audio", audioBlob);
    requestFormData.append("split", split);
    const responseData = {
      output: expect.arrayContaining([
        { type: expect.any(String), data: expect.any(String) },
      ]),
      model_time_taken: expect.any(Number),
    };

    // Act
    const result = await musicSeparation.fetch(audio, split);

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
    const split = "ALL";
    const expectedErrorCode = 422;
    const expectedErrorMessage = "audio format should be MP3, MPEG or WAV";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await musicSeparation.fetch(audio, split);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError when Split format should be 'ALL' or 'KARAOKE'
  it("should reject with NelaAGIError when Split format should be 'ALL' or 'KARAOKE'", async () => {
    // Arrange
    const audio = createBlobFromFilePath("./tests/assets/speech-to-text.mp3");
    const split = "GUITAR";
    const expectedErrorCode = 422;
    const expectedErrorMessage = "split format should be 'ALL' or 'KARAOKE'";
    let catchExecuted = false;

    // Act & Assert
    catchExecuted = false;
    try {
      const resultPromise = await musicSeparation.fetch(audio, split);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });
});

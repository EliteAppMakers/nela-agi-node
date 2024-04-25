import fs from "fs";
import {
  createBlobFromFilePath,
  getContentTypeFromBuffer,
  getContentTypeFromExtension,
  readEnv,
} from "../src/utils";

describe("utils", () => {
  describe("readEnv", () => {
    // Returns the trimmed value of an existing environment variable.
    it("should return the trimmed value of an existing environment variable", () => {
      // Arrange
      const env = "TEST_VAR_1";
      process.env.TEST_VAR_1 = "   test   ";

      // Act
      const result = readEnv(env);

      // Assert
      expect(result).toBe("test");
    });

    // Returns undefined if the environment variable doesn't exist.
    it("should return undefined when the environment variable doesnt exist", () => {
      // Arrange
      const env = "TEST_VAR_2";

      // Act
      const result = readEnv(env);

      // Assert
      expect(result).toBeUndefined();
    });

    // Returns undefined if the process object is undefined.
    it("should return undefined when the process object is undefined", () => {
      // Arrange
      const env = "TEST_VAR_3";

      // Act
      const result = readEnv(env);
      const originalProcess = global.process;
      (global.process as any) = undefined;

      // Assert
      expect(readEnv("TEST_VAR_2")).toBeUndefined();

      // CleanUp
      global.process = originalProcess;
    });

    // Returns undefined if the input parameter is an empty string.
    it("should return undefined when the input parameter is an empty string", () => {
      // Arrange
      const env = "";

      // Act
      const result = readEnv(env);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("getContentTypeFromBuffer", () => {
    // Returns "image/jpeg" if buffer matches the pattern for a JPEG image.
    it('should return "image/jpeg" when buffer matches the pattern for a JPEG image', () => {
      // Arrange
      const buffer = Buffer.from([0xff, 0xd8, 0xff]);
      const fileBuffer = fs.readFileSync("./tests/assets/image-inpainting.jpg");
      const expectedContentType = "image/jpeg";

      // Act
      const result = getContentTypeFromBuffer(fileBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "image/png" if buffer matches the pattern for a PNG image.
    it('should return "image/png" when buffer matches the pattern for a PNG image', () => {
      // Arrange
      const buffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      const fileBuffer = fs.readFileSync("./tests/assets/image-inpainting.png");
      const expectedContentType = "image/png";

      // Act
      const result = getContentTypeFromBuffer(fileBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/mpeg" if buffer matches the pattern for an MP3 audio file with ID3 header.
    it('should return "audio/mpeg" when buffer matches the pattern for an MP3 audio file with ID3 header', () => {
      // Arrange
      const buffer = Buffer.from([0x49, 0x44, 0x33]);
      const fileBuffer = fs.readFileSync("./tests/assets/music-separation.mp3");
      const expectedContentType = "audio/mpeg";

      // Act
      const result = getContentTypeFromBuffer(fileBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/mpeg" if buffer matches the pattern for an MP3 audio file with Frame sync header.
    it('should return "audio/mpeg" when buffer matches the pattern for an MP3 audio file with Frame sync header', () => {
      // Arrange
      const buffer = Buffer.from([0x49, 0x44, 0x33]);
      const fileBuffer = fs.readFileSync(
        "./tests/assets/speech-enhancement.mp3"
      );
      const expectedContentType = "audio/mpeg";

      // Act
      const result = getContentTypeFromBuffer(fileBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/wav" if buffer matches the pattern for an WAV audio file.
    it('should return "audio/wav" when buffer matches the pattern for an WAV audio file', () => {
      // Arrange
      const buffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      ]);
      const fileBuffer = fs.readFileSync(
        "./tests/assets/speech-enhancement.wav"
      );
      const expectedContentType = "audio/wav";

      // Act
      const result = getContentTypeFromBuffer(fileBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns unknown if buffer is empty.
    it("should return unknown when buffer is empty", () => {
      // Arrange
      const buffer = Buffer.from([]);
      const expectedContentType = "unknown";

      // Act
      const result = getContentTypeFromBuffer(buffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns unknown if buffer does not match any of the patterns.
    it("should return unknown when buffer does not match any of the patterns", () => {
      // Arrange
      const buffer = Buffer.from([0x00, 0x00, 0x00]);
      const expectedContentType = "unknown";

      // Act
      const result = getContentTypeFromBuffer(buffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });
  });

  describe("getContentTypeFromExtension", () => {
    // Should return the correct content type for a valid extension
    it("should return the correct content type when given a valid extension", () => {
      // Arrange
      const mimeTypes = {
        jpg: "image/jpeg",
        png: "image/png",
        mp3: "audio/mpeg",
        wav: "audio/wav",
      };

      // Act & Assert
      Object.entries(mimeTypes).forEach(([extension, expectedContentType]) => {
        const result = getContentTypeFromExtension(extension);
        expect(result).toBe(expectedContentType);
      });
    });

    // Should return the correct content type for a valid extension with mixed case
    it("should return the correct content type for a valid extension with mixed case", () => {
      // Arrange
      const extension = "JpG";
      const expectedContentType = "image/jpeg";

      // Act
      const result = getContentTypeFromExtension(extension);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Should return unknown for an empty extension string
    it("should return unknown when given an empty extension string", () => {
      // Arrange
      const extension = "";
      const expectedContentType = "unknown";

      // Act
      const result = getContentTypeFromExtension(extension);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Should return undefined for an invalid extension
    it("should return undefined when given an invalid extension", () => {
      // Arrange
      const extension = "invalid";

      // Act
      const result = getContentTypeFromExtension(extension);

      // Assert
      expect(result).toBe(extension);
    });
  });

  describe("createBlobFromFilePath", () => {
    // should create a Blob object from a valid file path
    it("should create a Blob object when given a valid file path", () => {
      // Arrange
      const filePath = "./tests/assets/music-separation.mp3";
      const expectedContentType = "audio/mpeg";

      // Act
      const result = createBlobFromFilePath(filePath);

      // Assert
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(expectedContentType);
    });

    // should return a Blob object with 'image/png' content type if the file type cannot be determined from buffer
    it("should return a Blob object with 'image/png' content type when file type cannot be determined from buffer", () => {
      // Arrange
      const filePath = "path/to/file.png";
      const expectedContentType = "image/png";

      // Mock the fs.readFileSync function
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(Buffer.from([0xff, 0x44, 0x33]));

      // Act
      const result = createBlobFromFilePath(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(expectedContentType);
    });

    // should return a Blob object with given 'extention' content type when file type cannot be determined from buffer and from given file extension
    it("should return a Blob object with given 'extention' content type when file type cannot be determined from buffer and from given file extension", () => {
      // Arrange
      const filePath = "path/to/file.mkv";
      const expectedContentType = "mkv";

      // Mock the fs.readFileSync function
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(Buffer.from([0xff, 0x44, 0x33]));

      // Act
      const result = createBlobFromFilePath(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe("mkv");
    });

    // should handle files with no extension
    it("should create a Blob object with unknown content type when given a file path with no extension", () => {
      // Arrange
      const filePath = "path/to/file";
      const expectedContentType = "unknown";

      // Mock the fs.readFileSync function
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValue(Buffer.from([0x4f, 0x44, 0x33])); // Mock file buffer

      // Act
      const result = createBlobFromFilePath(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(expectedContentType);
    });
  });
});

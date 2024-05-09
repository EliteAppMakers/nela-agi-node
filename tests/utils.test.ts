import fs from "fs";
import {
  convertUrlToBlob,
  getContentTypeFromArrayBuffer,
  getContentTypeFromExtension,
  readEnv,
  readLocalFileAsArrayBuffer,
  readLocalFileAsBlob,
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

  describe("convertUrlToBlob", () => {
    // Successfully fetches and converts a valid URL to a Blob object
    it("should fetch and convert valid URL to Blob object", async () => {
      // Call the function
      const result = await convertUrlToBlob(
        "https://beta-nela.eliteappmakers.in/chatbot-suggestions/image-to-image.jpg"
      );

      // Assertions
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe("image/jpeg");
    });
  });

  describe("readLocalFileAsArrayBuffer", () => {
    // Returns an ArrayBuffer when given a valid file path.
    it("should return an ArrayBuffer when given a valid file path", () => {
      const filePath = "./tests/assets/image-inpainting.jpg";
      const arrayBuffer = readLocalFileAsArrayBuffer(filePath);
      expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
    });
  });

  describe("getContentTypeFromArrayBuffer", () => {
    // Returns "image/jpeg" if arrayBuffer matches the pattern for a JPEG image.
    it('should return "image/jpeg" when arrayBuffer matches the pattern for a JPEG image', () => {
      // Arrange
      const arrayBuffer = readLocalFileAsArrayBuffer(
        "./tests/assets/image-inpainting.jpg"
      );
      // const arrayBuffer = new Uint8Array([0xff, 0xd8, 0xff]).buffer;
      const expectedContentType = "image/jpeg";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "image/png" if arrayBuffer matches the pattern for a PNG image.
    it('should return "image/png" when arrayBuffer matches the pattern for a PNG image', () => {
      // Arrange
      const arrayBuffer = readLocalFileAsArrayBuffer(
        "./tests/assets/image-inpainting.png"
      );
      // const arrayBuffer = new Uint8Array([
      //   0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      // ]).buffer;
      const expectedContentType = "image/png";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/mpeg" if arrayBuffer matches the pattern for an MP3 audio file with ID3 header.
    it('should return "audio/mpeg" when arrayBuffer matches the pattern for an MP3 audio file with ID3 header', () => {
      // Arrange
      const arrayBuffer = readLocalFileAsArrayBuffer(
        "./tests/assets/music-separation.mp3"
      );
      // const arrayBuffer = new Uint8Array([0x49, 0x44, 0x33]).buffer;
      const expectedContentType = "audio/mpeg";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/mpeg" if arrayBuffer matches the pattern for an MP3 audio file with Frame sync header.
    it('should return "audio/mpeg" when arrayBuffer matches the pattern for an MP3 audio file with Frame sync header', () => {
      // Arrange
      const arrayBuffer = readLocalFileAsArrayBuffer(
        "./tests/assets/speech-enhancement.mp3"
      );
      // const arrayBuffer = new Uint8Array([0x49, 0x44, 0x33]).buffer;
      const expectedContentType = "audio/mpeg";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns "audio/wav" if arrayBuffer matches the pattern for an WAV audio file.
    it('should return "audio/wav" when arrayBuffer matches the pattern for an WAV audio file', () => {
      // Arrange
      const arrayBuffer = readLocalFileAsArrayBuffer(
        "./tests/assets/speech-enhancement.wav"
      );
      // const arrayBuffer = new Uint8Array([
      //   0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      // ]).buffer;
      const expectedContentType = "audio/wav";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns unknown if arrayBuffer is empty.
    it("should return unknown when arrayBuffer is empty", () => {
      // Arrange
      const arrayBuffer = new Uint8Array([]).buffer;
      const expectedContentType = "unknown";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

      // Assert
      expect(result).toBe(expectedContentType);
    });

    // Returns unknown if arrayBuffer does not match any of the patterns.
    it("should return unknown when arrayBuffer does not match any of the patterns", () => {
      // Arrange
      const arrayBuffer = new Uint8Array([0x00, 0x00, 0x00]).buffer;
      const expectedContentType = "unknown";

      // Act
      const result = getContentTypeFromArrayBuffer(arrayBuffer);

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

  describe("readLocalFileAsBlob", () => {
    // should create a Blob object from a valid file path
    it("should create a Blob object when given a valid file path", () => {
      // Arrange
      const filePath = "./tests/assets/music-separation.mp3";
      const expectedContentType = "audio/mpeg";

      // Act
      const result = readLocalFileAsBlob(filePath);

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
      const result = readLocalFileAsBlob(filePath);

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
      const result = readLocalFileAsBlob(filePath);

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
      const result = readLocalFileAsBlob(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(expectedContentType);
    });
  });
});

import axios from "axios";

/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */
export const readEnv = (env: string): string | undefined => {
  if (typeof process !== "undefined") {
    return process.env?.[env]?.trim() ?? undefined;
  }
  return undefined;
};

/**
 * Converts a URL to a Blob object.
 *
 * @param {string} url - The URL of the resource to convert.
 * @returns {Promise<Blob>} - A Promise that resolves to a Blob object representing the resource.
 */
export const convertUrlToBlob = async (url: string): Promise<Blob> => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const contentType = response.headers["content-type"];
  const data = new Blob([response.data], { type: contentType });
  return data;
};

/**
 * Creates a ArrayBuffer object from a local file path.
 *
 * @param {string} filePath - The path of the file to create a ArrayBuffer from.
 * @returns {ArrayBuffer} - A ArrayBuffer object representing the file content.
 */
export const readLocalFileAsArrayBuffer = (filePath: string): ArrayBuffer => {
  const fs = require("fs");
  const fileBuffer = fs.readFileSync(filePath);
  const fileArrayBuffer = fileBuffer.buffer;
  const fileByteOffset = fileBuffer.byteOffset;
  if (fileByteOffset === 0) {
    return fileArrayBuffer;
  } else {
    const arrayBuffer = fileBuffer.buffer.slice(
      fileByteOffset,
      fileByteOffset + fileBuffer.byteLength
    );
    return arrayBuffer;
  }
};

/**
 * Returns the content type of a ArrayBuffer if it matches a specific pattern.
 *
 * @param {ArrayBuffer} arrayBuffer - The buffer to check for the content type.
 * @returns {string | undefined} - The content type of the buffer if it matches the pattern for a "image/jpeg" or "image/png", or undefined if it does not match any of the patterns.
 */
export const getContentTypeFromArrayBuffer = (
  arrayBuffer: ArrayBuffer
): string | undefined => {
  const uint8Array = new Uint8Array(arrayBuffer);
  // Check for the presence of jpg header (ff d8 ff)
  if (
    uint8Array[0] === 0xff &&
    uint8Array[1] === 0xd8 &&
    uint8Array[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // Check for the presence of png header (89 50 4e 47 0d 0a 1a 0a)
  if (
    uint8Array[0] === 0x89 &&
    uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4e &&
    uint8Array[3] === 0x47 &&
    uint8Array[4] === 0x0d &&
    uint8Array[5] === 0x0a &&
    uint8Array[6] === 0x1a &&
    uint8Array[7] === 0x0a
  ) {
    return "image/png";
  }

  // Check for the presence of ID3 header (49 44 33) - MPEG-1 Audio Layer 3
  if (
    uint8Array[0] === 0x49 &&
    uint8Array[1] === 0x44 &&
    uint8Array[2] === 0x33
  ) {
    return "audio/mpeg";
  }

  // Check for the presence of
  // MPEG Version 1 Layer 3 header (ff fa || ff fb),
  // MPEG Version 2 Layer 3 header (ff f2 || ff f3),
  // MPEG Version 2.5 Layer 3 header (ff e2 || ff e3)
  if (
    uint8Array[0] === 0xff &&
    (uint8Array[1] === 0xfa ||
      uint8Array[1] === 0xfb ||
      uint8Array[1] === 0xf2 ||
      uint8Array[1] === 0xf3 ||
      uint8Array[1] === 0xe2 ||
      uint8Array[1] === 0xe3)
  ) {
    return "audio/mpeg";
  }

  // Check for the presence of WAV header (52 49 46 46 xx xx xx xx 57 41 56 45)
  if (
    uint8Array[0] === 0x52 &&
    uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 &&
    uint8Array[3] === 0x46 &&
    uint8Array[8] === 0x57 &&
    uint8Array[9] === 0x41 &&
    uint8Array[10] === 0x56 &&
    uint8Array[11] === 0x45
  ) {
    return "audio/wav";
  }

  return "unknown";
};

const mimeTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

/**
 * Returns the corresponding content type for a given file extension.
 * If the extension is found in the `mimeTypes` object, the corresponding content type is returned.
 * Otherwise, the extension itself is returned.
 *
 * @param extension - The file extension for which the content type needs to be determined.
 * @returns The content type corresponding to the given extension if it is found in the `mimeTypes` object.
 *          The extension itself if it is not found in the `mimeTypes` object.
 *          "unknown" if the extension is not a non-empty string.
 */
export const getContentTypeFromExtension = (extension: string): string => {
  if (typeof extension === "string" && extension.length > 1) {
    const fileExtension = extension.toLowerCase();
    return mimeTypes[fileExtension] || fileExtension;
  } else {
    return "unknown";
  }
};

/**
 * Creates a Blob object from a local file path.
 *
 * @param {string} filePath - The path of the file to create a Blob from.
 * @returns {Blob} - A Blob object representing the file content with the determined content type.
 */
export const readLocalFileAsBlob = (filePath: string): Blob => {
  const arrayBuffer = readLocalFileAsArrayBuffer(filePath);
  let fileContentType = getContentTypeFromArrayBuffer(arrayBuffer);
  const fileExtension = filePath.split(".");
  if (fileContentType === "unknown" && fileExtension.length >= 2) {
    fileContentType = getContentTypeFromExtension(
      fileExtension[fileExtension.length - 1]
    );
  }
  const fileBlob = new Blob([arrayBuffer], { type: fileContentType });
  return fileBlob;
};

import { NelaAGI, NelaAGIError } from "../src";
import { Audio } from "../src/audio";
import { Image } from "../src/image";
import { Text } from "../src/text";

describe("NelaAGI", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  const mockUrl = process.env.TEST_MOCK_URL;
  // const mockUrl = "process.env.TEST_MOCK_URL";

  // Creating a new instance of NelaAGI with valid accountId and authKey should not throw an error.
  it("should not throw an error when creating a new instance with valid accountId and authKey", () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;

    // Act
    const createNelaAGIInstance = () => new NelaAGI(accountId, authKey);

    // Assert
    expect(createNelaAGIInstance).not.toThrow();
  });

  // Creating a new instance of NelaAGI with NELA_ACCOUNTID and NELA_AUTHKEY from env should not throw an error.
  it("should not throw an error when creating a new instance with NELA_ACCOUNTID and NELA_AUTHKEY from env", () => {
    // Arrange
    process.env.NELA_ACCOUNTID = validAccountId;
    process.env.NELA_AUTHKEY = validAuthKey;

    // Act
    const createNelaAGIInstance = () => new NelaAGI();

    // Assert
    expect(createNelaAGIInstance).not.toThrow();
  });

  // Creating a new instance of NelaAGI with an invalid accountId should throw a NelaAGIError.
  it("should throw a NelaAGIError when creating a new instance with an invalid accountId", () => {
    // Arrange
    const accountId = "";
    const authKey = validAuthKey;
    const expectedErrorCode = 400;
    const expectedErrorMessage =
      "The NELA_ACCOUNTID environment variable is missing or empty or length of the accountId provided is not equal to 12 characters; either provide it, or instantiate the NelaAGI client with an accountId option, like new NelaAGI('123456789012', 'My API Key').";

    // Act
    const createInstance = () => new NelaAGI(accountId, authKey);

    // Assert
    try {
      createInstance();
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
    }
  });

  // Creating a new instance of NelaAGI with an invalid authKey should throw a NelaAGIError.
  it("should throw a NelaAGIError when creating a new instance with an invalid authKey", () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = "";
    const expectedErrorCode = 400;
    const expectedErrorMessage =
      "The NELA_AUTHKEY environment variable is missing or empty; either provide it, or instantiate the NelaAGI client with an authKey option, like new NelaAGI('123456789012', 'My API Key').";

    // Act
    const createInstance = () => new NelaAGI(accountId, authKey);

    // Assert
    try {
      createInstance();
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
    }
  });

  // Accessing the text property of a NelaAGI instance should return an instance of the Text class.
  it("should return an instance of the Text class when accessing the text property", () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);

    // Act
    const text = nelaAGI.text;
    const textClient = text.getClient();

    // Assert
    expect(text).toBeInstanceOf(Text);
    expect(textClient).toBe(nelaAGI);
  });

  // Accessing the image property of a NelaAGI instance should return an instance of the Image class.
  it("should return an instance of the Image class when accessing the image property", () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);

    // Act
    const image = nelaAGI.image;
    const imageClient = image.getClient();

    // Assert
    expect(image).toBeInstanceOf(Image);
    expect(imageClient).toBe(nelaAGI);
  });

  // Accessing the audio property of a NelaAGI instance should return an instance of the Audio class.
  it("should return an instance of the Audio class when accessing the audio property", () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);

    // Act
    const audio = nelaAGI.audio;
    const audioClient = audio.getClient();

    // Assert
    expect(audio).toBeInstanceOf(Audio);
    expect(audioClient).toBe(nelaAGI);
  });

  // Calling fetch method with empty url should return a Promise rejected with a NelaAGIError".
  it("should return a Promise rejected with a NelaAGIError when fetch method is called with an empty url", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = "";
    const method = "GET";
    const requestData = {};
    const isMultipartFormData = false;
    const expectedErrorCode = 400;
    const expectedErrorMessage = "url should not be empty";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with an invalid URL Address should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with an invalid URL Address", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = "https://beta-apis-test.eliteappmakers.com";
    const method = "GET";
    const requestData = {};
    const isMultipartFormData = false;
    const expectedErrorCode = 501;
    const expectedErrorMessage =
      "Unable to connect to the server at this moment due to ENOTFOUND, reason: getaddrinfo ENOTFOUND beta-apis-test.eliteappmakers.com";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with an invalid IP address and port should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with an invalid IP address and port", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = "10.10.10.1";
    const method = "GET";
    const requestData = {};
    const isMultipartFormData = false;
    const expectedErrorCode = 501;
    const expectedErrorMessage =
      "Unable to connect to the server at this moment due to ECONNREFUSED, reason: connect ECONNREFUSED ::1:80";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with an invalid Method should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with an invalid Method", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = "https://beta-apis-test.eliteappmakers.in";
    const method = "INVALID_METHOD";
    const requestData = {};
    const isMultipartFormData = false;
    const expectedErrorCode = 400;
    const expectedErrorMessage =
      "Allowed HttpMethods are 'GET', 'POST', 'PUT', 'DELETE'";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with valid method: get should return a Promise resolved with the response with correct url, method, headers, params, data on success.
  it("should return a Promise resolved with the response with correct url, method, headers, params, data on success when calling the fetch method with valid method: get", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/get/200`;
    const method = "get";
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;
    const responseData = {
      message: "get 200 OK",
    };

    // Act
    const result = await nelaAGI.fetch(
      url,
      method,
      requestData,
      isMultipartFormData
    );

    // Assert
    expect(result.data).toEqual(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.headers["Account-Id"]).toBe(accountId);
    expect(axiosConfig.headers["Auth-Key"]).toBe(`api-key ${authKey}`);
    expect(axiosConfig.headers["Content-Type"]).toBe("application/json");
    expect(axiosConfig.params).toEqual(requestData);
    expect(axiosConfig.data).toBeUndefined();
  }, 60000);

  // Calling the fetch method with valid method: get should return a Promise resolved with the response with correct url, method, headers, params, data on success.
  it("should return a Promise resolved with the response with correct url, method, headers, params, data on success when calling the fetch method with valid method: post, put, delete", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const methods = ["post", "put", "delete"];
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;

    methods.map(async (method) => {
      // Act
      const url = `${mockUrl}/mock/${method}/200`;
      const responseData = {
        message: `${method} 200 OK`,
      };
      const result = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );

      // Assert
      expect(result.data).toEqual(responseData);
      const axiosConfig = result.config;
      expect(axiosConfig.url).toBe(url);
      expect(axiosConfig.method).toBe(method);
      expect(axiosConfig.headers["Account-Id"]).toBe(accountId);
      expect(axiosConfig.headers["Auth-Key"]).toBe(`api-key ${authKey}`);
      expect(axiosConfig.headers["Content-Type"]).toBe("application/json");
      expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
      expect(axiosConfig.params).toBeUndefined();
    });
  }, 60000);

  // Calling the fetch method with isMultipartFormData set to true should set the Content-Type header to multipart/form-data.
  it("should set the Content-Type header to multipart/form-data when isMultipartFormData is true", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/post/200`;
    const method = "post";
    const requestData = { key1: "value1" };
    const isMultipartFormData = true;
    const responseData = {
      message: "post 200 OK",
    };

    // Act
    const result = await nelaAGI.fetch(
      url,
      method,
      requestData,
      isMultipartFormData
    );

    // Assert
    expect(result.data).toEqual(responseData);
    expect(result.config.headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
  }, 60000);

  // Calling the fetch method with API Url which gives Service Unavailable Error should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with API Url which gives Service Unavailable Error", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/post/503`;
    const method = "post";
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;
    const expectedErrorCode = 503;
    const expectedErrorMessage =
      "Unable to connect to the server at this moment due to Service Unavailable";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with API Url which gives Bad Gateway Error should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with API Url which gives Bad Gateway Error", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/post/502`;
    const method = "post";
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;
    const expectedErrorCode = 502;
    const expectedErrorMessage =
      "Unable to connect to the server at this moment due to Bad Gateway";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with API Url which gives Internal Server Error should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with API Url which gives Internal Server Error", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/post/500`;
    const method = "post";
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;
    const expectedErrorCode = 500;
    const expectedErrorMessage =
      "This may be a bug on our side. Please contact us at contact@eliteappmakers.com";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);

  // Calling the fetch method with API Url which gives Unauthorized Error should reject the Promise with a NelaAGIError.
  it("should reject the Promise with a NelaAGIError when calling the fetch method with API Url which gives Unauthorized Error", async () => {
    // Arrange
    const accountId = validAccountId;
    const authKey = validAuthKey;
    const nelaAGI = new NelaAGI(accountId, authKey);
    const url = `${mockUrl}/mock/post/401`;
    const method = "post";
    const requestData = { key1: "value1" };
    const isMultipartFormData = false;
    const expectedErrorCode = 401;
    const expectedErrorMessage = "post 401 Unauthorized";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await nelaAGI.fetch(
        url,
        method,
        requestData,
        isMultipartFormData
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  }, 60000);
});

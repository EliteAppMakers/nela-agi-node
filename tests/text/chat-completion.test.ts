import { NelaAGI, NelaAGIError } from "../../src";
import { ChatCompletion } from "../../src/text/chat-completion";

describe("ChatCompletion", () => {
  const validAccountId = process.env.TEST_NELA_ACCOUNTID;
  const validAuthKey = process.env.TEST_NELA_AUTHKEY;
  let chatCompletion: ChatCompletion;

  beforeEach(() => {
    const client = new NelaAGI(validAccountId, validAuthKey);
    chatCompletion = new ChatCompletion(client);
  });

  // Successfully fetch chat completion with only required conversations and default parameters
  it("should successfully fetch chat completion with only required conversations and default parameters", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const url =
      "https://beta-apis.eliteappmakers.in/llm_gpt_neox_3b/v0_2/chat_completion";
    const method = "post";
    const requestData = {
      conversations,
      max_new_tokens: 512,
      do_sample: true,
      temperature: 0.5,
      top_p: 0.8,
      top_k: 50,
      repetition_penalty: 1,
    };
    const responseData = {
      output: [
        {
          type: "text",
          data: expect.any(String),
        },
      ],
      input_token_length: expect.any(Number),
      output_token_length: expect.any(Number),
      model_time_taken: expect.any(Number),
      throughput: expect.any(Number),
      latency: expect.any(Number),
    };

    // Act
    const result = await chatCompletion.fetch(conversations);

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.url).toBe(url);
    expect(axiosConfig.method).toBe(method);
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
    expect(axiosConfig.headers["Content-Type"]).toBe("application/json");
  }, 120000);

  // Successfully fetch chat completion with valid conversations and custom parameters
  it("should successfully fetch chat completion with valid conversations and custom parameters", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 1024;
    const doSample = false;
    const temperature = 0.9;
    const topP = 0.5;
    const topK = 20;
    const repetitionPenalty = 1.5;
    const requestData = {
      conversations,
      max_new_tokens: maxNewTokens,
      do_sample: doSample,
      temperature,
      top_p: topP,
      top_k: topK,
      repetition_penalty: repetitionPenalty,
    };
    const responseData = {
      output: [
        {
          type: "text",
          data: expect.any(String),
        },
      ],
      input_token_length: expect.any(Number),
      output_token_length: expect.any(Number),
      model_time_taken: expect.any(Number),
      throughput: expect.any(Number),
      latency: expect.any(Number),
    };

    // Act
    const result = await chatCompletion.fetch(
      conversations,
      maxNewTokens,
      doSample,
      temperature,
      topP,
      topK,
      repetitionPenalty
    );

    // Assert
    expect(result.data).toMatchObject(responseData);
    const axiosConfig = result.config;
    expect(axiosConfig.data).toEqual(JSON.stringify(requestData));
  }, 120000);

  // Reject with NelaAGIError if conversations parameter is an empty array
  it("should reject with NelaAGIError when conversations parameter is an empty array", async () => {
    // Arrange
    const conversations: any[] = [];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "conversations list cannot be empty.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if conversations parameter with invalid properties
  it("should reject with NelaAGIError when conversations parameter with invalid properties", async () => {
    // Arrange
    const conversations: any[] = [{ key1: "value1" }];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "conversations must be an array of objects with role and content properties";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toBe(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if conversations parameter contains invalid role name
  it("should reject with NelaAGIError when conversations parameter contains invalid role name", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "invalidRole", content: "Invalid role name" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Invalid Role Name: 'invalidRole' in conversation index '2'.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if conversations parameter does not have system role in first position
  it("should reject with NelaAGIError when conversations parameter does not have system role in first position", async () => {
    // Arrange
    const conversations = [
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Invalid Role Position: System role needed to be in conversation index '0'.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if conversations parameter has invalid role position
  it("should reject with NelaAGIError when conversations parameter has invalid role position", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "How are you?" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Invalid Role Position: User role needed to be in odd position of conversation index '1'.\nInvalid Role Position: AI role needed to be in even position of conversation index '2'.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if conversations parameter does not have user role in last position
  it("should reject with NelaAGIError when conversations parameter does not have user role in last position", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "ai", content: "Great! Have a nice day!" },
    ];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Invalid Role Position: User role needed to be in end of conversation index '5'.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if content of conversation is less than 2 characters
  it("should reject with NelaAGIError when content of conversation is less than 2 characters", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "H" },
      { role: "ai", content: "I'm good, thanks!" },
    ];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "Invalid Content: Content of conversation index '1' must be at least 2 characters long.";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(conversations);
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if maxNewTokens parameter is not allowed value
  it("should reject with NelaAGIError when maxNewTokens parameter is not allowed value", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 100;
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "allowedMaxNewTokens values are 128, 256, 512, or 1024";
    let catchExecuted = false;

    // Act & Assert
    try {
      const resultPromise = await chatCompletion.fetch(
        conversations,
        maxNewTokens
      );
    } catch (error: any) {
      expect(error).toBeInstanceOf(NelaAGIError);
      expect(error.status_code).toBe(expectedErrorCode);
      expect(error.message).toContain(expectedErrorMessage);
      catchExecuted = true;
    }

    expect(catchExecuted).toBe(true);
  });

  // Reject with NelaAGIError if temperature parameter is not between 0.05 and 1
  it("should reject with NelaAGIError when temperature parameter is not between 0.05 and 1", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 128;
    const doSample = true;
    const temperatures = [0.049, 1.001];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "temperature must be a number between 0.05 and 1";
    let catchExecuted = false;

    // Act & Assert
    temperatures.map(async (temperature) => {
      catchExecuted = false;
      try {
        const resultPromise = await chatCompletion.fetch(
          conversations,
          maxNewTokens,
          doSample,
          temperature
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toContain(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if topP parameter is not between 0 and 1
  it("should reject with NelaAGIError when topP parameter is not between 0 and 1", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 256;
    const doSample = false;
    const temperature = 0.05;
    const topPs = [-0.001, 1.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "topP must be a number between 0 and 1";
    let catchExecuted = false;

    // Act & Assert
    topPs.map(async (topP) => {
      catchExecuted = false;
      try {
        const resultPromise = await chatCompletion.fetch(
          conversations,
          maxNewTokens,
          doSample,
          temperature,
          topP
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toContain(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if topK parameter is not between 0 and 100
  it("should reject with NelaAGIError when topK parameter is not between 0 and 100", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 256;
    const doSample = false;
    const temperature = 0.05;
    const topP = 0.7;
    const topKs = [-0.001, 100.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage = "topK value must be between 0 and 100";
    let catchExecuted = false;

    // Act & Assert
    topKs.map(async (topK) => {
      catchExecuted = false;
      try {
        const resultPromise = await chatCompletion.fetch(
          conversations,
          maxNewTokens,
          doSample,
          temperature,
          topP,
          topK
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toContain(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });

  // Reject with NelaAGIError if repetitionPenalty parameter is not between 1.0 and 2.0
  it("should reject with NelaAGIError when repetitionPenalty parameter is not between 1.0 and 2.0", async () => {
    // Arrange
    const conversations = [
      { role: "system", content: "Hello" },
      { role: "user", content: "How are you?" },
      { role: "ai", content: "I'm good, thanks!" },
      { role: "user", content: "What's the weather like today?" },
      { role: "ai", content: "It's sunny and warm!" },
      { role: "user", content: "Great! Have a nice day!" },
    ];
    const maxNewTokens = 256;
    const doSample = false;
    const temperature = 0.05;
    const topP = 0.7;
    const topK = 10;
    const repetitionPenaltys = [0.99, 2.01];
    const expectedErrorCode = 422;
    const expectedErrorMessage =
      "repetitionPenalty value must be number between 1.0 and 2.0";
    let catchExecuted = false;

    // Act & Assert
    repetitionPenaltys.map(async (repetitionPenalty) => {
      catchExecuted = false;
      try {
        const resultPromise = await chatCompletion.fetch(
          conversations,
          maxNewTokens,
          doSample,
          temperature,
          topP,
          topK,
          repetitionPenalty
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(NelaAGIError);
        expect(error.status_code).toBe(expectedErrorCode);
        expect(error.message).toContain(expectedErrorMessage);
        catchExecuted = true;
      }

      expect(catchExecuted).toBe(true);
    });
  });
});

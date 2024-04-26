# Nela AGI Node API Library

[![Version](https://img.shields.io/npm/v/nela-agi.svg)](https://www.npmjs.org/package/nela-agi)

The official TypeScript / JavaScript library for the Nela AGI API.

## Package Requirements

Node 16 or higher

## Documentation

Documentation of Nela AGI Gen Beta API and their usage is available at https://hub.eliteappmakers.in/docs/nela-gen-beta

## Prerequisites

- **Creating an EliteAppMakers User Profile:** This step is essential for accessing and managing all EliteAppMakers products. Follow the instructions in the guide ["How to Create a EliteAppMakers User Profile"](https://hub.eliteappmakers.in/docs/nela-gen-beta/getting-started/how-to-create-eliteappmakers-user-profile/)to get started.

- **Creating a Nela Account:** To use our Nela AGI APIs, you must have a Nela account. Learn how to create an account by following the steps outlined in the guide ["How to Create an Nela Account”](https://hub.eliteappmakers.in/docs/nela-gen-beta/getting-started/how-to-create-nela-account/) to get started.

- **Nela API Key:** To use our APIs, you'll need an API key. If you haven't already created one, refer to our guide on ["How to Create/Manage an API Key"](https://hub.eliteappmakers.in/docs/nela-gen-beta/getting-started/how-to-create-manage-an-api-key/).

- **Nela Account Id:** To use our APIs, you'll need an Nela Account Id. If you haven't already created one, refer to our guide on ["How to Create an Nela Account"](https://hub.eliteappmakers.in/docs/nela-gen-beta/getting-started/how-to-create-nela-account/).

- **Nela Compute Units (NCUs):** To use our APIs, you'll need an Nela Account Id. If you haven't already created one, refer to our guide on ["How to get / buy Nela Compute Units"](https://hub.eliteappmakers.in/docs/nela-gen-beta/getting-started/how-to-get-buy-nela-compute-units/).

## Installation

```bash
npm install nela-agi
# or
yarn add nela-agi
```

## Usage

Here's a usage guide for the nela-agi npm package with CommonJS (require), ES modules (import), and TypeScript

### Usage with CommonJS (require)

```javascript
const { NelaAGI, NelaAGIError } = require("nela-agi");
```

### Usage with ES modules (import)

```javascript
import { NelaAGI, NelaAGIError } from "nela-agi";
```

### Usage with TypeScript

```javascript
import { NelaAGI, NelaAGIError } from "nela-agi";
```

## NelaAGI

The `NelaAGI` class represents an instance of the NelaAGI API client, which provides access to various AI tasks including text-based, image-based, and audio-based tasks. It requires an account ID and authentication key to be instantiated. The class has properties for accessing different types of AI tasks, such as text, image, and audio. It also has a `fetch` method for making API requests.

### Parameters

- `accountId: string`: The account ID for the NelaAGI client. If not provided, it will attempt to read the **"NELA_ACCOUNTID"** environment variable.
- `authKey: string`: The authentication key for the NelaAGI client. If not provided, it will attempt to read the **"NELA_AUTHKEY"** environment variable.

### Properties

- `text: Text`: Provides access to various text-based AI tasks, including chat completion.
- `image: Image`: Provides access to various image-based AI tasks, including image generation, image-to-image translation, and image inpainting.
- `audio: Audio`: Provides access to various audio-based AI tasks, including text to speech, speech to text, speech enhancement, and music separation.

### Methods

- `fetch(url: string, method: string, requestData: object, isMultipartFormData: Boolean): Promise<AxiosResponse>`: Fetches data from the API using the specified URL, HTTP method, request data, and whether the request is multipart form data. Returns a promise that resolves with the response on success or rejects with an error message on failure.

### Example Usage

```javascript
const nelaAGI = new NelaAGI("account_id", "auth_key");

// Access text-based AI tasks
nelaAGI.text.chatCompletion
  .fetch([
    {
      role: "system",
      content: "default",
    },
    {
      role: "user",
      content: "hi",
    },
    {
      role: "ai",
      content: "hello, how can i help you?",
    },
    {
      role: "user",
      content: "who is Elon Musk?",
    },
  ])
  .then((result) => {
    console.log("then");
    console.log(result);
  })
  .catch((error) => {
    console.log("catch");
    console.log(error);
  });

// Access image-based AI tasks
nelaAGI.image.imageGeneration
  .fetch("space monkey")
  .then((result) => {
    console.log("then");
    console.log(result);
  })
  .catch((error) => {
    console.log("catch");
    console.log(error);
  });

// Access audio-based AI tasks
nelaAGI.audio.textToSpeech
  .fetch("hello")
  .then((result) => {
    console.log("then");
    console.log(result);
  })
  .catch((error) => {
    console.log("catch");
    console.log(error);
  });
```

## NelaAGIError

The `NelaAGIError` class is a custom error class that extends the built-in `Error` class. It is used to handle errors in the Nela AGI application.

### Parameters

- `status_code: number`: A number representing the HTTP status code associated with the error.
- `detail: string`: A string containing a detailed message describing the error.

### Example Usage

```javascript
try {
  // Some code that may throw an error
} catch (error) {
  const nelaError = new NelaAGIError(500, "An error occurred");
  console.log(nelaError.status_code); // Output: 500
  console.log(nelaError.detail); // Output: 'An error occurred'
  console.log(nelaError instanceof Error); // Output: true
  console.log(nelaError instanceof NelaAGIError); // Output: true
}
```

## Text based AI tasks

The `text: Text` is a property of the `NelaAGI` class which provides access to various text-based AI tasks, including chat completion.

### Properties

- `chatCompletion: ChatCompletion`: Provides methods for generating text completions within a conversational chat context.

## Image based AI tasks

The `image: Image` is a property of the `NelaAGI` class which provides access to various image-based AI tasks, including image generation, image-to-image translation, and image inpainting.

### Properties

- `imageGeneration: ImageGeneration`: Provides methods for generating images.
- `imageToimage: ImageToImage`: Provides methods for transforming images to other image forms.
- `imageInpainting: ImageInpainting`: Provides methods for inpainting missing or corrupted parts of images.

## Audio based AI tasks

The `audio: Audio` is a property of the `NelaAGI` class which provides access to various audio-based AI tasks, including text to speech, speech to text, speech enhancement, and music separation.

### Properties

- `textToSpeech: TextToSpeech`: Provides methods for text-to-speech conversion.
- `speechToText: SpeechToText` Provides methods for speech-to-text transcription.
- `speechEnhancement: SpeechEnhancement`: Provides methods for speech enhancement.
- `musicSeparation: MusicSeparation`: Provides methods for music separation.

## Text based AI tasks

## ChatCompletion

The `chatCompletion: ChatCompletion` is a property of the `text: Text` class and is used to fetch chat completion from the Nela AGI API. It provides a method called `fetch` that takes in conversations and various parameters, and returns a promise that resolves to the chat completion response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/text-based-ai-tasks/chat-completion/)

### Methods

- `fetch(conversations, maxNewTokens, doSample, temperature, topP, topK, repetitionPenalty)`: Fetch chat completion from the Nela AGI API based on the provided conversations and parameters. It validates the input parameters and returns a promise that resolves to the chat completion response from the API.

### Input Parameters

| Parameter Name     | Data Type                       | Default Value | Constraints                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Description                                                                                                                                      |
| ------------------ | ------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| conversations      | List[{role: str, content: str}] | Nil           | - Conversations list cannot be empty. <br> - Each conversation has a role (either "system", "user", or "ai") and content. <br> - conversations is formatted with a system message first, followed by alternating user and ai conversation. <br> - System role needed to be in the conversation index '0'. <br> - User role needed to be in an odd position of conversation index i.e 1,3,5,... <br> - AI role needed to be in an even position of conversation index i.e 2,4,6,... <br> - User role needed to be in end of conversation. <br> - Content of conversation index '{index}' must be at least 2 characters long | Defines the structure and content of the conversation between the user and the AI.                                                               |
| max_new_tokens     | Int                             | 512           | Allowed values are 128, 256, 512, or 1024                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Specifies the maximum number of tokens the AI should generate for the chat response.                                                             |
| do_sample          | Boolean                         | True          | Nil                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Determines whether the AI should use sampling during text generation.                                                                            |
| temperature        | Float                           | 0.5           | Between 0.05 and 1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Controls the randomness of the generated text. Lower values make the output more deterministic, while higher values introduce more randomness.   |
| top_p              | Float                           | 0.8           | Between 0 and 1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Influences the nucleus sampling mechanism by specifying the cumulative probability for the top-p tokens to be considered during text generation. |
| top_k              | Int                             | 50            | Between 0 and 100                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Determines the number of top-k tokens to consider during text generation, allowing control over response diversity.                              |
| repetition_penalty | Float                           | 1.0           | Between 1.0 and 2.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Discourages the repetition of identical or similar phrases in the generated text. Higher values increase the penalty for repetition.             |

### Outputs Parameters

The fetch method returns a promise that resolves to the chat completion response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name           | Data Type                                       | Description                                                                                               |
| ------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| data                     | object                                          | Contains the output text, input and output token lengths, model time taken, throughput, and latency.      |
| data.output              | object                                          | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys. |
| data.output.type         | string                                          | Specifies the type of the generated content. This API will always generate **"text"** type output.        |
| data.output.data         | string                                          | Contains the actual generated content.                                                                    |
| data.input_token_length  | number                                          | Provides information about the token length of the input provided to the API.                             |
| data.output_token_length | number                                          | Indicates the token length of the generated output.                                                       |
| data.model_time_taken    | number                                          | Indicates the time (in seconds) taken by the model to generate the output.                                |
| data.throughput          | number                                          | Indicates the throughput (tokens generated per second) of the generated output.                           |
| data.latency             | number                                          | Indicates the latency (response time in milliseconds) of the AI model.                                    |
| status                   | number                                          | The HTTP status code of the response.                                                                     |
| statusText               | string                                          | The status message of the response.                                                                       |
| headers                  | RawAxiosResponseHeaders \| AxiosResponseHeaders | The headers of the response.                                                                              |
| config                   | InternalAxiosRequestConfig                      | The Axios request configuration.                                                                          |
| request (optional)       | object                                          | The original request object.                                                                              |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

// chat completion parameters
const conversations = [
  { role: "system", content: "Hello" },
  { role: "user", content: "How are you?" },
  { role: "ai", content: "I'm good, thanks!" },
  { role: "user", content: "What's the weather like today?" },
  { role: "ai", content: "It's sunny and warm." },
  { role: "user", content: "Great! Have a nice day!" },
];
const maxNewTokens = 512;
const doSample = true;
const temperature = 0.5;
const topP = 0.8;
const topK = 50;
const repetitionPenalty = 1;

// Fetch chat completion
nelaAGI.text.chatCompletion
  .fetch(
    conversations,
    maxNewTokens,
    doSample,
    temperature,
    topP,
    topK,
    repetitionPenalty
  )
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

## Image based AI tasks

## ImageGeneration

The `imageGeneration: ImageGeneration`: is a property of the `image: Image` class and is used for generating images using the NelaAGI API. It provides a method called `fetch` that takes in prompt and various parameters, and returns a promise that resolves to the image generation response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/image-based-ai-tasks/image-generation/)

### Methods

- `fetch(prompt, negativePrompt, width, height, cropsCoordsTopLeftX, cropsCoordsTopLeftY, seed, numInferenceSteps, guidanceScale, imageFormat)`: Fetches image generation from the NelaAGI API based on the provided prompts and parameters. It performs input validation and returns a promise that resolves to the generated image.

### Input Parameters

| Parameter Name          | Data Type     | Default Value | Constraints                                                       | Description                                                                                                   |
| ----------------------- | ------------- | ------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| prompt                  | str           | Nil           | Prompt length should be between 3 and 275 characters.             | Textual description guiding AI in image generation.                                                           |
| negative_prompt         | Optional[str] | Nil           | Negative Prompt length should be between 3 and 275 characters.    | Provides constraints to guide AI away from undesired themes.                                                  |
| width                   | int           | 1024          | Width should be between 512 and 1024 px.                          | Specifies the width of the generated image. Increasing may improve detail, decreasing may reduce image size.  |
| height                  | int           | 1024          | Height should be between 512 and 1024 px.                         | Specifies the height of the generated image. Increasing may improve detail, decreasing may reduce image size. |
| crops_coords_top_left_x | int           | 0             | crops_coords_top_left_x value must be between 0 and 1024 px.      | X-coordinate of top-left corner of crop area within the image.                                                |
| crops_coords_top_left_y | int           | 0             | crops_coords_top_left_y value must be between 0 and 1024 px.      | Y-coordinate of top-left corner of crop area within the image.                                                |
| seed                    | int           | 0             | Seed should be between 0 and 9999999999 value.                    | Initializes random number generator for reproducibility.                                                      |
| num_inference_steps     | int           | 25            | num_inference_steps should be between 1 and 75 value.             | Number of iterations for image generation. Increasing may enhance detail but prolong processing time.         |
| guidance_scale          | float         | 5.0           | guidance_scale should be between 0 and 15 value.                  | Scaling factor for importance of prompt and negative prompt.                                                  |
| image_format            | str           | JPEG          | image_format should be in **“PNG”** and **“JPEG”** image formats. | Desired format of generated image.                                                                            |

### Outputs Parameters

The fetch method returns a promise that resolves to the image generation response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                       | Description                                                                                                |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| data                  | object                                          | Contains the output image, model time taken.                                                               |
| data.output           | object                                          | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.  |
| data.output.type      | string                                          | Specifies the type of the generated content. This API will always generate **"image_base64"** type output. |
| data.output.data      | string                                          | Contains the actual generated image_base64 content.                                                        |
| data.model_time_taken | number                                          | Indicates the time (in seconds) taken by the model to generate the output.                                 |
| status                | number                                          | The HTTP status code of the response.                                                                      |
| statusText            | string                                          | The status message of the response.                                                                        |
| headers               | RawAxiosResponseHeaders \| AxiosResponseHeaders | The headers of the response.                                                                               |
| config                | InternalAxiosRequestConfig                      | The Axios request configuration.                                                                           |
| request (optional)    | object                                          | The original request object.                                                                               |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

// image generation parameters
const prompt = "A beautiful sunset over the ocean";
const negativePrompt = "No people in the image";
const width = 512;
const height = 512;
const cropsCoordsTopLeftX = 0;
const cropsCoordsTopLeftY = 0;
const seed = 12345;
const numInferenceSteps = 50;
const guidanceScale = 7.5;
const imageFormat = "JPEG";

// Fetch image generation
nelaAGI.image.imageGeneration
  .fetch(
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
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

## ImageToImage

The `imageToImage: ImageToImage`: is a property of the `image: Image` class and is used for performing image-to-image transformations using the NelaAGI API. It provides a method called `fetch` that takes in image, prompt and various parameters, and returns a promise that resolves to the image-to-image generation response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/image-based-ai-tasks/image-to-image/)

### Methods

- `fetch(image, prompt, negativePrompt, cropsCoordsTopLeftX, cropsCoordsTopLeftY, seed, numInferenceSteps, strength, guidanceScale, imageFormat)`: Fetches image-to-image from the NelaAGI API based on the provided image, prompts and parameters. It performs input validation and returns a promise that resolves to the generated image.

### Input Parameters

| Parameter Name          | Data Type     | Default Value | Constraints                                                      | Description                                                                                                                                       |
| ----------------------- | ------------- | ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| image                   | File          | Nil           | image_content_type should be in PNG and JPEG image formats       | Specifies the input image file for transformation. Must be in PNG or JPEG format.                                                                 |
| prompt                  | str           | Nil           | Prompt length should be between 3 and 275 characters             | Provides instructions or guidance to the AI model for image transformation.                                                                       |
| negative_prompt         | Optional[str] | Nil           | Negative Prompt length should be between 3 and 275 characters    | Provides constraints or guidance away from undesired outcomes for the AI model.                                                                   |
| crops_coords_top_left_x | int           | 0             | crops_coords_top_left_x value must be between 0 and 1024 px      | Sets the x-coordinate of the top-left corner of the crop area within the generated image.                                                         |
| crops_coords_top_left_y | int           | 0             | crops_coords_top_left_y value must be between 0 and 1024 px      | Sets the y-coordinate of the top-left corner of the crop area within the generated image.                                                         |
| seed                    | int           | 0             | Seed should be between 0 and 9999999999 value                    | Initializes the random number generator for reproducibility of results.                                                                           |
| num_inference_steps     | int           | 25            | num_inference_steps should be between 1 and 75 value             | Specifies the number of iterations the AI model should perform during transformation. Increasing enhances detail but may prolong processing time. |
| strength                | float         | 0.5           | strength should be between 0.0 and 1.0 value                     | Controls the intensity of transformation applied to the input image. Higher values result in more significant changes.                            |
| guidance_scale          | float         | 5.0           | guidance_scale should be between 0 and 15 value                  | Scales the importance of prompt and negative prompt in the transformation process. Higher values emphasize guidance more strongly.                |
| image_format            | str           | JPEG          | image_format should be in **“PNG”** and **“JPEG”** image formats | Specifies the desired format of the generated image. Must be PNG or JPEG.                                                                         |

### Outputs Parameters

The fetch method returns a promise that resolves to the image-to-image response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                       | Description                                                                                                |
| --------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| data                  | object                                          | Contains the output image and model time taken.                                                            |
| data.output           | object                                          | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.  |
| data.output.type      | string                                          | Specifies the type of the generated content. This API will always generate **"image_base64"** type output. |
| data.output.data      | string                                          | Contains the actual generated image_base64 content.                                                        |
| data.model_time_taken | number                                          | Indicates the time (in seconds) taken by the model to generate the output.                                 |
| status                | number                                          | The HTTP status code of the response.                                                                      |
| statusText            | string                                          | The status message of the response.                                                                        |
| headers               | RawAxiosResponseHeaders \| AxiosResponseHeaders | The headers of the response.                                                                               |
| config                | InternalAxiosRequestConfig                      | The Axios request configuration.                                                                           |
| request (optional)    | object                                          | The original request object.                                                                               |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

//  image-to-image parameters
const image = new File(["image data"], "image.jpg"); // Replace this line with actual image data
const prompt = "A beautiful sunset over the ocean";
const negativePrompt = "No people in the image";
const cropsCoordsTopLeftX = 0;
const cropsCoordsTopLeftY = 0;
const seed = 12345;
const numInferenceSteps = 50;
const strength = 0.9;
const guidanceScale = 7.5;
const imageFormat = "JPEG";

// Fetch  image-to-image
nelaAGI.image.imageToImage
  .fetch(
    image,
    prompt,
    negativePrompt,
    cropsCoordsTopLeftX,
    cropsCoordsTopLeftY,
    seed,
    numInferenceSteps,
    strength,
    guidanceScale,
    imageFormat
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

## ImageInpainting

The `imageInpainting: ImageInpainting`: is a property of the `image: Image` class and is used for performing image inpainting using the NelaAGI API. It provides a method called `fetch` that takes in image, maskImage, prompt and various parameters, and returns a promise that resolves to the image-inpainting generation response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/image-based-ai-tasks/image-inpainting/)

### Methods

- `fetch(image, maskImage, prompt, negativePrompt, width, height, cropsCoordsTopLeftX, cropsCoordsTopLeftY, seed, numInferenceSteps, strength, guidanceScale, imageFormat)`: Fetches image-inpainting from the NelaAGI API based on the provided image, maskImage, prompts and parameters. It performs input validation and returns a promise that resolves to the generated image.

### Input Parameters

| Parameter Name          | Data Type     | Default Value | Constraints                                                      | Description                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------- | ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| image                   | File          | Nil           | image_content_type should be in PNG and JPEG image formats       | Specifies the input image file for the inpainting process.                                                                                                                                                                                                                                                                                                                     |
| mask_image              | File          | Nil           | mask_image_content_type should be in PNG and JPEG image formats  | Specifies the mask image indicating areas to be inpainted. Typically, this mask image is a binary image where the areas to be in-painted are marked as white (255) and the rest as black (0). The algorithm utilizes this mask to guide the inpainting process, ensuring that only the specified areas are affected by the restoration while preserving the rest of the image. |
| prompt                  | str           | Nil           | Prompt length should be between 3 and 275 characters.            | Provides textual guidance or instructions for the AI model to transform the image.                                                                                                                                                                                                                                                                                             |
| negative_prompt         | Optional[str] | Nil           | Negative Prompt length should be between 3 and 275 characters.   | Optional constraint to guide the AI away from undesired outcomes.                                                                                                                                                                                                                                                                                                              |
| width                   | int           | 1024          | Width should be between 512 and 1024 px.                         | Specifies the desired width of the output image.                                                                                                                                                                                                                                                                                                                               |
| height                  | int           | 1024          | Height should be between 512 and 1024 px.                        | Specifies the desired height of the output image.                                                                                                                                                                                                                                                                                                                              |
| crops_coords_top_left_x | int           | 0             | crops_coords_top_left_x value must be between 0 and 1024 px.     | Specifies the x-coordinate of the top-left corner of the crop area within the generated image.                                                                                                                                                                                                                                                                                 |
| crops_coords_top_left_y | int           | 0             | crops_coords_top_left_y value must be between 0 and 1024 px.     | Specifies the y-coordinate of the top-left corner of the crop area within the generated image.                                                                                                                                                                                                                                                                                 |
| seed                    | int           | 0             | Seed should be between 0 and 9999999999 value.                   | Initializes the random number generator for result reproducibility.                                                                                                                                                                                                                                                                                                            |
| num_inference_steps     | int           | 25            | num_inference_steps should be between 1 and 75 value.            | Controls the number of iterations during the image inpainting process.                                                                                                                                                                                                                                                                                                         |
| strength                | float         | 0.5           | strength should be between 0.0 and 1.0 value.                    | Influences the intensity of transformation applied to the image.                                                                                                                                                                                                                                                                                                               |
| guidance_scale          | float         | 5.0           | guidance_scale should be between 0 and 15 value.                 | Scales the influence of prompt and negative prompt on the inpainting process.                                                                                                                                                                                                                                                                                                  |
| image_format            | str           | JPEG          | image_format should be in **“PNG”** and **“JPEG”** image formats | Specifies the format of the generated image.                                                                                                                                                                                                                                                                                                                                   |

### Outputs Parameters

| Parameter Name        | Data Type                                     | Description                                                                                                |
| --------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| data                  | object                                        | Contains the output image, model time taken.                                                               |
| data.output           | object                                        | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.  |
| data.output.type      | string                                        | Specifies the type of the generated content. This API will always generate **"image_base64"** type output. |
| data.output.data      | string                                        | Contains the actual generated image_base64 content.                                                        |
| data.model_time_taken | number                                        | Indicates the time (in seconds) taken by the model to generate the output.                                 |
| status                | number                                        | The HTTP status code of the response.                                                                      |
| statusText            | string                                        | The status message of the response.                                                                        |
| headers               | RawAxiosResponseHeaders\|AxiosResponseHeaders | The headers of the response.                                                                               |
| config                | InternalAxiosRequestConfig                    | The Axios request configuration.                                                                           |
| request (optional)    | object                                        | The original request object.                                                                               |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

//  image-inpainting parameters
const image = new File(["image data"], "image.jpg"); // Replace this line with actual image data
const maskImage = new File(["mask image data"], "mask_image.jpg"); // Replace this line with actual mask image data
const prompt = "A beautiful sunset over the ocean";
const negativePrompt = "No people in the image";
const width = 512;
const height = 512;
const cropsCoordsTopLeftX = 0;
const cropsCoordsTopLeftY = 0;
const seed = 12345;
const numInferenceSteps = 50;
const strength = 0.9;
const guidanceScale = 7.5;
const imageFormat = "JPEG";

// Fetch  image-inpainting
nelaAGI.image.imageInpainting
  .fetch(
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
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Impact of Increasing/Decreasing Parameters:

- **Prompt & Negative Prompt:** Altering the prompts can change the style, content, or theme of the generated image. Increasing complexity might result in more intricate images, while simplifying prompts might lead to more straightforward outputs.
- **Width & Height:** Adjusting these parameters changes the aspect ratio and size of the output image. Increasing them can enhance details but might also increase processing time and resource consumption.
- **Num Inference Steps:** More steps generally lead to finer details and better generation, but may also increase processing time.
- **Strength:** Increasing strength intensifies the effect of the prompt, potentially making the transformation more pronounced. Decreasing it might yield subtler changes.
- **Guidance Scale:** Higher values prioritize the guidance provided by the prompts, while lower values give more freedom to the AI, possibly resulting in more creative but less guided outputs.

## Audio based AI tasks

## TextToSpeech

The `textToSpeech: TextToSpeech` is a property of the `audio: Audio` class and is used to fetch text-to-speech audio from the Nela AGI API. It provides a method called `fetch` that takes in text, speaker ID, and speaker gender as parameters, and returns a promise that resolves to the generated speech audio response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/audio-based-ai-tasks/text-to-speech/)

### Methods

- `fetch(text, speakerId, speakerGender)`: Fetch text-to-speech from the Nela AGI API based on the provided text and parameters. It validates the input parameters and returns a promise that resolves to the text-to-speech response from the API.

### Input Parameters

| Parameter Name | Data Type     | Default Value | Constraints                                                           | Description                                                           |
| -------------- | ------------- | ------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| text           | str           | Nil           | Text length should be between 2 and 5000 characters.                  | Represents the text to be converted into speech.                      |
| speaker_id     | Optional[int] | None          | speaker_id should be between 1 and 110.                               | Specifying the speaker voice id for generated speech.                 |
| speaker_gender | Optional[str] | None          | speaker_gender should be in **“MALE”** and **“FEMALE”** image formats | Determines the gender identity of the voice used in the audio output. |

### Outputs Parameters

The fetch method returns a promise that resolves to the text-to-speech response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                     | Description                                                                                                |
| --------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| data                  | object                                        | Contains the output audio, model time taken.                                                               |
| data.output           | object                                        | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.  |
| data.output.type      | string                                        | Specifies the type of the generated content. This API will always generate **"audio_base64"** type output. |
| data.output.data      | string                                        | Contains the actual generated audio_base64 content.                                                        |
| data.model_time_taken | number                                        | Indicates the time (in seconds) taken by the model to generate the output.                                 |
| status                | number                                        | The HTTP status code of the response.                                                                      |
| statusText            | string                                        | The status message of the response.                                                                        |
| headers               | RawAxiosResponseHeaders\|AxiosResponseHeaders | The headers of the response.                                                                               |
| config                | InternalAxiosRequestConfig                    | The Axios request configuration.                                                                           |
| request (optional)    | object                                        | The original request object.                                                                               |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

//  text-to-speech parameters
const text = "Hello, how are you?";
const speakerId = 1;
const speakerGender = "MALE";

// Fetch  text-to-speech
nelaAGI.audio.textToSpeech
  .fetch(text, speakerId, speakerGender)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

## SpeechToText

The `speechToText: SpeechToText` is a property of the `audio: Audio` class and is used to fetch speech-to-text audio from the Nela AGI API. It provides a method called `fetch` that takes in audio as parameters, and returns a promise that resolves to the transcribed text response from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/audio-based-ai-tasks/speech-to-text/)

### Methods

- `fetch(audio)`: Fetch speech-to-text from the Nela AGI API based on the provided audio and parameters. It validates the input parameters and returns a promise that resolves to the speech-to-text response from the API.

### Input Parameters

| Parameter Name | Data Type | Default Value | Constraints                                                      | Description                                                                                                                  |
| -------------- | --------- | ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| audio          | File      | Nil           | audio_content_type should be in MP3, MPEG and WAV audio formats. | Specifies the audio file containing the spoken language to transcribe. Ensure the audio file is in MP3, MPEG, or WAV format. |

### Outputs Parameters

The fetch method returns a promise that resolves to the speech-to-text response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                     | Description                                                                                               |
| --------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| data                  | object                                        | Contains the output text, model time taken.                                                               |
| data.output           | object                                        | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys. |
| data.output.type      | string                                        | Specifies the type of the generated content. This API will always generate **"text"** type output.        |
| data.output.data      | string                                        | Contains the actual generated text content.                                                               |
| data.model_time_taken | number                                        | Indicates the time (in seconds) taken by the model to generate the output.                                |
| status                | number                                        | The HTTP status code of the response.                                                                     |
| statusText            | string                                        | The status message of the response.                                                                       |
| headers               | RawAxiosResponseHeaders\|AxiosResponseHeaders | The headers of the response.                                                                              |
| config                | InternalAxiosRequestConfig                    | The Axios request configuration.                                                                          |
| request (optional)    | object                                        | The original request object.                                                                              |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

// speech-to-text parameters
const audio = new File(["audio data"], "audio.mp3", { type: "audio/mp3" }); // Replace this line with actual audio data

// Fetch  speech-to-text
nelaAGI.audio.speechToText
  .fetch(audio)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

## SpeechEnhancement

The `speechEnhancement: SpeechEnhancement` is a property of the `audio: Audio` class and is used to fetch speech-enhancement audio from the Nela AGI API. It provides a method called `fetch` that takes in audio as parameters, and returns a promise that resolves to the enhancement speech audio from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/audio-based-ai-tasks/speech-enhancementt/)

### Methods

- `fetch(audio)`: Fetch speech-enhancement from the Nela AGI API based on the provided audio and parameters. It validates the input parameters and returns a promise that resolves to the speech-enhancement response from the API.

### Input Parameters

| Parameter Name | Data Type | Default Value | Constraints                                                      | Description                                                                       |
| -------------- | --------- | ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| audio          | File      | Nil           | audio_content_type should be in MP3, MPEG and WAV audio formats. | Specifies the audio file to enhance. Ensure the file format is MP3, MPEG, or WAV. |

### Outputs Parameters

The fetch method returns a promise that resolves to the speech-enhancement response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                     | Description                                                                                                |
| --------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| data                  | object                                        | Contains the output audio, model time taken.                                                               |
| data.output           | object                                        | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.  |
| data.output.type      | string                                        | Specifies the type of the generated content. This API will always generate **"audio_base64"** type output. |
| data.output.data      | string                                        | Contains the actual generated audio_base64 content.                                                        |
| data.model_time_taken | number                                        | Indicates the time (in seconds) taken by the model to generate the output.                                 |
| status                | number                                        | The HTTP status code of the response.                                                                      |
| statusText            | string                                        | The status message of the response.                                                                        |
| headers               | RawAxiosResponseHeaders\|AxiosResponseHeaders | The headers of the response.                                                                               |
| config                | InternalAxiosRequestConfig                    | The Axios request configuration.                                                                           |
| request (optional)    | object                                        | The original request object.                                                                               |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

// speech-enhancement parameters
const audio = new File(["audio data"], "audio.mp3", { type: "audio/mp3" }); // Replace this line with actual audio data

// Fetch speech-enhancement
nelaAGI.audio.speechEnhancement
  .fetch(audio)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

## MusicSeparation

The `musicSeparation: MusicSeparation` is a property of the `audio: Audio` class and is used to fetch music-separation audio from the Nela AGI API. It provides a method called `fetch` that takes in audio and split as parameters, and returns a promise that resolves to the music separated audio from the API. ["Learn More"](https://hub.eliteappmakers.in/docs/nela-gen-beta/audio-based-ai-tasks/music-separation/)

### Methods

- `fetch(audio)`: Fetch music-separation from the Nela AGI API based on the provided audio and split parameters. It validates the input parameters and returns a promise that resolves to the music-separation response from the API.

### Input Parameters

| Parameter Name | Data Type | Default Value | Constraints                                                      | Description                                                                                                                                                                                                                                          |
| -------------- | --------- | ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| audio          | File      | Nil           | audio_content_type should be in MP3, MPEG and WAV audio formats. | Specifies the audio file to segment or dissect. Use this parameter to provide the audio file you want to separate into music sections or isolate vocals for karaoke purposes.                                                                        |
| split          | str       | KARAOKE       | split should be in ALL or KARAOKE segmentation format.           | Determines the type of separation to perform on the audio file. Use **"ALL"** to segment the entire file into distinct music sections (e.g., vocals, drums, bass). Use **"KARAOKE"** to isolate vocals from background music or instrumental tracks. |

### Outputs Parameters

The fetch method returns a promise that resolves to the speech-enhancement response from the API. The response is an AxiosResponse object with the following structure

| Parameter Name        | Data Type                                     | Description                                                                                                                    |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| data                  | object                                        | Contains the output audio, model time taken.                                                                                   |
| data.output           | object                                        | Contains the generated content. It is a list containing a dictionary with **"type"** and **"data"** keys.                      |
| data.output.type      | string                                        | Specifies the type of the generated content. This API will always generate both **“text”** and **"audio_base64"** type output. |
| data.output.data      | string                                        | Contains the actual generated audio_base64 content.                                                                            |
| data.model_time_taken | number                                        | Indicates the time (in seconds) taken by the model to generate the output.                                                     |
| status                | number                                        | The HTTP status code of the response.                                                                                          |
| statusText            | string                                        | The status message of the response.                                                                                            |
| headers               | RawAxiosResponseHeaders\|AxiosResponseHeaders | The headers of the response.                                                                                                   |
| config                | InternalAxiosRequestConfig                    | The Axios request configuration.                                                                                               |
| request (optional)    | object                                        | The original request object.                                                                                                   |

### Example Usage

```javascript
import { NelaAGI } from "../nela-agi";

const nelaAGI = new NelaAGI("account_id", "auth_key");

// music-separation parameters
const audio = new File(["audio data"], "audio.mp3", { type: "audio/mp3" }); // Replace this line with actual audio data
const split = "ALL";

// Fetch music-separation
nelaAGI.audio.musicSeparation
  .fetch(audio, split)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

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

## Usage with CommonJS (require)

```javascript
const { NelaAGI, NelaAGIError } = require("nela-agi");
```

## Usage with ES modules (import)

```javascript
import { NelaAGI, NelaAGIError } from "nela-agi";
```

## Usage with TypeScript

```javascript
import { NelaAGI, NelaAGIError } from "nela-agi";
```

## NelaAGI

The `NelaAGI` class represents an instance of the NelaAGI API client, which provides access to various AI tasks including text-based, image-based, and audio-based tasks. It requires an account ID and authentication key to be instantiated. The class has properties for accessing different types of AI tasks, such as text, image, and audio. It also has a `fetch` method for making API requests.

## Parameters

- `accountId: string`: The account ID for the NelaAGI client. If not provided, it will attempt to read the **"NELA_ACCOUNTID"** environment variable.
- `authKey: string`: The authentication key for the NelaAGI client. If not provided, it will attempt to read the **"NELA_AUTHKEY"** environment variable.

## Properties

- `text: Text`: Provides access to various text-based AI tasks, including chat completion.
- `image: Image`: Provides access to various image-based AI tasks, including image generation, image-to-image translation, and image inpainting.
- `audio: Audio`: Provides access to various audio-based AI tasks, including text to speech, speech to text, speech enhancement, and music separation.

## Methods

- `fetch(url: string, method: string, requestData: object, isMultipartFormData: Boolean): Promise<AxiosResponse>`: Fetches data from the API using the specified URL, HTTP method, request data, and whether the request is multipart form data. Returns a promise that resolves with the response on success or rejects with an error message on failure.

## Example Usage

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

## Parameters

- `status_code: number`: A number representing the HTTP status code associated with the error.
- `detail: string`: A string containing a detailed message describing the error.

## Example Usage

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

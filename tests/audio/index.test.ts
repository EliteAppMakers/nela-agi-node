import { NelaAGI } from "../../src";
import { Audio } from "../../src/audio";
import { MusicSeparation } from "../../src/audio/music-separation";
import { SpeechEnhancement } from "../../src/audio/speech-enhancement";
import { SpeechToText } from "../../src/audio/speech-to-text";
import { TextToSpeech } from "../../src/audio/text-to-speech";

describe("Audio", () => {
  // Text class can be instantiated with an instance of NelaAGI class.
  it("should instantiate Audio class with an instance of NelaAGI class", () => {
    const client = new NelaAGI("123456789012", "validAuthKey");
    const audio = new Audio(client);

    expect(audio).toBeInstanceOf(Audio);
    expect(audio.getClient()).toBe(client);
    expect(audio).toHaveProperty("textToSpeech");
    expect(audio).toHaveProperty("speechToText");
    expect(audio).toHaveProperty("speechEnhancement");
    expect(audio).toHaveProperty("musicSeparation");
    expect(audio.textToSpeech).toBeInstanceOf(TextToSpeech);
    expect(audio.speechToText).toBeInstanceOf(SpeechToText);
    expect(audio.speechEnhancement).toBeInstanceOf(SpeechEnhancement);
    expect(audio.musicSeparation).toBeInstanceOf(MusicSeparation);
    expect(audio.textToSpeech.getClient()).toBe(client);
    expect(audio.speechToText.getClient()).toBe(client);
    expect(audio.speechEnhancement.getClient()).toBe(client);
    expect(audio.musicSeparation.getClient()).toBe(client);
  });
});

import { API } from "../api";
import { MusicSeparation } from "./music-separation";
import { SpeechEnhancement } from "./speech-enhancement";
import { SpeechToText } from "./speech-to-text";
import { TextToSpeech } from "./text-to-speech";

/**
 * The `Audio` class provides access to various audio based AI tasks, including text to speech, speech to text, speech enhancement and music separation.
 *
 * @param client - An instance of the `NelaAGI` class.
 *
 * @property {TextToSpeech} textToSpeech - Provides methods for converting text into spoken audio.
 * @property {SpeechToText} speechToText - Provides methods for transcribing speech into text.
 * @property {SpeechEnhancement} speechEnhancement - Provides methods for enhancing speech audio quality.
 * @property {MusicSeparation} musicSeparation - Provides methods for separating music sources from music songs.
 */
export class Audio extends API {
  /**
   * The `textToSpeech` property provides methods for converting text into spoken audio.
   *
   * @function fetch - Fetch text to speech from the Nela AGI API.
   */
  textToSpeech = new TextToSpeech(this._client);
  /**
   * The `speechToText` property provides methods for transcribing speech into text.
   *
   * @function fetch - Fetch speech to text from the Nela AGI API.
   */
  speechToText = new SpeechToText(this._client);
  /**
   * The `speechEnhancement` property provides methods for enhancing speech audio quality.
   *
   * @function fetch - Fetch speech enhancement from the Nela AGI API.
   */
  speechEnhancement = new SpeechEnhancement(this._client);
  /**
   * The `musicSeparation` property provides methods for separating music sources from music songs.
   *
   * @function fetch - Fetch music separation from the Nela AGI API.
   */
  musicSeparation = new MusicSeparation(this._client);
}

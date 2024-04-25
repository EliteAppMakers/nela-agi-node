import type { NelaAGI } from "./index";

/**
 * Represents an API class.
 *
 * @class API
 */
export class API {
  protected _client: NelaAGI;

  constructor(client: NelaAGI) {
    this._client = client;
  }

  public getClient() {
    return this._client;
  }
}

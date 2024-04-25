/**
 * Custom error class for handling errors in the Nela AGI.
 *
 * @param status_code - The status code for the error.
 * @param detail - The detail message for the error.
 */
export class NelaAGIError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  status_code: number;
  /**
   * A detailed message describing the error.
   */
  detail: string;

  constructor(status_code: number, detail: string) {
    super(detail);
    this.status_code = status_code;
    this.detail = detail;
  }
}

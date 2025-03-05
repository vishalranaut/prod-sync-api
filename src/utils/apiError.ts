/** @format */

export class ApiError extends Error {
  status: any;
  error: any;

  constructor(status: any, message: any, error: any = true, stack = "") {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

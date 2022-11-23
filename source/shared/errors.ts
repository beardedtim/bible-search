export class UnknownError extends Error {
  code = 1000;
  constructor(cause?: Error) {
    super();

    this.cause = cause;

    this.message = `We had an internal error of some kind that we did not expect`;
  }
}

export class BadInput extends Error {
  code = 1001;
  reason: string;
  constructor(reason: string, cause?: Error) {
    super();

    this.cause = cause;

    this.message = `We were given bad input and cannot perform the requested action. See cause for more details`;
    this.reason = reason;
  }
}

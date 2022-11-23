export class BadInput extends Error {
  statusCode = 400;
  constructor(msg: string, cause?: Error) {
    super();

    this.cause = cause;

    this.message = `Cannot perform action due to bad input: ${msg}`;
  }
}

export class NeedAuthentication extends Error {
  statusCode = 401;
  constructor(cause?: Error) {
    super();
    this.cause = cause;

    this.message =
      'You must be authenticated to perform that action. Please authenticate via Bearer token and retry';
  }
}

export class NotAuthorized extends Error {
  statusCode = 403;
  constructor(cause?: Error) {
    super();
    this.cause = cause;

    this.message =
      'You are not allowed to view that resource or perform that action.';
  }
}

export class Internal extends Error {
  statusCode = 500;
  constructor(cause?: Error) {
    super();
    this.cause = cause;

    this.message = `There is something going wrong internal with this system. Please contact an admin.`;
  }
}

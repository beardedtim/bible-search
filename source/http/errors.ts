export class NeedAuthentication extends Error {
  statusCode = 401;
  constructor() {
    super();
    this.message =
      'You must be authenticated to perform that action. Please authenticate via Bearer token and retry';
  }
}

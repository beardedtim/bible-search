import Log from '@shared/log';

export type CloseHandler = (reason: any) => Promise<unknown> | unknown;
export type ErrorHandler = (err: Error) => Promise<unknown> | unknown;

class Manager {
  #closeHandlers = new Set<CloseHandler>();
  #errorHandlers = new Set<ErrorHandler>();

  onClose(handler: CloseHandler) {
    this.#closeHandlers.add(handler);

    return this;
  }

  onError(handler: ErrorHandler) {
    this.#errorHandlers.add(handler);

    return this;
  }

  async shutdown(reason: any) {
    Log.info({ reason }, 'Shutting down');

    for (const handler of this.#closeHandlers.values()) {
      await handler(reason);
    }

    Log.info({ reason }, 'Handlers called. Releasing');
    process.exit(0);
  }

  async error(err: Error) {
    Log.warn({ err }, 'Process Error.');

    for (const handler of this.#errorHandlers.values()) {
      await handler(err);
    }

    Log.debug({ err }, 'Error Handlers caled. Calling shutdown handlers');

    for (const handler of this.#closeHandlers.values()) {
      await handler(err);
    }

    process.exit(1);
  }
}

export default new Manager();

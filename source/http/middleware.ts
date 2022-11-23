import Log from '@shared/log';
import { STATUS_CODES } from 'http';
import type { Logger } from 'pino';
import type { Middleware, Context } from 'koa';

interface ReqLoggerConfig {
  logger?: Logger;
  skip?: (ctx: Context) => boolean;
}

export const reqLogger =
  ({
    logger = Log.child({ service: 'Request Logger' }),
    skip = () => false,
  }: ReqLoggerConfig): Middleware =>
  async (ctx, next) => {
    await next();

    if (!skip(ctx)) {
      const status = ctx.status || 404;
      const headers = ctx.res.getHeaders();
      const method = ctx.method;
      const url = ctx.url;
      const msg = `[${method.toUpperCase()}] ${status} ${url}`;

      const meta = {
        status,
        headers,
        req: ctx.req,
        res: ctx.res,
      };

      if (status > 399) {
        logger.warn(meta, msg);
      } else {
        logger.trace(meta, msg);
      }
    }
  };

export const globalErrorHandler = (): Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (e: unknown) {
    const err = e as Error & { statusCode?: number };
    const status = err.statusCode || 500;
    const message = STATUS_CODES[status];
    const details = err.message || 'Internal Error Message';

    ctx.body = {
      error: {
        message,
        details: {
          message: details,
          status,
        },
      },
    };
  }
};

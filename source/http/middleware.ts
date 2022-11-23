import Log from '@shared/log';
import { STATUS_CODES } from 'http';
import { verify } from 'jsonwebtoken';

import * as InternalUseCases from '@app/domains/internal/use-cases';
import * as DomainErrors from '@shared/errors';
import * as HTTPErrors from './errors';

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

export const errorLogger =
  (msg: string): Middleware =>
  async (_, next) => {
    try {
      await next();
    } catch (e) {
      Log.warn({ err: e }, msg);
      throw e;
    }
  };

export const mapDomainErrorsToHTTP = (): Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (e: unknown) {
    if (e instanceof DomainErrors.UnknownError) {
      throw new HTTPErrors.Internal(e);
    }

    if (e instanceof DomainErrors.BadInput) {
      throw new HTTPErrors.BadInput(e.reason, e);
    }

    throw new HTTPErrors.Internal(e as Error);
  }
};

export const authenticate =
  (secret: string): Middleware =>
  async (ctx, next) => {
    if (!ctx.headers.authorization) {
      return next();
    }

    const token = ctx.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const data = await verify(token, secret);

      ctx.state.user = data;
    } catch (e) {
      // swallow error if we have invalid token
    }

    return next();
  };

export const onlyAuthenticated = (): Middleware => (ctx, next) => {
  if (!ctx.state.user) {
    throw new HTTPErrors.NeedAuthentication();
  }

  return next();
};

export const onlyIfUserIsAllowed =
  (action: string): Middleware =>
  async (ctx, next) => {
    if (!ctx.state.user) {
      Log.warn('No User Authenticated. Cannot authorize anything');

      throw new HTTPErrors.NotAuthorized();
    }

    if (!ctx.state.user.id) {
      Log.warn(
        { user: ctx.state.user },
        'User missing ID. Cannot authorize anything'
      );

      throw new HTTPErrors.NotAuthorized();
    }

    const isAllowed = await InternalUseCases.isUserAllowedToPerformAction(
      ctx.state.user.id,
      action
    );

    if (isAllowed) {
      return next();
    }

    Log.warn(
      { user: ctx.state.user, action },
      `User is not authorized to perform action "${action}"`
    );

    throw new HTTPErrors.NotAuthorized();
  };

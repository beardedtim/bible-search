import * as InternalUseCases from '@app/domains/internal/use-cases';

import type { Middleware } from 'koa';

interface Route {
  /**
   * What HTTP Method d you want to trigger this?
   */
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /**
   * What is the path-to-regexp string to trigger this route?
   */
  path: string;
  /**
   * You can add a list of middleware to be ran just for this handler
   */
  handler: Middleware | Middleware[];
}

export const liveness: Route = {
  method: 'get',
  path: '/.well-known/liveness',
  handler: async (ctx) => {
    if (InternalUseCases.isSystemAlive()) {
      ctx.status = 200;
      ctx.body = 'Alive';
    } else {
      ctx.status = 500;
      ctx.body = 'Not Alive. Check logs';
    }
  },
};

export const readiness: Route = {
  method: 'get',
  path: '/.well-known/readiness',
  handler: async (ctx) => {
    if (InternalUseCases.isSystemAlive()) {
      ctx.status = 200;
      ctx.body = 'Ready';
    } else {
      ctx.status = 500;
      ctx.body = 'Not Ready. Check logs';
    }
  },
};

export const testJWT: Route = {
  method: 'get',
  path: '/.well-known/jwt',
  handler: async (ctx) => {
    const result = InternalUseCases.testJWTAuthentication(ctx.state);

    ctx.body = { data: result };
  },
};
